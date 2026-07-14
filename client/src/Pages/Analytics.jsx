import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { getAnalytics } from "../services/analyticsService";

import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    cropDistribution: {},
    areaDistribution: {},
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await getAnalytics();

      setAnalytics({
        cropDistribution: res.data.cropDistribution,
        areaDistribution: res.data.areaDistribution,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const pieData = {
  labels: Object.keys(analytics.cropDistribution),
  datasets: [
    {
      data: Object.values(analytics.cropDistribution),
      backgroundColor: [
        "#10B981",
        "#3B82F6",
        "#F59E0B",
        "#EF4444",
        "#8B5CF6",
        "#14B8A6",
      ],
      borderWidth: 2,
    },
  ],
};

  const barData = {
  labels: Object.keys(analytics.areaDistribution),
  datasets: [
    {
      label: "Area (Acres)",
      data: Object.values(analytics.areaDistribution),
      backgroundColor: "#10B981",
      borderRadius: 8,
    },
  ],
};

  return (
  <DashboardLayout>

    <div className="mb-8">
      <h1 className="text-4xl font-bold text-gray-800">
        📊 Analytics Dashboard
      </h1>

      <p className="text-gray-500 mt-2">
        Visual insights about your crops and cultivated area.
      </p>
    </div>

    {/* Summary Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

      <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-medium">
          Total Crop Types
        </h3>

        <p className="text-4xl font-bold mt-3">
          {Object.keys(analytics.cropDistribution).length}
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-medium">
          Total Cultivated Area
        </h3>

        <p className="text-4xl font-bold mt-3">
          {Object.values(analytics.areaDistribution).reduce((a, b) => a + b, 0)} Acres
        </p>
      </div>

    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

      <div className="bg-white rounded-2xl shadow-lg p-6">

        <h2 className="text-2xl font-bold mb-6 text-center">
          🌾 Crop Distribution
        </h2>

        <Pie
          data={pieData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "bottom",
              },
            },
          }}
        />

      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">

        <h2 className="text-2xl font-bold mb-6 text-center">
          📈 Area by Crop
        </h2>

        <Bar
          data={barData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
            },
          }}
        />

      </div>

    </div>

  </DashboardLayout>
);
};

export default Analytics;
