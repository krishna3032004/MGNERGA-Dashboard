"use client";
import { useState, useEffect } from "react";

/**
 * SummaryToggle
 * Props:
 *  - english: string
 *  - hindi: string
 *  - readAloud: (text, lang) => void   // optional callback to trigger voice
 */
export default function SummaryToggle({ english = "", hindi = "", readAloud }) {
  const [lang, setLang] = useState("en"); // 'en' or 'hi'
  const text = lang === "en" ? english : hindi || english;

  useEffect(() => {
    // small a11y: announce language change to screen readers
    const el = document.getElementById("summary-lang-sr");
    if (el) el.textContent = lang === "en" ? "Showing summary in English" : "सारांश हिंदी में दिखा रहा है";
    // optional: auto-read aloud after switch (uncomment if desired)
    // if (readAloud) readAloud(text, lang === "en" ? "en-IN" : "hi-IN");
  }, [lang, text, readAloud]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="text-sm text-gray-600 mb-2">Summary</div>

          {/* sliding box container */}
          <div className="relative overflow-hidden">
            <div
              key={lang} /* ensure remount for animation when content changes */
              className="transform transition-transform duration-300 ease-out"
              style={{
                // slide from left when switching to English, from right when switching to Hindi
                transform: "translateX(0)",
              }}
            >
              {/* content block with fade-in */}
              <div className="transition-opacity duration-300 ease-out opacity-100">
                <p className="text-gray-700 text-sm leading-relaxed">{text}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Toggle */}
        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-500">EN</div>

          <button
            aria-pressed={lang === "hi"}
            aria-label="Switch language"
            onClick={() => setLang(prev => (prev === "en" ? "hi" : "en"))}
            className="relative inline-flex items-center h-6 w-12 rounded-full transition-colors focus:outline-none"
            style={{ background: lang === "hi" ? "linear-gradient(90deg,#10b981,#059669)" : "#e5e7eb" }}
          >
            <span
              className={`transform transition-transform duration-200 ease-out inline-block w-5 h-5 bg-white rounded-full shadow`}
              style={{
                marginLeft: lang === "hi" ? 24 : 4,
              }}
            />
          </button>

          <div className="text-xs text-gray-500">HI</div>
        </div>
      </div>

      {/* Invisible live region for screen readers */}
      <div id="summary-lang-sr" className="sr-only" aria-live="polite"></div>
    </div>
  );
}
