"use client";
import { useState } from "react";

export default function DistrictSelector({ onSelect }) {
  const [selected, setSelected] = useState("");

  const districts = [
    "Agar Malwa","Alirajpur","Anuppur","Ashoknagar","Balaghat","Barwani","Betul",
    "Bhind","Bhopal","Burhanpur","Chhatarpur","Chhindwara","Damoh","Datia","Dewas",
    "Dhar","Dindori","Guna","Gwalior","Harda","Hoshangabad","Indore","Jabalpur",
    "Jhabua","Katni","Khandwa","Khargone","Mandla","Mandsaur","Morena","Narsinghpur",
    "Neemuch","Panna","Raisen","Rajgarh","Ratlam","Rewa","Sagar","Satna","Sehore",
    "Seoni","Shahdol","Shajapur","Sheopur","Shivpuri","Sidhi","Singrauli","Tikamgarh",
    "Ujjain","Umaria","Vidisha"
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Select Your District</h2>
      <select
        className="p-2 border rounded w-full"
        value={selected}
        onChange={(e) => {
          setSelected(e.target.value);
          onSelect(e.target.value);
          localStorage.setItem("mgnrega_last_district", e.target.value);
        }}
      >
        <option value="">--Choose District--</option>
        {districts.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
    </div>
  );
}
