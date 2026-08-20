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
  ArrowUpRight,
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

      {/* ================= HEADER ================= */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Welcome back to AgriSmart 🌱
          </p>

        </div>

        <div className="hidden sm:flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-sm font-medium">

          <Leaf size={18} />

          Smart Farming

        </div>

      </div>


      {/* ================= STAT CARDS ================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-7">


        {/* Total Crops */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">

          <div className="flex items-center justify-between">

            <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">

              <Sprout size={23} />

            </div>

            <ArrowUpRight
              size={20}
              className="text-gray-400"
            />

          </div>

          <p className="text-gray-500 text-sm mt-5">
            Total Crops
          </p>

          <p className="text-3xl font-bold text-gray-800 mt-1">
            {stats.totalCrops}
          </p>

        </div>


        {/* Healthy Crops */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">

          <div className="flex items-center justify-between">

            <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center text-green-600">

              <HeartPulse size={23} />

            </div>

            <span className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
              Healthy
            </span>

          </div>

          <p className="text-gray-500 text-sm mt-5">
            Healthy Crops
          </p>

          <p className="text-3xl font-bold text-green-600 mt-1">
            {stats.healthyCrops}
          </p>

        </div>


        {/* Diseased Crops */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">

          <div className="flex items-center justify-between">

            <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center text-red-500">

              <AlertTriangle size={23} />

            </div>

            <span className="text-xs font-medium text-red-500 bg-red-50 px-3 py-1 rounded-full">
              Attention
            </span>

          </div>

          <p className="text-gray-500 text-sm mt-5">
            Diseased Crops
          </p>

          <p className="text-3xl font-bold text-red-500 mt-1">
            {stats.diseasedCrops}
          </p>

        </div>

      </div>


      {/* ================= WEATHER + HARVEST ================= */}

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mt-6">


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

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mt-6 overflow-hidden">


        {/* Header */}

        <div className="flex items-center justify-between px-6 py-5 border-b">

          <div>

            <h2 className="text-xl font-bold text-gray-800">
              🌾 Recent Crops
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Your recently added crops
            </p>

          </div>

          <Sprout
            size={22}
            className="text-emerald-500"
          />

        </div>


        {/* Crops */}

        <div className="p-5">

          {recentCrops.length === 0 ? (

            <div className="py-8 text-center">

              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">

                <Sprout
                  size={24}
                  className="text-emerald-500"
                />

              </div>

              <p className="text-gray-500 mt-3">
                No crops added yet
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

              {recentCrops.map((crop) => (

                <div
                  key={crop._id}
                  className="border border-gray-100 rounded-xl p-4 hover:border-emerald-200 hover:shadow-sm transition"
                >

                  <div className="flex items-start justify-between">

                    <div>

                      <h3 className="font-semibold text-lg text-gray-800">
                        {crop.cropName}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        📍 {crop.location}
                      </p>

                    </div>

                    <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center">

                      <Sprout
                        size={18}
                        className="text-emerald-600"
                      />

                    </div>

                  </div>


                  <div className="mt-4 pt-3 border-t border-gray-100">

                    <p className="text-xs text-gray-400">
                      Expected Harvest
                    </p>

                    <p className="text-sm font-medium text-gray-700 mt-1">
                      📅{" "}
                      {new Date(
                        crop.expectedHarvest
                      ).toLocaleDateString()}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>


    </DashboardLayout>
  );
};


export default Dashboard;