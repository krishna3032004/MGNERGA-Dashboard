// components/MetricToggle.js
"use client";
export default function MetricToggle({ metric, onChange }) {
  const opts = [
    { key: "people", label: "People" },
    { key: "wages", label: "Wages" },
    { key: "workdays", label: "Workdays" },
    { key: "completion", label: "Completion %" },
  ];
  return (
    <div className="inline-flex bg-gray-100 rounded-md p-1">
      {opts.map(o => (
        <button
          key={o.key}
          onClick={() => onChange(o.key)}
          className={`px-3 py-1 text-sm rounded-md ${metric === o.key ? "bg-white shadow-sm" : "text-gray-600"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
