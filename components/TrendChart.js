// components/TrendChart.js
"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function TrendChart({ months = [], dataMap = {}, metric = "people", labelMap = {} }) {
  const dataset = dataMap[metric] || [];
  const label = labelMap[metric] || metric;

  // choose sensible styling per metric
  const styleBy = {
    people: { borderColor: "rgba(34,197,94,1)", bg: "rgba(34,197,94,0.12)" },
    wages: { borderColor: "rgba(59,130,246,1)", bg: "rgba(59,130,246,0.12)" },
    workdays: { borderColor: "rgba(234,179,8,1)", bg: "rgba(234,179,8,0.12)" },
    completion: { borderColor: "rgba(107,114,128,1)", bg: "rgba(107,114,128,0.12)" },
  };
  const style = styleBy[metric] || styleBy.people;

  const chartData = {
    labels: months,
    datasets: [
      {
        label,
        data: dataset,
        borderColor: style.borderColor,
        backgroundColor: style.bg,
        tension: 0.35,
        fill: true,
        pointRadius: 3,
      },
    ],
  };

  const opts = {
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    maintainAspectRatio: false,
    responsive: true,
    scales: { x: { ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 10 } } },
  };

  return <div style={{ height: 320 }}><Line data={chartData} options={opts} /></div>;
}
