// app/api/get-district/route.js
import connectToDatabase from "@/lib/mongodb";
import District from "@/models/District";

/**
 * Convert month name/abbr to numeric index for sorting.
 */
function monthToIndex(m) {
  if (!m) return 0;
  const mm = String(m).trim().toLowerCase();
  const map = {
    january: 1, february: 2, march: 3, april: 4, may: 5, june: 6, july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
    jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12
  };
  if (!isNaN(Number(mm))) return Number(mm);
  return map[mm] || 0;
}

/**
 * percentage change with two decimal places; returns null when not computable.
 */
function pctChange(oldV, newV) {
  if (oldV === null || oldV === undefined || oldV === 0) return null;
  // handle both numbers and numeric strings
  const oldN = Number(oldV) || 0;
  const newN = Number(newV) || 0;
  if (oldN === 0) return null;
  return Math.round(((newN - oldN) / oldN) * 10000) / 100; // two decimals
}

/**
 * Safe number conversion (handles strings with commas)
 */
function safeNum(v) {
  if (v === null || v === undefined) return 0;
  const s = String(v).replace(/[, ]+/g, "");
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name").toUpperCase();
    if (!name) return new Response(JSON.stringify({ error: "Missing name query param" }), { status: 400 });

    await connectToDatabase();

    // fetch all records for this district (lean for performance)
    const recs = await District.find({ name }).lean();
    if (!recs || recs.length === 0) {
      return new Response(JSON.stringify({ message: "No data for this district" }), { status: 400 });
    }

    // sort records chronologically (year then month index)
    recs.sort((a, b) => {
      const ya = Number(a.year || 0), yb = Number(b.year || 0);
      if (ya !== yb) return ya - yb;
      return monthToIndex(a.month) - monthToIndex(b.month);
    });

    // Build trend arrays using stored fields when available; otherwise fallback compute
    const months = [];
    const peopleTrend = [];
    const wagesTrend = [];
    const workdaysTrend = [];
    const completionTrend = [];
    const womenShareTrend = [];

    for (const r of recs) {
      months.push(`${r.month || ""}-${r.year || ""}`);

      // people: prefer peopleBenefited then Total_Individuals_Worked
      const people = safeNum(r.peopleBenefited ?? r.Total_Individuals_Worked);
      peopleTrend.push(people);

      const wages = safeNum(r.wagesPaid ?? r.Wages);
      wagesTrend.push(wages);

      const workdays = safeNum(r.workdaysCreated ?? r.Persondays_of_Central_Liability_so_far);
      workdaysTrend.push(workdays);

      // completion: prefer stored completionRatePercent; else compute from totals (as percent)
      const storedCompletion = (r.completionRatePercent !== undefined && r.completionRatePercent !== null)
        ? safeNum(r.completionRatePercent)
        : null;
      if (storedCompletion !== null && storedCompletion !== 0) {
        completionTrend.push(storedCompletion);
      } else {
        const totalWorks = safeNum(r.Total_No_of_Works_Takenup);
        const completed = safeNum(r.Number_of_Completed_Works);
        const perc = totalWorks ? Math.round((completed / totalWorks) * 10000) / 100 : 0;
        completionTrend.push(perc);
      }

      // women share (percent of persondays)
      const pd = safeNum(r.Persondays_of_Central_Liability_so_far);
      const wp = safeNum(r.Women_Persondays);
      const wShare = pd ? Math.round((wp / pd) * 10000) / 100 : 0;
      womenShareTrend.push(wShare);
    }

    const lastIdx = recs.length - 1;
    const latestRec = recs[lastIdx];

    // Latest snapshot (prefer stored simplified KPIs if present)
    const latest = {
      month: latestRec.month || "",
      year: latestRec.year || Number(latestRec.financialYear ? String(latestRec.financialYear).split("-")[0] : (latestRec.year || new Date().getFullYear())),
      peopleBenefited: safeNum(latestRec.peopleBenefited ?? latestRec.Total_Individuals_Worked),
      wagesPaid: safeNum(latestRec.wagesPaid ?? latestRec.Wages),
      workdaysCreated: safeNum(latestRec.workdaysCreated ?? latestRec.Persondays_of_Central_Liability_so_far),
      // prefer stored completionRatePercent if present else take last element from computed completionTrend
      completionRatePercent: (latestRec.completionRatePercent !== undefined && latestRec.completionRatePercent !== null)
        ? safeNum(latestRec.completionRatePercent)
        : (completionTrend[lastIdx] || 0),
      womenSharePercent: womenShareTrend[lastIdx] || 0,
      avgWageRate: safeNum(latestRec.Average_Wage_rate_per_day_per_person),
      avgDaysPerHH: safeNum(latestRec.Average_days_of_employment_provided_per_Household),
      activeJobCards: safeNum(latestRec.Total_No_of_Active_Job_Cards),
      householdsWorked: safeNum(latestRec.Total_Households_Worked),
      remarks: latestRec.raw?.Remarks || latestRec.Remarks || ""
    };

    // MoM (month-over-month) change using previous index
    let mom = { peoplePct: null, wagesPct: null, workdaysPct: null, completionPct: null };
    if (lastIdx > 0) {
      mom.peoplePct = pctChange(peopleTrend[lastIdx - 1], peopleTrend[lastIdx]);
      mom.wagesPct = pctChange(wagesTrend[lastIdx - 1], wagesTrend[lastIdx]);
      mom.workdaysPct = pctChange(workdaysTrend[lastIdx - 1], workdaysTrend[lastIdx]);
      mom.completionPct = pctChange(completionTrend[lastIdx - 1], completionTrend[lastIdx]);
    }

    // YoY: find record with same month and year-1
    const sameMonthLastYear = recs.find(r => (String(r.month).toLowerCase() === String(latestRec.month).toLowerCase()) && Number(r.year) === Number(latestRec.year) - 1);
    let yoy = { peoplePct: null, wagesPct: null, workdaysPct: null, completionPct: null };
    if (sameMonthLastYear) {
      yoy.peoplePct = pctChange(sameMonthLastYear.peopleBenefited ?? sameMonthLastYear.Total_Individuals_Worked, latest.peopleBenefited);
      yoy.wagesPct = pctChange(sameMonthLastYear.wagesPaid ?? sameMonthLastYear.Wages, latest.wagesPaid);
      yoy.workdaysPct = pctChange(sameMonthLastYear.workdaysCreated ?? sameMonthLastYear.Persondays_of_Central_Liability_so_far, latest.workdaysCreated);
      // For completion, prefer stored or compute
      const prevCompletion = (sameMonthLastYear.completionRatePercent !== undefined && sameMonthLastYear.completionRatePercent !== null)
        ? safeNum(sameMonthLastYear.completionRatePercent)
        : (() => {
          const totalWorks = safeNum(sameMonthLastYear.Total_No_of_Works_Takenup);
          const completed = safeNum(sameMonthLastYear.Number_of_Completed_Works);
          return totalWorks ? Math.round((completed / totalWorks) * 10000) / 100 : 0;
        })();
      yoy.completionPct = pctChange(prevCompletion, latest.completionRatePercent);
    }

    // State average for same month/year (aggregated)
    const stateName = latestRec.state || "MADHYA PRADESH";
    const agg = await District.aggregate([
      { $match: { state: stateName, month: latest.month, year: Number(latest.year) } },
      {
        $group: {
          _id: null,
          avgPeople: { $avg: "$peopleBenefited" },
          avgWages: { $avg: "$wagesPaid" },
          avgWorkdays: { $avg: "$workdaysCreated" },
          avgCompletion: { $avg: "$completionRatePercent" },
          cnt: { $sum: 1 }
        }
      }
    ]);
    const stateAverage = agg && agg[0] ? {
      people: Math.round(agg[0].avgPeople || 0),
      wages: Math.round(agg[0].avgWages || 0),
      workdays: Math.round(agg[0].avgWorkdays || 0),
      completionRatePercent: Math.round((agg[0].avgCompletion || 0) * 100) / 100,
      count: agg[0].cnt || 0
    } : { people: 0, wages: 0, workdays: 0, completionRatePercent: 0, count: 0 };

    // Ranking among districts for latest month by people, wages, completionRate
    // We'll fetch sorted lists and determine index
    const [peopleRankAgg, wagesRankAgg, compRankAgg] = await Promise.all([
      District.aggregate([
        { $match: { state: stateName, month: latest.month, year: Number(latest.year) } },
        { $project: { name: 1, people: "$peopleBenefited" } },
        { $sort: { people: -1 } }
      ]),
      District.aggregate([
        { $match: { state: stateName, month: latest.month, year: Number(latest.year) } },
        { $project: { name: 1, wages: "$wagesPaid" } },
        { $sort: { wages: -1 } }
      ]),
      District.aggregate([
        { $match: { state: stateName, month: latest.month, year: Number(latest.year) } },
        { $project: { name: 1, completion: "$completionRatePercent" } },
        { $sort: { completion: -1 } }
      ])
    ]);

    const totalDistricts = peopleRankAgg.length || 0;
    const rankByPeople = (peopleRankAgg.findIndex(r => r.name === name) + 1) || null;
    const rankByWages = (wagesRankAgg.findIndex(r => r.name === name) + 1) || null;
    const rankByCompletion = (compRankAgg.findIndex(r => r.name === name) + 1) || null;

    // Build friendly summary (safe strings)
    const safeFormat = (n) => {
      try { return Number(n).toLocaleString(); } catch { return String(n); }
    };
    // const momPeopleText = mom.peoplePct === null ? "no MoM data" : (mom.peoplePct > 0 ? `+${mom.peoplePct}% MoM` : `${mom.peoplePct}% MoM`);
    // const yoyPeopleText = yoy.peoplePct === null ? "no YoY data" : (yoy.peoplePct > 0 ? `+${yoy.peoplePct}% YoY` : `${yoy.peoplePct}% YoY`);
    // --- Enhanced Summary Section ---
    const momPeopleText =
      mom.peoplePct === null ? "no MoM data" : (mom.peoplePct > 0 ? `increased by ${mom.peoplePct}%` : `decreased by ${Math.abs(mom.peoplePct)}%`);
    const yoyPeopleText =
      yoy.peoplePct === null ? "no YoY data" : (yoy.peoplePct > 0 ? `up by ${yoy.peoplePct}% compared to last year` : `down by ${Math.abs(yoy.peoplePct)}% from last year`);

    const momCompletionText =
      mom.completionPct === null ? "" : (mom.completionPct > 0 ? `Completion rate improved by ${mom.completionPct}% this month.` : `Completion rate dropped by ${Math.abs(mom.completionPct)}% this month.`);
    const yoyCompletionText =
      yoy.completionPct === null ? "" : (yoy.completionPct > 0 ? `Compared to last year, completion rate is ${yoy.completionPct}% higher.` : `Compared to last year, completion rate is ${Math.abs(yoy.completionPct)}% lower.`);

    const summary = {
      en: `
In ${latest.month} ${latest.year}, the district ${name} recorded about ${safeFormat(latest.peopleBenefited)} people benefited, generating ${safeFormat(latest.workdaysCreated)} person-days of employment and paying wages worth ₹${safeFormat(latest.wagesPaid)}. The work completion rate stood at ${latest.completionRatePercent}%, and women contributed ${latest.womenSharePercent}% of total person-days. ${momPeopleText}, ${yoyPeopleText}. ${momCompletionText} ${yoyCompletionText} 
Currently, ${name} ranks ${rankByCompletion ? `#${rankByCompletion}` : "N/A"} in the state by completion rate among ${totalDistricts} districts.
      `.trim(),

      hi: `
${latest.month} ${latest.year} में जिले ${name} में लगभग ${safeFormat(latest.peopleBenefited)} लोगों को लाभ मिला, जिससे कुल ${safeFormat(latest.workdaysCreated)} व्यक्ति-दिन का रोजगार सृजित हुआ और ₹${safeFormat(latest.wagesPaid)} की मजदूरी दी गई। कार्यों की पूर्णता दर ${latest.completionRatePercent}% रही और महिलाओं की भागीदारी ${latest.womenSharePercent}% रही। 
पिछले महीने की तुलना में ${mom.peoplePct !== null ? (mom.peoplePct > 0 ? `${mom.peoplePct}% की बढ़ोतरी` : `${Math.abs(mom.peoplePct)}% की कमी`) : "कोई परिवर्तन नहीं"} हुई और पिछले वर्ष की तुलना में ${yoy.peoplePct !== null ? (yoy.peoplePct > 0 ? `${yoy.peoplePct}% अधिक` : `${Math.abs(yoy.peoplePct)}% कम`) : "कोई आंकड़ा उपलब्ध नहीं"} रही। 
इस समय ${name} राज्य में पूर्णता दर के आधार पर ${rankByCompletion ? `#${rankByCompletion}` : "अज्ञात"} स्थान पर है (${totalDistricts} जिलों में)।
      `.trim()
    };

    // Prepare payload
    const payload = {
      district: name,
      months,
      peopleTrend, wagesTrend, workdaysTrend,
      completionTrend, womenShareTrend,
      latest, mom, yoy,
      stateAverage,
      rank: { byPeople: rankByPeople, byWages: rankByWages, byCompletion: rankByCompletion, totalDistricts },
      summary
    };

    return new Response(JSON.stringify(payload), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("get-district error:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
