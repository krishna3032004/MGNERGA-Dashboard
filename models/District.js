// models/District.js
import mongoose from "mongoose";

const DistrictSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    districtCode: { type: String, default: "" },
    state: { type: String, default: "MADHYA PRADESH" },

    // simple time identifiers
    month: { type: String, default: "" },           // e.g., "March"
    financialYear: { type: String, default: "" },   // e.g., "2023-2024"
    year: { type: Number, default: new Date().getFullYear() },

    // core totals
    Total_Households_Worked: { type: Number, default: 0 },
    Total_Individuals_Worked: { type: Number, default: 0 },
    Total_No_of_Active_Job_Cards: { type: Number, default: 0 },
    Total_No_of_Active_Workers: { type: Number, default: 0 },
    Total_No_of_HHs_completed_100_Days_of_Wage_Employment: { type: Number, default: 0 },
    Total_No_of_JobCards_issued: { type: Number, default: 0 },
    Total_No_of_Works_Takenup: { type: Number, default: 0 },
    Number_of_Completed_Works: { type: Number, default: 0 },
    Number_of_Ongoing_Works: { type: Number, default: 0 },

    // money / wages
    Wages: { type: Number, default: 0 }, // as API gives
    Wages_total_expenditure: { type: Number, default: 0 }, // if separate

    // person-days
    Persondays_of_Central_Liability_so_far: { type: Number, default: 0 },
    Women_Persondays: { type: Number, default: 0 },
    SC_persondays: { type: Number, default: 0 },
    ST_persondays: { type: Number, default: 0 },

    // other useful fields
    Approved_Labour_Budget: { type: Number, default: 0 },
    Average_Wage_rate_per_day_per_person: { type: Number, default: 0 },
    Average_days_of_employment_provided_per_Household: { type: Number, default: 0 },
    percentage_payments_gererated_within_15_days: { type: Number, default: 0 },

    // basic simplified KPIs (we will set from above values)
    peopleBenefited: { type: Number, default: 0 },     // alias of Total_Individuals_Worked
    wagesPaid: { type: Number, default: 0 },           // alias of Wages
    workdaysCreated: { type: Number, default: 0 },     // alias of Persondays_of_Central_Liability_so_far

    completionRatePercent: { type: Number, default: 0 }, // (0–100)
    // store raw API record for flexibility
    raw: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
  }
);

DistrictSchema.index({ name: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.models.District || mongoose.model("District", DistrictSchema);
