"use client";
import { useEffect, useState } from "react";

export default function DistrictSelectorAccessible({ onSelect }) {
  const [selected, setSelected] = useState("");
  const districts = [
    "Agar Malwa","Alirajpur","Anuppur","Ashoknagar","Balaghat","Barwani","Betul","Bhind","Bhopal","Burhanpur",
    "Chhatarpur","Chhindwara","Damoh","Datia","Dewas","Dhar","Dindori","Guna","Gwalior","Harda","Hoshangabad",
    "Indore","Jabalpur","Jhabua","Katni","Khandwa","Khargone","Mandla","Mandsaur","Morena","Narsinghpur","Neemuch",
    "Panna","Raisen","Rajgarh","Ratlam","Rewa","Sagar","Satna","Sehore","Seoni","Shahdol","Shajapur","Sheopur","Shivpuri",
    "Sidhi","Singrauli","Tikamgarh","Ujjain","Umaria","Vidisha"
  ];

  useEffect(() => {
    const last = localStorage.getItem("mgnrega_last_district");
    if (last && districts.includes(last)) {
      setSelected(last);
      onSelect(last);
    }
  }, []);

  const handleChange = (v) => {
    setSelected(v);
    localStorage.setItem("mgnrega_last_district", v);
    onSelect(v);
  };

  const askGeo = async () => {
  if (!navigator.geolocation)
    return alert("आपके ब्राउज़र में स्थान की अनुमति उपलब्ध नहीं है।");

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const { latitude, longitude } = pos.coords;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await res.json();
      console.log(data)
      const districtName =
        data.address.city_district ||
        data.address.county ||
        data.address.state_district ||
        data.address.state ||
        "";

      if (districtName) {
        // alert(`आपका जिला है: ${districtName}`);
        const match = districts.find(
          (d) => d.toLowerCase() === districtName.toLowerCase()
        );
        if (match) {
          setSelected(match);
          localStorage.setItem("mgnrega_last_district", match);
          onSelect(match);
        } else {
          alert(`जिला "${districtName}" सूची में नहीं मिला।`);
        }
      } else {
        alert("जिला निर्धारित नहीं हो सका।");
      }
    } catch (err) {
      console.error(err);
      alert("स्थान पहचानने में त्रुटि हुई।");
    }
  },
  () => alert("स्थान अनुमति अस्वीकृत या विफल।"));
};


  return (
    <div>
      <div className="flex gap-2">
        <select className="p-3 border rounded w-full" value={selected} onChange={(e) => handleChange(e.target.value)}>
          <option value="">-- अपना जिला चुनें --</option>
          {districts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <button className="px-3 py-2 bg-gray-100 rounded" onClick={askGeo} title="Use location">📍</button>
      </div>
      <div className="mt-2 text-xs text-gray-500">अंतिम चयन याद रखा जाएगा।</div>
    </div>
  );
}
