// components/ExportButton.js
"use client";
import { useState } from "react";

function jsonToCsv(obj) {
  // very simple: flatten top-level arrays/objects where possible
  const replacer = (key, value) => (value === null ? "" : value);
  const items = Array.isArray(obj) ? obj : [obj];
  const keys = Object.keys(items[0]);
  const csv = [
    keys.join(","),
    ...items.map(row => keys.map(k => JSON.stringify(row[k], replacer)).join(","))
  ].join("\n");
  return csv;
}

export default function ExportButton({ payload, filename = "export.json" }) {
  const [loading, setLoading] = useState(false);

  const download = (type) => {
    if (!payload) return;
    setLoading(true);
    const content = type === "json" ? JSON.stringify(payload, null, 2) : jsonToCsv(payload);
    const blob = new Blob([content], { type: type === "json" ? "application/json" : "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const ext = type === "json" ? ".json" : ".csv";
    a.download = filename.replace(/\.[^.]+$/, "") + ext;
    a.click();
    URL.revokeObjectURL(url);
    setLoading(false);
  };

  return (
    <div className="flex gap-2">
      <button onClick={() => download("json")} className="px-3 py-1 bg-gray-100 rounded text-sm">Download JSON</button>
      <button onClick={() => download("csv")} className="px-3 py-1 bg-gray-100 rounded text-sm">Download CSV</button>
    </div>
  );
}
