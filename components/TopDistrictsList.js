// components/TopDistrictsList.js
export default function TopDistrictsList({ list = [], onClick = () => {} }) {
  if (!list || !list.length) return <div className="text-sm text-gray-500">Top districts data not available.</div>;

  return (
    <div className="space-y-2">
      {list.map((d, idx) => (
        <button key={d.name} onClick={() => onClick(d.name)} className="w-full flex items-center justify-between p-2 rounded hover:bg-gray-50">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-semibold ${idx < 3 ? "bg-green-600" : idx < 10 ? "bg-yellow-500" : "bg-gray-300"}`}>
              {idx+1}
            </div>
            <div className="text-sm text-left">
              <div className="font-medium">{d.name}</div>
              <div className="text-xs text-gray-500">{d.people?.toLocaleString?.() ?? d.people}</div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
