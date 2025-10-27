// components/ExplainModal.js
"use client";
export default function ExplainModal({ open, onClose, metricKey, extra = {} }) {
  if (!open) return null;

  const dict = {
    people: {
      hi: "लाभार्थी: इस महीने कितने लोगों ने MGNREGA में काम किया और वेतन पाया। उदाहरण: अगर यहाँ 68,424 लिखा है तो इतने लोगों को लाभ मिला।",
      en: "People: Number of individuals who worked this month.",
      tip: "अगर संख्या कम है तो पंचायत में रोज़गार के लिए पूछें।"
    },
    wages: {
      hi: "कुल वेतन: इस जिले में कुल कितना भुगतान किया गया (रुपये)। उदाहरण: ₹7,054 दिखे तो वही वेतन आंकड़ा है।",
      en: "Wages: Total wages paid in rupees.",
      tip: "अगर भुगतान नहीं हो रहा, बैंक/पanchayat से पूछें।"
    },
    workdays: {
      hi: "वर्कडे (व्यक्ति-दिन): कुल व्यक्ति-दिन जो बनाए गए। सरल: 1 व्यक्ति × 10 दिन = 10 व्यक्ति-दिन। यह बताता है कितनी रोज़गार बनी।",
      en: "Workdays (person-days): Total person-days created.",
      tip: "काम कम दिखे तो परियोजना सूची/स्थानीय अधिकारी देखें।"
    },
    completion: {
      hi: "समाप्ति %: लिए गए कार्यों में से कितने % पूरे हो चुके हैं। उदाहरण: 85% मतलब 100 में से लगभग 85 काम पूरे।",
      en: "Completion %: Percent of taken-up works that are completed.",
      tip: "यदि यह कम है, तो रोकें/विलंब का कारण पूछें और शिकायत कराएं।"
    }
  };

  const info = dict[metricKey] || { hi: "यह मेट्रिक प्रयोग में है।", en: "This metric." };

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-lg p-6 z-10 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-2">क्या है यह? / What is this?</h3>
        <p className="text-gray-800 mb-2">{info.hi}</p>
        <p className="text-xs text-gray-500 mb-3">EN: {info.en}</p>
        <div className="text-sm text-gray-700 mb-4"><strong>सुझाव:</strong> {info.tip}</div>
        <div className="flex justify-end">
          <button onClick={onClose} className="px-3 py-1 bg-blue-600 text-white rounded">ठीक है / OK</button>
        </div>
      </div>
    </div>
  );
}
