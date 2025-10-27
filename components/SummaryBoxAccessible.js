// components/SummaryBoxAccessible.js
"use client";
import { useState, useEffect } from "react";

export default function SummaryBoxAccessible({ english = "", hindi = "", readText = "" }) {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    function loadVoices() {
      const v = window.speechSynthesis.getVoices() || [];
      setVoices(v);
    }
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  function speak(text, lang = "hi-IN") {
    if (!("speechSynthesis" in window)) {
      alert("आपके ब्राउज़र में आवाज़ सुविधा उपलब्ध नहीं है।");
      return;
    }
    if (!text) return;
    window.speechSynthesis.cancel();
    setPaused(false);

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    utter.rate = 0.95;
    utter.onend = () => { setSpeaking(false); setPaused(false); };
    utter.onerror = () => { setSpeaking(false); setPaused(false); };
    window.speechSynthesis.speak(utter);
    setSpeaking(true);
  }

  const combinedText = hindi && english ? `${hindi}. ${english}.` : (hindi || english || readText);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="text-sm font-semibold text-gray-700 mb-2">सारांश / Summary</div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => speak(hindi, "hi-IN")}
          className="px-3 py-1 bg-green-600 text-white rounded text-sm"
        >
          🔊 सुनें (हिंदी)
        </button>
        <button
          onClick={() => speak(english, "en-IN")}
          className="px-3 py-1 bg-gray-100 rounded text-sm"
        >
          🔊 Listen (EN)
        </button>

        {speaking && !paused && (
          <button onClick={() => { window.speechSynthesis.pause(); setPaused(true); }} className="px-2 py-1 bg-yellow-100 rounded text-sm">
            Pause
          </button>
        )}
        {speaking && paused && (
          <button onClick={() => { window.speechSynthesis.resume(); setPaused(false); }} className="px-2 py-1 bg-yellow-100 rounded text-sm">
            Resume
          </button>
        )}
        {speaking && (
          <button onClick={() => { window.speechSynthesis.cancel(); setSpeaking(false); setPaused(false); }} className="px-2 py-1 bg-red-100 rounded text-sm">
            Stop
          </button>
        )}
      </div>

      <div className="mt-2 text-xs text-gray-500">
        📢 क्लिक करें "सुनें" बटन पर — सिस्टम पूरी जानकारी पढ़कर सुनाएगा।
      </div>
    </div>
  );
}
