export default function RankBadgeColored({ rank, total }) {
  if (!rank) return <div className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 font-semibold">-</div>;
  let bg = "bg-gray-100 text-gray-800";
  if (rank <= 10) bg = "bg-green-100 text-green-800";
  else if (rank <= 30) bg = "bg-yellow-100 text-yellow-800";
  else bg = "bg-gray-100 text-gray-800";
  return <div className={`px-3 py-1 rounded-full font-semibold ${bg}`}>{rank}/{total}</div>;
}
