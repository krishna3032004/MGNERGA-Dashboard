// components/SummaryBox.js
"use client";
import { useState } from "react";

export default function SummaryBox({ english = "", hindi = "", readText = "" }) {
  const [speaking, setSpeaking] = useState(false);

  const speak = (text, lang = "hi-IN") => {
    if (!("speechSynthesis" in window)) return alert("Speech synthesis not supported");
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    utter.rate = 0.95;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    setSpeaking(true);
    speechSynthesis.speak(utter);
  };

  return (
    <div>
      <div className="text-sm text-gray-700 mb-2 font-semibold">Summary</div>
      <div className="text-sm text-gray-700">{english}</div>
      <div className="text-sm text-gray-500 mt-2">{hindi}</div>

      <div className="mt-3 flex gap-2">
        <button onClick={() => speak(hindi || english, "hi-IN")} className="px-3 py-1 bg-green-600 text-white rounded text-sm">
          {speaking ? "Speaking…" : "Listen (Hindi)"}
        </button>
        <button onClick={() => speak(english, "en-IN")} className="px-3 py-1 bg-gray-100 rounded text-sm">
          Listen (English)
        </button>
      </div>
    </div>
  );
}
