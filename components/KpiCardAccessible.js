// components/KpiCardAccessible.js
"use client";
import { useMemo } from "react";

function Arrow({ dir }) {
    if (dir === "up") {
        return <svg className="w-4 h-4 inline-block" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 11l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
    }
    if (dir === "down") {
        return <svg className="w-4 h-4 inline-block" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 9l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
    }
    return null;
}

export default function KpiCardAccessible({ titleEn, titleHi, value, change, sparkData = [], metricKey, explainOnClick }) {
    // change: number (percent, pos/neg) or null
    // console.log(value)
    const arrowDir = change === null ? null : (Number(change) > 0 ? "up" : (Number(change) < 0 ? "down" : null));
    const bgClass = change === null ? "bg-gray-100" : (Number(change) > 0 ? "bg-green-50" : (Number(change) < 0 ? "bg-red-50" : "bg-gray-100"));

    //   const bigNumber = useMemo(() => {
    //     try { return Number(value).toLocaleString(); } catch { return String(value || "-"); }
    //   }, [value]);


    const bigNumber = useMemo(() => {
        if (value === null || value === undefined || value === "") return "-";

        // If already a number, use it; otherwise try to parse after removing commas/spaces
        let n = typeof value === "number" ? value : Number(String(value).replace(/[, ]+/g, ""));

        // If it's not a finite number, fallback to showing raw string
        if (!Number.isFinite(n)) return String(value);

        // Format using Indian separators (optional)
        return new Intl.NumberFormat("en-IN").format(n);
    }, [value]);
    // console.log(bigNumber)
    return (
        <div className={`rounded-xl shadow p-4 ${bgClass}`} role="region" aria-labelledby={`kpi-${metricKey}-title`}>
            <div className="flex items-start justify-between">
                <div>
                    <div id={`kpi-${metricKey}-title`} className="text-sm text-gray-700 font-semibold">
                        {/* show Hindi first, English small */}
                        <div className="text-base font-medium">{titleHi}</div>
                        <div className="text-xs text-gray-500">{titleEn}</div>
                    </div>
                    <div className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900" aria-live="polite">
                        {bigNumber}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                        {arrowDir && <span className={`text-sm ${arrowDir === "up" ? "text-green-600" : "text-red-600"}`}><Arrow dir={arrowDir} /></span>}
                        <div className="text-sm text-gray-600">
                            {change === null ? "डेटा उपलब्ध नहीं" : `${Math.abs(Number(change))}% (${arrowDir === "up" ? "बढ़ा" : "घटा"})`}
                        </div>
                    </div>
                </div>

                {/* right: small action buttons */}
                <div className="flex flex-col items-end gap-2">
                    <button
                        onClick={() => explainOnClick?.(metricKey)}
                        className="text-xs px-3 py-1 bg-white rounded border hover:bg-gray-50"
                        aria-label={`Explain ${titleHi}`}
                    >
                        ? बताइये
                    </button>
                </div>
            </div>

            {/* small sparkline placeholder for visual, optional */}
            <div className="mt-3 h-8">
                {/* you can reuse TrendChartSmall or show a CSS sparkline here — keeping simple box */}
                <div className="w-full h-2 bg-gray-200 rounded"></div>
            </div>
        </div>
    );
}
