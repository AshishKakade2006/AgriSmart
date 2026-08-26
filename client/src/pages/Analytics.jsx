import { useEffect, useMemo, useState } from "react";
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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await getAnalytics();

      setAnalytics({
        cropDistribution: res.data.cropDistribution || {},
        areaDistribution: res.data.areaDistribution || {},
      });
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  const areaData = Object.entries(analytics.areaDistribution);

  const totalArea = areaData.reduce(
    (total, [, area]) => total + Number(area),
    0
  );

  const totalCropTypes = Object.keys(
    analytics.cropDistribution
  ).length;

  // Find crop occupying the largest area
  const largestCrop = useMemo(() => {
    if (areaData.length === 0) return null;

    return areaData.reduce((largest, current) => {
      return Number(current[1]) > Number(largest[1])
        ? current
        : largest;
    });
  }, [analytics.areaDistribution]);

  // Pie chart based on cultivated area
  const pieData = {
    labels: areaData.map(([crop]) => crop),

    datasets: [
      {
        data: areaData.map(([, area]) => Number(area)),

        backgroundColor: [
          "#16A34A",
          "#2563EB",
          "#F59E0B",
          "#DC2626",
          "#7C3AED",
          "#0891B2",
          "#65A30D",
          "#EA580C",
        ],

        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  // Bar chart
  const barData = {
    labels: areaData.map(([crop]) => crop),

    datasets: [
      {
        label: "Area (Acres)",
        data: areaData.map(([, area]) => Number(area)),
        backgroundColor: "#16A34A",
        borderRadius: 6,
        barThickness: 28,
      },
    ],
  };

  const pieOptions = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "bottom",

        labels: {
          padding: 18,
          usePointStyle: true,
          pointStyle: "circle",
          font: {
            size: 13,
          },
        },
      },

      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw;

            const percentage =
              totalArea > 0
                ? ((value / totalArea) * 100).toFixed(1)
                : 0;

            return ` ${context.label}: ${value} acres (${percentage}%)`;
          },
        },
      },
    },
  };

  const barOptions = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        callbacks: {
          label: function (context) {
            return ` ${context.raw} acres`;
          },
        },
      },
    },

    scales: {
      y: {
        beginAtZero: true,

        title: {
          display: true,
          text: "Area (Acres)",
        },

        grid: {
          color: "#E5E7EB",
        },
      },

      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading analytics...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (areaData.length === 0) {
    return (
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">
            Farm Analytics
          </h1>

          <p className="text-gray-500 mt-2">
            A simple overview of your crops and cultivated land.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            No crop data available
          </h2>

          <p className="text-gray-500 mt-2">
            Add some crops to your farm to see analytics here.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">
          Farm Analytics
        </h1>

        <p className="text-gray-500 mt-2">
          A simple overview of your crops and cultivated land.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">

        {/* Total area */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Total cultivated area
          </p>

          <p className="text-3xl font-semibold text-gray-800 mt-2">
            {totalArea.toFixed(2)}
          </p>

          <p className="text-sm text-gray-400 mt-1">
            acres
          </p>
        </div>

        {/* Crop types */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Crop types
          </p>

          <p className="text-3xl font-semibold text-gray-800 mt-2">
            {totalCropTypes}
          </p>

          <p className="text-sm text-gray-400 mt-1">
            currently recorded
          </p>
        </div>

        {/* Largest crop */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Largest crop
          </p>

          <p className="text-2xl font-semibold text-gray-800 mt-2 capitalize">
            {largestCrop?.[0]}
          </p>

          <p className="text-sm text-gray-400 mt-1">
            {Number(largestCrop?.[1]).toFixed(2)} acres
          </p>
        </div>
      </div>

      {/* Main analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Pie chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">

          <div className="mb-5">
            <h2 className="text-xl font-semibold text-gray-800">
              Crop distribution
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Share of cultivated land by crop
            </p>
          </div>

          <div className="h-[350px]">
            <Pie
              data={pieData}
              options={pieOptions}
            />
          </div>
        </div>

        {/* Bar chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">

          <div className="mb-5">
            <h2 className="text-xl font-semibold text-gray-800">
              Area by crop
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Cultivated area in acres
            </p>
          </div>

          <div className="h-[350px]">
            <Bar
              data={barData}
              options={barOptions}
            />
          </div>
        </div>
      </div>

      {/* Crop breakdown */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mt-6">

        <div className="mb-5">
          <h2 className="text-xl font-semibold text-gray-800">
            Crop breakdown
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Percentage of your cultivated area
          </p>
        </div>

        <div className="space-y-5">

          {areaData
            .sort((a, b) => Number(b[1]) - Number(a[1]))
            .map(([crop, area]) => {

              const percentage =
                totalArea > 0
                  ? (Number(area) / totalArea) * 100
                  : 0;

              return (
                <div key={crop}>

                  <div className="flex justify-between items-center mb-2">

                    <span className="font-medium text-gray-700 capitalize">
                      {crop}
                    </span>

                    <span className="text-sm text-gray-500">
                      {Number(area).toFixed(2)} acres ·{" "}
                      {percentage.toFixed(1)}%
                    </span>

                  </div>

                  <div className="w-full bg-gray-100 rounded-full h-2">

                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Simple insight */}
      {largestCrop && (
        <div className="mt-6 bg-green-50 border border-green-100 rounded-xl p-5">

          <h3 className="font-semibold text-green-900">
            Farm insight
          </h3>

          <p className="text-sm text-green-800 mt-1">
            {largestCrop[0]} occupies{" "}
            {(
              (Number(largestCrop[1]) / totalArea) *
              100
            ).toFixed(1)}
            % of your cultivated area, making it your
            largest crop by land coverage.
          </p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Analytics;