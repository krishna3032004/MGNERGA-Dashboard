// "use client";
// import { useEffect, useState, useRef } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import DistrictSelector from "@/components/DistrictSelector";
// import KpiCard from "@/components/KpiCard";
// import TrendChart from "@/components/TrendChart";
// import SummaryBox from "@/components/SummaryBox";
// import RankBadge from "@/components/RankBadge";
// import MetricToggle from "@/components/MetricToggle";
// import ExportButton from "@/components/ExportButton";

// export default function DashboardPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const initial = searchParams?.get("district") || "";
//   const [district, setDistrict] = useState(initial);
//   const [data, setData] = useState(null);
//   const [metric, setMetric] = useState("people"); // people | wages | workdays | completion
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const fetchControllerRef = useRef(null);

//   useEffect(() => {
//     if (!district) {
//       setData(null);
//       setError("");
//       return;
//     }

//     // abort previous
//     if (fetchControllerRef.current) fetchControllerRef.current.abort();
//     const ctrl = new AbortController();
//     fetchControllerRef.current = ctrl;

//     setLoading(true);
//     setError("");
//     fetch(`/api/get-district?name=${encodeURIComponent(district)}`, { signal: ctrl.signal })
//       .then(async (res) => {
//         if (!res.ok) {
//           const txt = await res.text();
//           throw new Error(txt || "Network error");
//         }
//         return res.json();
//       })
//       .then((json) => setData(json))
//       .catch((err) => {
//         if (err.name === "AbortError") return;
//         console.error("Failed to load district:", err);
//         setError("Unable to load data. Please try again.");
//         setData(null);
//       })
//       .finally(() => setLoading(false));

//     return () => {
//       if (fetchControllerRef.current) fetchControllerRef.current.abort();
//     };
//   }, [district]);

//   const fmt = (v) => (v === undefined || v === null ? "-" : Number(v).toLocaleString());

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Navbar simplified (you may reuse site navbar) */}
//       <nav className="bg-white shadow-sm sticky top-0 z-40">
//         <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//            <img
//               src="https://www.data.gov.in/_nuxt/img/logo.f9fcba1.svg"
//               alt="DataGov Logo"
//               className="w-40 sm:w-48"
//             />
//             <div className="hidden md:block">
//               <div className="text-sm font-semibold text-gray-800">MGNREGA Dashboard</div>
//               <div className="text-xs text-gray-500">Madhya Pradesh — District insights</div>
//             </div>
//           </div>
//           <div className="flex items-center gap-4">
//             <button onClick={() => router.push("/")} className="text-sm px-3 py-1">Home</button>
//             <a href="https://data.gov.in/" target="_blank" rel="noreferrer" className="text-sm">Data Portal</a>
//           </div>
//         </div>
//       </nav>

//       <main className="max-w-6xl mx-auto px-6 py-8">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">District Dashboard</h1>
//             <p className="text-sm text-gray-600 mt-1">Choose a district to see current & past performance — simple, clear information for citizens.</p>
//           </div>

//           <div className="w-full md:w-96">
//             <div className="bg-white rounded-lg shadow-sm p-3">
//               <DistrictSelector onSelect={(d) => { setDistrict(d); router.replace(`/dashboard?district=${encodeURIComponent(d)}`); }} />
//             </div>
//           </div>
//         </div>

//         {loading && <div className="mt-6 p-6 bg-white rounded shadow text-center text-gray-600">Loading data…</div>}
//         {error && <div className="mt-6 p-4 bg-red-50 text-red-700 rounded">{error}</div>}
//         {!district && !loading && (
//           <div className="mt-6 p-6 bg-white rounded shadow text-center text-gray-700">Select a district to view its MGNREGA performance.</div>
//         )}

//         {data && (
//           <>
//             {/* Header summary row */}
//             <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
//               <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow">
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <h2 className="text-xl font-semibold">{data.district}</h2>
//                     <div className="text-sm text-gray-600 mt-1">{data.latest.month} {data.latest.year}</div>
//                     <div className="mt-2 text-gray-700">{data.summary?.en}</div>
//                   </div>

//                   <div className="text-right">
//                     <RankBadge rank={data.rank.byPeople} total={data.rank.totalDistricts} label="Rank by People" />
//                     <div className="mt-2">
//                       <ExportButton payload={data} filename={`${data.district.replace(/\s+/g, "_")}_mgnrega.json`} />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-4 flex flex-wrap gap-3">
//                   <div className="text-sm text-gray-600">State average (people): <span className="font-medium">{fmt(data.stateAverage.people)}</span></div>
//                   <div className="text-sm text-gray-600">State completion avg: <span className="font-medium">{fmt(data.stateAverage.completionRatePercent)}%</span></div>
//                 </div>
//               </div>

//               <div className="bg-white p-4 rounded-lg shadow">
//                 <SummaryBox english={data.summary?.en} hindi={data.summary?.hi} readText={data.summary?.hi || data.summary?.en} />
//               </div>
//             </div>

//             {/* KPI row */}
//             <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
//               <KpiCard title="People Benefited" value={fmt(data.latest.peopleBenefited)} sub={data.mom?.peoplePct !== null ? `${data.mom.peoplePct > 0 ? `+${data.mom.peoplePct}%` : `${data.mom.peoplePct}%`} MoM` : ""} sparkData={data.peopleTrend} metric="people" />
//               <KpiCard title="Wages Paid (₹)" value={fmt(data.latest.wagesPaid)} sub={data.mom?.wagesPct !== null ? `${data.mom.wagesPct > 0 ? `+${data.mom.wagesPct}%` : `${data.mom.wagesPct}%`} MoM` : ""} sparkData={data.wagesTrend} metric="wages" />
//               <KpiCard title="Workdays (person-days)" value={fmt(data.latest.workdaysCreated)} sub={data.mom?.workdaysPct !== null ? `${data.mom.workdaysPct > 0 ? `+${data.mom.workdaysPct}%` : `${data.mom.workdaysPct}%`} MoM` : ""} sparkData={data.workdaysTrend} metric="workdays" />
//             </div>

//             {/* Secondary KPIs + metric toggle */}
//             <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
//               <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-lg font-semibold">Trends</h3>
//                   <MetricToggle metric={metric} onChange={setMetric} />
//                 </div>

//                 <div className="mt-4">
//                   <TrendChart
//                     months={data.months}
//                     dataMap={{ people: data.peopleTrend, wages: data.wagesTrend, workdays: data.workdaysTrend, completion: data.completionTrend }}
//                     metric={metric}
//                     labelMap={{ people: "People Benefited", wages: "Wages", workdays: "Workdays", completion: "Completion Rate (%)" }}
//                   />
//                 </div>
//               </div>

//               <aside className="bg-white rounded-lg shadow p-4">
//                 <h4 className="text-sm font-semibold mb-2">More KPIs</h4>
//                 <div className="space-y-2 text-sm">
//                   <div className="flex justify-between"><div>Completion Rate</div><div className="font-medium">{fmt(data.latest.completionRatePercent)}%</div></div>
//                   <div className="flex justify-between"><div>Women share (person-days)</div><div className="font-medium">{fmt(data.latest.womenSharePercent)}%</div></div>
//                   <div className="flex justify-between"><div>Avg wage (per day)</div><div className="font-medium">₹{fmt(data.latest.avgWageRate)}</div></div>
//                   <div className="flex justify-between"><div>Active job cards</div><div className="font-medium">{fmt(data.latest.activeJobCards)}</div></div>
//                   <div className="flex justify-between"><div>Households worked</div><div className="font-medium">{fmt(data.latest.householdsWorked)}</div></div>
//                   <div className="text-xs text-gray-500 mt-2">Note: Values come from official data.gov.in dataset. Some fields are derived.</div>
//                 </div>
//               </aside>
//             </div>
//           </>
//         )}
//       </main>

//       <footer className="bg-white border-t">
//         <div className="max-w-6xl mx-auto px-6 py-4 text-sm text-gray-600 flex justify-between">
//           <div>© {new Date().getFullYear()} MGNREGA Dashboard</div>
//           <div><a href="https://data.gov.in/" target="_blank" rel="noreferrer" className="underline">Data Portal</a></div>
//         </div>
//       </footer>
//     </div>
//   );
// }
































"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DistrictSelectorAccessible from "@/components/DistrictSelectorAccessible";
import KpiCardAccessible from "@/components/KpiCardAccessible";
import SummaryBoxAccessible from "@/components/SummaryBoxAccessible";
import ExplainModal from "@/components/ExplainModal";
import TrendChart from "@/components/TrendChart";
import TrendChartSmall from "@/components/TrendChartSmall";
import TopDistrictsList from "@/components/TopDistrictsList";
import ExportButton from "@/components/ExportButton";
import RankBadgeColored from "@/components/RankBadgeColored";
import SummaryToggle from "@/components/SummaryToggle";
import { ChevronDown, ChevronUp } from "lucide-react";


export default function DashboardPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const initial = sp?.get("district") || "";
  // const [district, setDistrict] = useState(initial || (typeof window !== "undefined" ? localStorage.getItem("mgnrega_last_district") || "" : ""));
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [metric, setMetric] = useState("people");
  const [explainOpen, setExplainOpen] = useState(false);
  const [explainMetric, setExplainMetric] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [district, setDistrict] = useState(initial? initial :"");

  const [open, setOpen] = useState(false);
  const ctrlRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const initialDistrict = sp?.get("district") || localStorage.getItem("mgnrega_last_district") || "";
    if (initialDistrict) setDistrict(initialDistrict);
  }, [sp]);

  useEffect(() => {
    if (!district) return;
    localStorage.setItem("mgnrega_last_district", district);
    router.replace(`/dashboard?district=${encodeURIComponent(district)}`, { scroll: false });
    // fetch
    if (ctrlRef.current) ctrlRef.current.abort();
    const ctrl = new AbortController();
    ctrlRef.current = ctrl;

    setLoading(true);
    setError("");
    fetch(`/api/get-district?name=${encodeURIComponent(district)}`, { signal: ctrl.signal })
      .then(async res => {
        if (!res.ok) {
          const t = await res.text();
          throw new Error(t || "Network error");
        }
        return res.json();
      })
      .then(json => { setData(json); })
      .catch(err => {
        if (err.name === "AbortError") return;
        // console.error(err);
        setError("No Data available");
        setData(null);
      })
      .finally(() => setLoading(false));

    return () => { if (ctrlRef.current) ctrlRef.current.abort(); };
  }, [district]);

  // fetch top 10 for sidebar (latest month) — simplistic client call to same API with special endpoint
  const [top10, setTop10] = useState([]);
  useEffect(() => {
    // call server endpoint that returns top districts for latest month (create /api/top-districts if needed)
    fetch("/api/top-districts")
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(json => setTop10(json.top || []))
      .catch(() => setTop10([]));
  }, []);

  const openExplain = (metricKey) => { setExplainMetric(metricKey); setExplainOpen(true); };

  const fmt = (v) => (v === undefined || v === null ? "-" : Number(v).toLocaleString("en-IN"));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://www.data.gov.in/_nuxt/img/logo.f9fcba1.svg"
              alt="DataGov Logo"
              className="w-40 sm:w-48"
            />
            {/* <div className="hidden md:block">
              <div className="text-sm font-semibold text-gray-800">MGNREGA Dashboard</div>
              <div className="text-xs text-gray-500">Simple, local-language view for citizens</div>
            </div> */}
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/")} className="text-sm px-3 cursor-pointer py-1">Home</button>
            <a href="https://data.gov.in/" target="_blank" rel="noreferrer" className="text-sm">Data Portal</a>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Top 10 list (sticky) */}
        <aside className="lg:col-span-1 transition-all">
          <div className="bg-white rounded-lg shadow p-4 sticky top-24">
            {/* Header */}
            <div onClick={() => setOpen(!open)} className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                Top 10 जिलों — अभी (Top 10 districts)
              </h3>

              {/* Arrow visible only on mobile */}
              <button
                onClick={() => setOpen(!open)}
                className="lg:hidden p-1 text-gray-600 hover:text-black transition"
              >
                {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>

            {/* Mobile: show list only when open */}
            <div className={`mt-3 overflow-hidden transition-all duration-500 ease-in-out 
    ${open ? "max-h-full opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-4"} 
    lg:max-h-full lg:opacity-100 lg:translate-y-0`}>
              <TopDistrictsList list={top10} onClick={(d) => setDistrict(d)} />
              <div className="mt-3 text-xs text-gray-500">
                Click on any district to view details.
              </div>
            </div>
          </div>
        </aside>

        {/* Main: Dashboard */}
        <section className="lg:col-span-3 space-y-6">
          {/* selector and header */}
          <div className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-800">District Dashboard</h1>
              <div className="text-sm text-gray-600 mt-1">Select your district — सरल और सीधे शब्दों में जानकारी</div>
            </div>
            <div className="w-full md:w-96">
              <DistrictSelectorAccessible onSelect={(d) => setDistrict(d)} />
            </div>
          </div>

          {loading && <div className="p-6 bg-white rounded shadow text-center text-gray-600">लोड हो रहा है… कृपया प्रतीक्षा करें।</div>}
          {error && <div className="p-4 bg-red-50 text-red-700 rounded">{error}</div>}
          {!district && !loading && <div className="p-6 bg-white rounded shadow text-center">कृपया जिला चुनें।</div>}

          {mounted && district && data && (
            <>
              {/* header summary + rank */}
              <div className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold">{data.district}</div>
                  <div className="text-sm text-gray-600">{data.latest.month} {data.latest.year}</div>
                  {/* <div className="mt-2 text-gray-700">{data.summary?.hi || data.summary?.en}</div> */}
                  <div className="mt-2">
                    <SummaryToggle
                      english={data.summary?.en || ""}
                      hindi={data.summary?.hi || ""}
                    // optional: pass readAloud function if you want auto TTS on toggle
                    // readAloud={(t, lang) => {/* call your speak from SummaryBoxAccessible or window.speechSynthesis */}}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div>
                    <RankBadgeColored rank={data.rank.byPeople} total={data.rank.totalDistricts} />
                    <div className="text-xs text-gray-500 mt-2">रैंक (लाभार्थी)</div>
                  </div>

                  <div>
                    <ExportButton payload={data} filename={`${data.district.replace(/\s+/g, "_")}_mgnrega`} />
                  </div>
                </div>
              </div>

              {/* KPI row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <KpiCardAccessible
                  titleHi="लाभार्थी"
                  titleEn="People Benefited"
                  value={fmt(data.latest.peopleBenefited)}
                  change={data.mom?.peoplePct}
                  metricKey="people"
                  explainOnClick={openExplain}
                />
                <KpiCardAccessible
                  titleHi="कुल वेतन (₹)"
                  titleEn="Wages Paid"
                  value={fmt(data.latest.wagesPaid)}
                  change={data.mom?.wagesPct}
                  metricKey="wages"
                  explainOnClick={openExplain}
                />
                <KpiCardAccessible
                  titleHi="वर्कडे (व्यक्ति-दिन)"
                  titleEn="Workdays (person-days)"
                  value={fmt(data.latest.workdaysCreated)}
                  change={data.mom?.workdaysPct}
                  metricKey="workdays"
                  explainOnClick={openExplain}
                />
              </div>

              {/* Trends + right summary column */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">रुझान (Trends)</h3>
                    {/* metric toggle */}
                    <div className="inline-flex bg-gray-100 rounded-md p-1 text-sm">
                      <button className={`px-3 py-1 rounded ${metric === "people" ? "bg-white shadow" : "text-gray-600"}`} onClick={() => setMetric("people")}>लोग</button>
                      <button className={`px-3 py-1 rounded ${metric === "wages" ? "bg-white shadow" : "text-gray-600"}`} onClick={() => setMetric("wages")}>वेतन</button>
                      <button className={`px-3 py-1 rounded ${metric === "workdays" ? "bg-white shadow" : "text-gray-600"}`} onClick={() => setMetric("workdays")}>वर्कडे</button>
                      <button className={`px-3 py-1 rounded ${metric === "completion" ? "bg-white shadow" : "text-gray-600"}`} onClick={() => setMetric("completion")}>समाप्ति %</button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <TrendChart
                      months={data.months}
                      dataMap={{ people: data.peopleTrend, wages: data.wagesTrend, workdays: data.workdaysTrend, completion: data.completionTrend }}
                      metric={metric}
                      labelMap={{ people: "People Benefited", wages: "Wages", workdays: "Workdays", completion: "Completion Rate (%)" }}
                    />
                  </div>
                </div>

                <aside className="bg-white rounded-lg shadow p-4">
                  <SummaryBoxAccessible english={data.summary?.en} hindi={data.summary?.hi} readText={data.summary?.hi || data.summary?.en} />

                  <div className="mt-4 text-sm text-gray-700 space-y-2">
                    <div>
                      <div className="flex justify-between">
                        <div>State avg (people)</div>
                        <div className="font-medium">{fmt(data.stateAverage.people)}</div>
                      </div>
                      <div className="text-xs text-gray-500">राज्य में औसतन इतने लाभार्थी।</div>
                    </div>

                    <div>
                      <div className="flex justify-between">
                        <div>Completion (state avg)</div>
                        <div className="font-medium">{fmt(data.stateAverage.completionRatePercent)}%</div>
                      </div>
                      <div className="text-xs text-gray-500">राज्य में कार्यों की औसत पूर्णता दर।</div>
                    </div>

                    <div>
                      <div className="flex justify-between">
                        <div>Rank by completion</div>
                        <div className="font-medium">{data.rank.byCompletion || "-"}</div>
                      </div>
                      <div className="text-xs text-gray-500">पूर्णता दर के आधार पर जिले की रैंक।</div>
                    </div>
                  </div>
                </aside>
              </div>

              {/* bottom: small charts and extra KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="text-sm text-gray-600">Women share (person-days)</div>
                  <div className="text-2xl font-bold mt-2">{fmt(data.latest.womenSharePercent)}%</div>
                  <div className="text-xs text-gray-500 mt-1">महिलाओं द्वारा किए गए कुल व्यक्ति-दिन का प्रतिशत।</div>
                  <div className="mt-3 h-10"><TrendChartSmall data={data.womenShareTrend} /></div>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                  <div className="text-sm text-gray-600">Completion rate</div>
                  <div className="text-2xl font-bold mt-2">{fmt(data.latest.completionRatePercent)}%</div>
                  <div className="text-xs text-gray-500 mt-1">कुल कार्यों में से पूरे किए गए कार्यों का प्रतिशत।</div>
                  <div className="mt-3 h-10"><TrendChartSmall data={data.completionTrend} /></div>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                  <div className="text-sm text-gray-600">Active job cards</div>
                  <div className="text-2xl font-bold mt-2">{fmt(data.latest.activeJobCards)}</div>
                  <div className="text-xs text-gray-500 mt-1">सक्रिय जॉब कार्ड वाले घरों की संख्या।</div>
                  <div className="mt-3 text-xs text-gray-500">
                    100 दिन पूरे करने वाले परिवार: {fmt(data.latest.householdsWorked)}
                  </div>
                </div>
              </div>

            </>
          )}
        </section>
      </main>

      <ExplainModal open={explainOpen} onClose={() => setExplainOpen(false)} metricKey={explainMetric} />

      <footer className="bg-white border-t">
        <div className="max-w-6xl mx-auto px-6 py-4 text-sm text-gray-600 flex justify-between">
          <div>© {new Date().getFullYear()} MGNREGA Dashboard</div>
          <div><a href="https://data.gov.in/" target="_blank" rel="noreferrer" className="underline">data.gov.in</a></div>
        </div>
      </footer>
    </div>
  );
}
