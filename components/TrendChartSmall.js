// components/TrendChartSmall.js
"use client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

export default function TrendChartSmall({ data = [] }) {
  const chartData = {
    labels: data.map((_, i) => i + 1),
    datasets: [
      {
        data: data,
        borderWidth: 2,
        tension: 0.35,
        fill: false,
        pointRadius: 0,
      },
    ],
  };

  const opts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    scales: { x: { display: false }, y: { display: false } },
  };

  return <div style={{ height: 48 }}><Line data={chartData} options={opts} /></div>;
}
