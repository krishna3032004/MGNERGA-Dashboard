// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import DistrictSelector from "@/components/DistrictSelector";

// export default function Home() {
//   const router = useRouter();
//   const [district, setDistrict] = useState("");

//   const handleSelect = (districtName) => {
//     setDistrict(districtName);
//     if (districtName) {
//       router.push(`/dashboard?district=${districtName}`);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       {/* Navbar */}
//       <nav className="bg-white/80 backdrop-blur-sm sticky top-0 z-30 shadow-sm">
//         <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <img
//               src="https://www.data.gov.in/_nuxt/img/logo.f9fcba1.svg"
//               alt="DataGov Logo"
//               className="w-40 sm:w-48"
//             />
//             {/* <div className="hidden sm:block">
//               <div className="text-sm font-semibold text-gray-800">MGNREGA Dashboard</div>
//               <div className="text-xs text-gray-500">Madhya Pradesh — District level insights</div>
//             </div> */}
//           </div>

//           <div className="flex items-center gap-6 text-sm text-gray-700">
//             <a href="/" className="px-3 py-1 rounded hover:bg-gray-100">Home</a>
//             <a href="https://rural.nic.in/" target="_blank" className="hover:text-green-700">Rural Development</a>
//             <a href="https://data.gov.in/" target="_blank" className="hover:text-green-700">Data Portal</a>
//           </div>
//         </div>
//       </nav>

//       {/* Hero */}
//       <header className="w-full">
//         <div
//           className="relative overflow-hidden"
//           style={{
//             backgroundImage:
//               "url('https://www.data.gov.in/_nuxt/img/bg-search-default.c16e215.jpg')",
//             backgroundPosition: "center",
//             backgroundSize: "cover",
//           }}
//         >
//           <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent"></div>

//           <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">
//             <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight drop-shadow-md max-w-4xl">
//               Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)
//             </h2>

//             <p className="mt-4 text-sm md:text-base text-white/90 max-w-2xl">
//               A Government of India programme that guarantees wage employment to rural households —
//               helping livelihoods by providing unskilled manual work close to home.
//             </p>

//             <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
//               <div className="inline-flex items-center gap-3 bg-white/10 text-white rounded-full px-4 py-2 text-sm">
//                 <span className="inline-block w-2 h-2 bg-green-400 rounded-full" />
//                 <span>100+ lakh beneficiaries (2025)</span>
//               </div>

//               <div className="inline-flex items-center gap-3 bg-white/10 text-white rounded-full px-4 py-2 text-sm">
//                 <span className="inline-block w-2 h-2 bg-blue-300 rounded-full" />
//                 <span>District-level insights & trends</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Content area: description + selector card */}
//       <main className="flex-1 flex items-start justify-center -mt-12 px-6 pb-12">
//         <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Left: Short description */}
//           <section className="transform translate-y-6 lg:translate-y-0 bg-white rounded-xl shadow-lg p-6">
//             <h3 className="text-xl font-semibold text-gray-800">What this site shows</h3>
//             <p className="mt-3 text-gray-600 leading-relaxed">
//               We make MGNREGA data simple to understand — for every district in Madhya Pradesh.
//               Use the selector to view latest figures, month-wise trends, and compare with the state average.
//             </p>

//             <ul className="mt-4 space-y-3">
//               <li className="flex items-start gap-3">
//                 <span className="mt-1 inline-block w-3 h-3 bg-green-500 rounded-full" />
//                 <span className="text-gray-700">People benefited — latest month & historic trend</span>
//               </li>
//               <li className="flex items-start gap-3">
//                 <span className="mt-1 inline-block w-3 h-3 bg-blue-500 rounded-full" />
//                 <span className="text-gray-700">Wages paid and person-days created</span>
//               </li>
//               <li className="flex items-start gap-3">
//                 <span className="mt-1 inline-block w-3 h-3 bg-yellow-400 rounded-full" />
//                 <span className="text-gray-700">Easy comparison with state average</span>
//               </li>
//             </ul>

//             <div className="mt-6 text-sm text-gray-500">
//               Tip: Allow location access on your device and we can auto-suggest your nearest district.
//             </div>
//           </section>

//           {/* Right: Selector card */}
//           <aside className="transform translate-y-6 lg:translate-y-0">
//             <div className="bg-gradient-to-tr from-white to-gray-50 rounded-xl shadow-2xl p-6">
//               <h3 className="text-lg font-semibold text-gray-800">Select Your District</h3>
//               <p className="text-sm text-gray-600 mt-1 mb-4">
//                 Choose a district to view progress and statistics of ongoing MGNREGA work.
//               </p>

//               <div className="bg-white rounded-lg p-4 shadow-inner">
//                 <DistrictSelector onSelect={handleSelect} />
//               </div>

//               <div className="mt-4 flex items-center gap-3">
//                 <button
//                   onClick={() => { if (district) router.push(`/dashboard?district=${district}`); }}
//                   className="flex-1 bg-[#ffc107] hover:bg-yellow-200 text-white font-medium py-2 rounded-md shadow"
//                 >
//                   View Dashboard
//                 </button>
//                 <button
//                   onClick={() => { setDistrict(""); }}
//                   className="px-4 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-100"
//                 >
//                   Reset
//                 </button>
//               </div>

//               <div className="mt-4 text-xs text-gray-500">
//                 Data Source: <a href="https://data.gov.in/" className="underline">data.gov.in</a>
//               </div>
//             </div>
//           </aside>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="bg-white border-t">
//         <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-gray-600 flex flex-col sm:flex-row justify-between items-center gap-3">
//           <div>© {new Date().getFullYear()} MGNREGA Dashboard — Built for Build for Bharat</div>
//           <div>
//             <a href="https://data.gov.in/" target="_blank" className="underline mr-4">Data Portal</a>
//             <a href="https://rural.nic.in/" target="_blank" className="underline">Ministry</a>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }































"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DistrictSelectorAccessible from "@/components/DistrictSelectorAccessible";
import DistrictSelector from "@/components/DistrictSelector";

export default function Home() {
  const router = useRouter();
  const [district, setDistrict] = useState("");
  const [locLoading, setLocLoading] = useState(false);

  const handleSelect = (districtName) => {
    setDistrict(districtName);
    if (districtName) {
      router.push(`/dashboard?district=${encodeURIComponent(districtName)}`);
    }
  };

  // Alternate direct "Use my location" here (calls geolocation + reverse geocode, then navigates)
  const useMyLocationAndGo = async () => {
    if (!navigator.geolocation) {
      alert("आपके ब्राउज़र में स्थान की अनुमति उपलब्ध नहीं है। / Location not available in your browser.");
      return;
    }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        // Nominatim reverse geocode (demo). Be careful with rate limits in production.
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const json = await res.json();
        const address = json.address || {};
        console.log(address)
        const districtName =
          address.city_district.split(" ")[0];
          address.district ||
          address.county ||
          address.state_district ||
          address.state ||
          "";
        console.log(districtName)

        if (!districtName) {
          alert("अपने स्थान से किसी जिले का पता नहीं चल सका। कृपया मैन्युअली चयन करें।");
          setLocLoading(false);
          return;
        }

        // Normalize (simple) and navigate — backend/dashboard expects names like 'BHOPAL' etc.
        // If your stored district names are Title Case, try to match roughly:
        const norm = districtName.trim();
        // Try direct navigation with normalized name; if your district list uses different names,
        // DistrictSelectorAccessible's internal matching will also work if user clicks the 📍 button there.
        router.push(`/dashboard?district=${encodeURIComponent(norm)}`);
      } catch (err) {
        console.error("Reverse geocode failed", err);
        alert("स्थान पहचानने में त्रुटि हुई। कृपया मैन्युअली चयन करें।");
      } finally {
        setLocLoading(false);
      }
    }, (err) => {
      console.error("Geolocation error", err);
      alert("स्थान अनुमति अस्वीकृत या विफल।");
      setLocLoading(false);
    }, { enableHighAccuracy: false, timeout: 10000 });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-sm sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://www.data.gov.in/_nuxt/img/logo.f9fcba1.svg"
              alt="DataGov Logo"
              className="w-40 sm:w-48"
            />
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-700">
            <a href="/" className="px-3 py-1 rounded hover:bg-gray-100">Home</a>
            <a href="https://rural.nic.in/" target="_blank" rel="noreferrer" className="hover:text-green-700">Rural Development</a>
            <a href="https://data.gov.in/" target="_blank" rel="noreferrer" className="hover:text-green-700">Data Portal</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="w-full">
        <div
          className="relative overflow-hidden"
          style={{
            backgroundImage:
              "url('https://www.data.gov.in/_nuxt/img/bg-search-default.c16e215.jpg')",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent"></div>

          <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight drop-shadow-md max-w-4xl">
              Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)
            </h2>

            {/* <p className="mt-4 text-sm md:text-base text-white/90 max-w-2xl">
            A Government of India programme that guarantees wage employment to rural households —
              helping livelihoods by providing unskilled manual work close to home.
            </p> */}
            <div className="mt-4 text-sm md:text-base text-white/90 max-w-2xl">
            <div>

              A Government of India programme that guarantees wage employment to rural households —
              helping livelihoods by providing unskilled manual work close to home.
            </div>
              यह एक सरकारी योजना है जो ग्रामीण परिवारों को मजदूरी पर रोज़गार दिलाने का वादा करती है — स्थानीय स्तर पर अनस्किल्ड काम के माध्यम से रोज़गार सुनिश्चित करती है।
            </div>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="inline-flex items-center gap-3 bg-white/10 text-white rounded-full px-4 py-2 text-sm">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full" />
                <span>100+ लाख लाभार्थी (2025)</span>
              </div>

              <div className="inline-flex items-center gap-3 bg-white/10 text-white rounded-full px-4 py-2 text-sm">
                <span className="inline-block w-2 h-2 bg-blue-300 rounded-full" />
                <span>District-level insights & trends — जिले की स्थिति सरल भाषा में</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content area */}
      <main className="flex-1 flex items-start justify-center -mt-12 px-6 pb-12">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Short description (Bilingual) */}
          <section className="transform translate-y-6 lg:translate-y-0 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800">What this site shows / साइट क्या दिखाती है</h3>
            <p className="mt-3 text-gray-700 leading-relaxed">
              हम MGNREGA डेटा को सरल और स्थानीय भाषा में दिखाते हैं — हर जिले के लिए। यहाँ आप पाएँगे:
            </p>

            <ul className="mt-4 space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block w-3 h-3 bg-green-500 rounded-full" />
                <div>
                  <div className="font-medium">People benefited — latest month & historic trend</div>
                  <div className="text-sm text-gray-600">पता करें कितने लोगों ने लाभ लिया — वर्तमान और पिछले महीनों में।</div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block w-3 h-3 bg-blue-500 rounded-full" />
                <div>
                  <div className="font-medium">Wages paid and person-days created</div>
                  <div className="text-sm text-gray-600">कितनी मजदूरी दी गई और कितने व्यक्ति-दिन बने।</div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block w-3 h-3 bg-yellow-400 rounded-full" />
                <div>
                  <div className="font-medium">Easy comparison with state average</div>
                  <div className="text-sm text-gray-600">किसी जिले की स्थिति राज्य की औसत से कैसे मेल खाती है — आसान भाषा में।</div>
                </div>
              </li>
            </ul>

            <div className="mt-6 text-sm text-gray-500">
              सुझाव: यदि आप अनुमति दें तो हम आपका जिला पहचान कर सीधे डैशबोर्ड खोल सकते हैं — नीचे “मेरा जिला बताएं” पर टैप करें।
            </div>
          </section>

          {/* Right: Selector card with Use Location quick button */}
          <aside className="transform translate-y-6 lg:translate-y-0">
            <div className="bg-gradient-to-tr from-white to-gray-50 rounded-xl shadow-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-800">Select Your District / अपना जिला चुनें</h3>
              <p className="text-sm text-gray-600 mt-1 mb-4">
                जिला चुनें या नीचे से सीधे अपना स्थान बताइए।
              </p>


              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={useMyLocationAndGo}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-md shadow"
                >
                  {locLoading ? "रीडायरेक्ट कर रहे हैं…" : "मेरा जिला बताइए / Use my location"}
                </button>

                {/* <button
                  onClick={() => { setDistrict(""); }}
                  className="px-4 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-100"
                >
                  Reset
                </button> */}
              </div>
              <div className=" flex items-center justify-center py-3">OR</div>
              <div className="bg-white rounded-lg p-4 shadow-inner">
                <DistrictSelector onSelect={handleSelect} />
              </div>

              <div className="mt-4 text-xs text-gray-500">
                Data Source: <a href="https://data.gov.in/" className="underline" target="_blank" rel="noreferrer">data.gov.in</a>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-gray-600 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div>© {new Date().getFullYear()} MGNREGA Dashboard — Built for Build for Bharat</div>
          <div>
            <a href="https://data.gov.in/" target="_blank" className="underline mr-4">Data Portal</a>
            <a href="https://rural.nic.in/" target="_blank" className="underline">Ministry</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

