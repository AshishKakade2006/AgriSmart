import { useEffect, useState } from "react";

import DashboardLayout from "../components/DashboardLayout";
import { getDashboardStats } from "../services/cropService";

import toast from "react-hot-toast";

import WeatherCard from "../components/WeatherCard";
import UpcomingHarvests from "../components/UpcomingHarvests";

import {
  Sprout,
  HeartPulse,
  AlertTriangle,
  Leaf,
  MapPin,
  CalendarDays,
} from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCrops: 0,
    healthyCrops: 0,
    diseasedCrops: 0,
  });

  const [recentCrops, setRecentCrops] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getDashboardStats();

      setStats(res.data.stats);
      setRecentCrops(res.data.recentCrops);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load dashboard");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-7">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-emerald-600 mb-1">
              Farm Overview
            </p>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              Dashboard
            </h1>

            <p className="text-gray-500 mt-2">
              Keep track of your crops, weather and upcoming harvests.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-2 w-fit">
            <Leaf size={17} className="text-emerald-600" />
            <span>Smart Farming</span>
          </div>
        </div>

        {/* ================= STAT CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Total Crops */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Total Crops
                </p>

                <p className="text-3xl font-semibold text-gray-900 mt-2">
                  {stats.totalCrops}
                </p>
              </div>

              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Sprout
                  size={20}
                  className="text-emerald-600"
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Crops currently being managed
              </p>
            </div>
          </div>

          {/* Healthy Crops */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Healthy Crops
                </p>

                <p className="text-3xl font-semibold text-gray-900 mt-2">
                  {stats.healthyCrops}
                </p>
              </div>

              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <HeartPulse
                  size={20}
                  className="text-green-600"
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-xs text-green-600">
                Crops showing healthy status
              </p>
            </div>
          </div>

          {/* Diseased Crops */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Needs Attention
                </p>

                <p className="text-3xl font-semibold text-gray-900 mt-2">
                  {stats.diseasedCrops}
                </p>
              </div>

              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                <AlertTriangle
                  size={20}
                  className="text-red-500"
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-xs text-red-500">
                Crops requiring attention
              </p>
            </div>
          </div>
        </div>

        {/* ================= WEATHER + HARVEST ================= */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

          {/* Weather */}
          <div className="xl:col-span-3">
            <WeatherCard />
          </div>

          {/* Upcoming Harvests */}
          <div className="xl:col-span-2">
            <UpcomingHarvests />
          </div>
        </div>

        {/* ================= RECENT CROPS ================= */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

          {/* Header */}
          <div className="px-5 sm:px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Crops
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Recently added crops on your farm
              </p>
            </div>

            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Sprout
                size={18}
                className="text-emerald-600"
              />
            </div>
          </div>

          {/* Crop List */}
          <div>
            {recentCrops.length === 0 ? (
              <div className="py-12 px-5 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
                  <Sprout
                    size={23}
                    className="text-emerald-600"
                  />
                </div>

                <p className="text-gray-700 font-medium mt-4">
                  No crops added yet
                </p>

                <p className="text-sm text-gray-400 mt-1">
                  Add your first crop to start managing your farm.
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Header */}
                <div className="hidden md:grid grid-cols-12 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  <div className="col-span-4">
                    Crop
                  </div>

                  <div className="col-span-3">
                    Location
                  </div>

                  <div className="col-span-3">
                    Expected Harvest
                  </div>

                  <div className="col-span-2 text-right">
                    Status
                  </div>
                </div>

                {/* Rows */}
                <div className="divide-y divide-gray-100">
                  {recentCrops.map((crop) => (
                    <div
                      key={crop._id}
                      className="px-5 sm:px-6 py-4 hover:bg-gray-50 transition"
                    >

                      {/* Desktop */}
                      <div className="hidden md:grid grid-cols-12 items-center">

                        {/* Crop */}
                        <div className="col-span-4 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                            <Sprout
                              size={18}
                              className="text-emerald-600"
                            />
                          </div>

                          <div>
                            <p className="font-medium text-gray-800">
                              {crop.cropName}
                            </p>

                            <p className="text-xs text-gray-400 mt-0.5">
                              Crop
                            </p>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="col-span-3">
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <MapPin
                              size={15}
                              className="text-gray-400"
                            />
                            <span>
                              {crop.location}
                            </span>
                          </div>
                        </div>

                        {/* Harvest */}
                        <div className="col-span-3">
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <CalendarDays
                              size={15}
                              className="text-gray-400"
                            />

                            <span>
                              {new Date(
                                crop.expectedHarvest
                              ).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="col-span-2 flex justify-end">
                          <span
                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                              crop.status === "diseased"
                                ? "bg-red-50 text-red-600"
                                : "bg-green-50 text-green-600"
                            }`}
                          >
                            {crop.status === "diseased"
                              ? "Needs Attention"
                              : "Healthy"}
                          </span>
                        </div>
                      </div>

                      {/* Mobile */}
                      <div className="md:hidden">

                        <div className="flex items-start justify-between gap-3">

                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                              <Sprout
                                size={18}
                                className="text-emerald-600"
                              />
                            </div>

                            <div>
                              <p className="font-medium text-gray-800">
                                {crop.cropName}
                              </p>

                              <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                                <MapPin size={13} />
                                {crop.location}
                              </div>
                            </div>
                          </div>

                          <span
                            className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${
                              crop.status === "diseased"
                                ? "bg-red-50 text-red-600"
                                : "bg-green-50 text-green-600"
                            }`}
                          >
                            {crop.status === "diseased"
                              ? "Attention"
                              : "Healthy"}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-4 ml-12">
                          <CalendarDays size={14} />

                          Expected harvest:

                          <span className="text-gray-700 font-medium">
                            {new Date(
                              crop.expectedHarvest
                            ).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;