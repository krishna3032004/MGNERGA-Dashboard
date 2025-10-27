// components/KpiCard.js
"use client";
import TrendChartSmall from "./TrendChartSmall";

export default function KpiCard({ title, value, sub, sparkData = [], metric }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col justify-between">
      <div>
        <div className="text-sm text-gray-600">{title}</div>
        <div className="text-2xl font-bold text-gray-800 mt-1">{value}</div>
        {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
      </div>
      <div className="mt-3">
        <TrendChartSmall data={sparkData} />
      </div>
    </div>
  );
}
