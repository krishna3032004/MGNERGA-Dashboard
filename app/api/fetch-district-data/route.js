// app/api/fetch-district-data/route.js
import connectToDatabase from "@/lib/mongodb";
import District from "@/models/District";

const RESOURCE_URL = "https://api.data.gov.in/resource/ee03643a-ee4c-48c2-ac30-9f2ff26ab722";
const STATE_NAME = "MADHYA PRADESH";
// set FIN_YEAR to specific year like "2023-2024" or "" to fetch all years
// const FIN_YEAR = "2025-2026";
const FETCH_MODE = process.env.FETCH_MODE || "monthly";
const FETCH_PREVIOUS = process.env.FETCH_PREVIOUS === "1";
const LIMIT = process.env.DATA_GOV_LIMIT ? parseInt(process.env.DATA_GOV_LIMIT, 10) : 50;
const API_KEY = process.env.DATA_GOV_KEY || "579b464db66ec23bdd000001ec6750bb1df547757133216e45834aae";

async function fetchWithTimeout(url, timeout = 50000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

function safeInt(val) {
  const n = parseInt(String(val || "0").replace(/[, ]+/g, ""), 10);
  return Number.isNaN(n) ? 0 : n;
}
function safeFloat(val) {
  const n = parseFloat(String(val || "0").replace(/[, ]+/g, ""));
  return Number.isNaN(n) ? 0 : n;
}

/** return month name like "March" for a Date object */
function monthNameFromDate(d) {
  return d.toLocaleString("en-US", { month: "long" });
}

/** compute financial year like "2025-2026" from a Date (India FY Apr->Mar) */
function finYearFromDate(d) {
  const y = d.getFullYear();
  const m = d.getMonth() + 1; // 1..12
  const start = m >= 4 ? y : y - 1;
  return `${start}-${start + 1}`;
}

/** get target Date object: current or previous month depending on FETCH_PREVIOUS */
function getTargetDate() {
  const now = new Date();
  if (FETCH_PREVIOUS) {
    // clone and subtract one month
    const t = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return t;
  }
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export async function GET() {
  await connectToDatabase();

  
  const targetDate = getTargetDate();
  const TARGET_MONTH = monthNameFromDate(targetDate); // e.g. "March"
  const FIN_YEAR = finYearFromDate(targetDate); // e.g. "2025-2026"
  // For logging/response
  let offset = 0;
  let totalFetched = 0;
  let totalUpserted = 0;
  let totalUpdated = 0;

  try {
    while (true) {
      const params = new URLSearchParams({
        "api-key": API_KEY,
        format: "json",
        offset: String(offset),
        limit: String(LIMIT),
      });

      // add filters in the bracketed param style required by endpoint
      params.append("filters[state_name]", STATE_NAME);
      // if (FIN_YEAR) params.append("filters[fin_year]", FIN_YEAR);

       // when yearly mode we still restrict to FIN_YEAR (but that may be many records)
      if (FETCH_MODE === "yearly") {
        params.append("filters[fin_year]", FIN_YEAR);
      } else {
        // monthly mode -> fetch only target month & fin_year (recommended)
        params.append("filters[fin_year]", FIN_YEAR);
        params.append("filters[month]", TARGET_MONTH);
      }

      const url = `${RESOURCE_URL}?${params.toString()}`;

      // fetch
      let res;
      try {
        res = await fetchWithTimeout(url);
      } catch (err) {
        console.error("Fetch error:", err);
        return new Response(JSON.stringify({ success: false, error: "Fetch failed", details: String(err) }), { status: 502 });
      }

      if (!res.ok) {
        const txt = await res.text();
        console.error("data.gov non-OK:", res.status, txt.slice(0, 800));
        return new Response(JSON.stringify({ success: false, status: res.status, sample: txt.slice(0, 800) }), { status: 502 });
      }

      const text = await res.text();

      // If HTML returned by mistake, show sample and stop
      if (text.trim().startsWith("<")) {
        console.error("Non-JSON response (HTML) from data.gov:", text.slice(0, 1000));
        return new Response(JSON.stringify({
          success: false,
          note: "Non-JSON response from data.gov. Check API key / endpoint / network.",
          sample: text.slice(0, 1000)
        }), { status: 502 });
      }

      let json;
      try {
        json = JSON.parse(text);
        console.log(json)
      } catch (err) {
        console.error("JSON parse error:", err);
        return new Response(JSON.stringify({ success: false, error: "Invalid JSON", details: text.slice(0, 1000) }), { status: 500 });
      }

      const records = json.records || (json.result && json.result.records) || [];

      if (!records.length) {
        // if nothing on first page, return message
        if (offset === 0) {
          return new Response(JSON.stringify({ success: true, message: "No records returned", totalFetched: 0 , fin_year: FIN_YEAR,
            month: FETCH_MODE === "monthly" ? TARGET_MONTH : "ALL"}), { status: 200 });
        }
        break;
      }

      // upsert into DB
      for (const item of records) {
        // inside your `for (const item of records) { ... }` loop replace mapping with:

        const districtName = item.district_name || item.District || item.district || "UNKNOWN";
        const districtCode = item.district_code || item.districtCode || "";
        const month = item.month || item.Month || "";
        const financialYear = item.fin_year || item.financial_year || item.finYear || FIN_YEAR || "";
        const year = financialYear ? parseInt(String(financialYear).split("-")[0], 10) : new Date().getFullYear();

        // numeric safe parsing helpers (you already have safeInt, safeFloat)
        const Total_Households_Worked = safeInt(item.Total_Households_Worked || item.Total_Households_Worked || 0);
        const Total_Individuals_Worked = safeInt(item.Total_Individuals_Worked || item.Total_Individuals_Worked || 0);
        const Total_No_of_Active_Job_Cards = safeInt(item.Total_No_of_Active_Job_Cards || 0);
        const Total_No_of_Active_Workers = safeInt(item.Total_No_of_Active_Workers || 0);
        const Total_No_of_HHs_completed_100_Days_of_Wage_Employment = safeInt(item.Total_No_of_HHs_completed_100_Days_of_Wage_Employment || 0);
        const Total_No_of_JobCards_issued = safeInt(item.Total_No_of_JobCards_issued || 0);
        const Total_No_of_Works_Takenup = safeInt(item.Total_No_of_Works_Takenup || item.Total_No_of_Works_Takenup || 0);
        const Number_of_Completed_Works = safeInt(item.Number_of_Completed_Works || 0);
        const Number_of_Ongoing_Works = safeInt(item.Number_of_Ongoing_Works || 0);

        const Wages_val = safeFloat(item.Wages || item.Wages || 0);
        const Persondays = safeInt(item.Persondays_of_Central_Liability_so_far || item.Persondays_of_Central_Liability_so_far || 0);
        const Women_Persondays = safeInt(item.Women_Persondays || 0);
        const SC_persondays = safeInt(item.SC_persondays || 0);
        const ST_persondays = safeInt(item.ST_persondays || 0);

        const Approved_Labour_Budget = safeInt(item.Approved_Labour_Budget || 0);
        const Average_Wage_rate_per_day_per_person = safeFloat(item.Average_Wage_rate_per_day_per_person || 0);
        const Average_days_of_employment_provided_per_Household = safeFloat(item.Average_days_of_employment_provided_per_Household || 0);
        const percentage_payments_gererated_within_15_days = safeFloat(item.percentage_payments_gererated_within_15_days || item["percentage_payments_gererated_within_15_days"] || 0);

        // compute some quick KPIs for convenience
        const peopleBenefited = Total_Individuals_Worked;
        const wagesPaid = Wages_val;
        const workdaysCreated = Persondays;
        // compute completion rate as percentage (0-100) with 2 decimals
        const completionRate = (Total_No_of_Works_Takenup > 0)
          ? (Number_of_Completed_Works / Total_No_of_Works_Takenup) * 100
          : 0;
        const completionRatePercent = Math.round(completionRate * 100) / 100; // 2 decimals

       // upsert and detect if new vs updated (timestamps: true in model required)
        try {
          const res = await District.findOneAndUpdate(
            { name: districtName, month, year },
            {
              name: districtName,
              districtCode,
              state: STATE_NAME,
              month,
              financialYear,
              year,
              Total_Households_Worked,
              Total_Individuals_Worked,
              Total_No_of_Active_Job_Cards,
              Total_No_of_Active_Workers,
              Total_No_of_HHs_completed_100_Days_of_Wage_Employment,
              Total_No_of_JobCards_issued,
              Total_No_of_Works_Takenup,
              Number_of_Completed_Works,
              Number_of_Ongoing_Works,
              Wages: Wages_val,
              Persondays_of_Central_Liability_so_far: Persondays,
              Women_Persondays,
              SC_persondays,
              ST_persondays,
              Approved_Labour_Budget,
              Average_Wage_rate_per_day_per_person,
              Average_days_of_employment_provided_per_Household,
              percentage_payments_gererated_within_15_days,
              peopleBenefited,
              wagesPaid,
              workdaysCreated,
              completionRatePercent,
              raw: item,
            },
            { upsert: true, setDefaultsOnInsert: true, new: true }
          );

          totalFetched++;

          // If model uses timestamps: true then createdAt === updatedAt when newly inserted
          if (res && res.createdAt && res.updatedAt && String(res.createdAt) === String(res.updatedAt)) {
            totalUpserted++;
          } else {
            totalUpdated++;
          }
        } catch (dbErr) {
          console.error("DB upsert error for", districtName, month, year, dbErr);
        }
      }

      if (records.length < LIMIT) break;
      offset += LIMIT;
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Fetched ${totalFetched} records.`,
      fetched: totalFetched,
      upserted: totalUpserted,
      updated: totalUpdated,
      fin_year: FIN_YEAR,
      month: FETCH_MODE === "monthly" ? TARGET_MONTH : "ALL"
    }), { status: 200 });
  } catch (err) {
    console.error("Unexpected error in fetch-district-data:", err);
    return new Response(JSON.stringify({ success: false, error: String(err) }), { status: 500 });
  }
}
