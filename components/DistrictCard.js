export default function DistrictCard({ title, value, color = "bg-green-500", subtitle }) {
  return (
    <div className={`p-4 ${color} text-white rounded shadow-md text-center`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value ?? "-"}</p>
      {subtitle && <p className="text-sm opacity-90 mt-1">{subtitle}</p>}
    </div>
  );
}
