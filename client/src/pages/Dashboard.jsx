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
      <div className="space-y-6">

        {/* =====================================================
            HEADER
        ===================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

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
            <Leaf
              size={17}
              className="text-emerald-600"
            />

            <span>Smart Farming</span>
          </div>

        </div>


        {/* =====================================================
            STAT CARDS
        ===================================================== */}
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


        {/* =====================================================
            WEATHER
        ===================================================== */}

        <div className="w-full">
          <WeatherCard />
        </div>


        {/* =====================================================
            UPCOMING HARVESTS + RECENT CROPS
        ===================================================== */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-stretch">

          {/* =================================================
              UPCOMING HARVESTS
          ================================================= */}

          <UpcomingHarvests />


          {/* =================================================
              RECENT CROPS
          ================================================= */}

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden h-full">

            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-emerald-600">
                  Farm Activity
                </p>

                <h2 className="text-xl font-semibold text-gray-900 mt-1">
                  Recent Crops
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Recently added crops on your farm
                </p>
              </div>

              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Sprout
                  size={20}
                  className="text-emerald-600"
                />
              </div>

            </div>


            {/* =================================================
                EMPTY STATE
            ================================================= */}

            {recentCrops.length === 0 ? (

              <div className="flex flex-col items-center justify-center text-center px-6 py-12">

                <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Sprout
                    size={21}
                    className="text-emerald-600"
                  />
                </div>

                <p className="text-sm font-medium text-gray-700 mt-3">
                  No crops added yet
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Add your first crop to start managing your farm.
                </p>

              </div>

            ) : (

              /* =================================================
                 CROP LIST
              ================================================= */

              <div className="px-6">

                <div className="divide-y divide-gray-100">

                  {recentCrops.map((crop) => (

                    <div
                      key={crop._id}
                      className="py-4"
                    >

                      <div className="flex items-center justify-between gap-4">

                        {/* Crop information */}
                        <div className="flex items-center gap-3 min-w-0">

                          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                            <Sprout
                              size={18}
                              className="text-emerald-600"
                            />
                          </div>

                          <div className="min-w-0">

                            <p className="font-medium text-gray-800 truncate">
                              {crop.cropName}
                            </p>

                            <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">

                              <MapPin size={13} />

                              <span className="truncate">
                                {crop.location}
                              </span>

                            </div>

                          </div>

                        </div>


                        {/* Status */}
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


                      {/* Harvest date */}
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-3 ml-12">

                        <CalendarDays size={13} />

                        <span>
                          Expected harvest:
                        </span>

                        <span className="text-gray-600 font-medium">
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

                  ))}

                </div>

              </div>

            )}

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;