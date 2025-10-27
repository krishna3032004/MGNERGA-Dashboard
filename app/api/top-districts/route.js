// app/api/top-districts/route.js
import connectToDatabase from "@/lib/mongodb";
import District from "@/models/District";

export async function GET() {
  try {
    await connectToDatabase();
    // find latest year/month across DB for state 'MADHYA PRADESH'
    const latest = await District.findOne({ state: "MADHYA PRADESH" }).sort({ year: -1 }).sort({ createdAt: -1 }).lean();
    if (!latest) return new Response(JSON.stringify({ top: [] }), { status: 200 });

    const { month, year } = latest;
    const top = await District.aggregate([
      { $match: { state: "MADHYA PRADESH", month, year } },
      { $project: { name: 1, people: "$peopleBenefited" } },
      { $sort: { people: -1 } },
      { $limit: 10 }
    ]);
    return new Response(JSON.stringify({ top }), { status: 200, headers: { "Content-Type": "application/json" }});
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ top: [] }), { status: 500 });
  }
}
