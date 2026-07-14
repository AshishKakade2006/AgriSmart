import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { getDashboardStats } from "../services/cropService";
import toast from "react-hot-toast";
import WeatherCard from "../components/WeatherCard";
import UpcomingHarvests from "../components/UpcomingHarvests";

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
      toast.error("Failed to load dashboard");
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-4xl font-bold text-gray-800">
        Dashboard
      </h1>

      <p className="text-gray-500 mt-2">
        Welcome to AgriSmart 🌱
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-gray-500">
            Total Crops
          </h3>

          <p className="text-4xl font-bold mt-3">
            {stats.totalCrops}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-gray-500">
            Healthy Crops
          </h3>

          <p className="text-4xl font-bold text-green-600 mt-3">
            {stats.healthyCrops}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-gray-500">
            Diseased Crops
          </h3>

          <p className="text-4xl font-bold text-red-500 mt-3">
            {stats.diseasedCrops}
          </p>
        </div>

      </div>
     <div className="mt-8">
  <WeatherCard />
</div>

{/* Recent Crops */}
<div className="bg-white rounded-2xl shadow p-6 mt-8">

  <h2 className="text-2xl font-bold mb-6">
    🌾 Recent Crops
  </h2>

  {
    recentCrops.length === 0 ? (

      <p className="text-gray-500">
        No Crops Added Yet
      </p>

    ) : (

      recentCrops.map((crop) => (

        <div
          key={crop._id}
          className="border-b py-4 last:border-none"
        >

          <h3 className="font-semibold text-lg">
            {crop.cropName}
          </h3>

          <p className="text-gray-500">
            📍 {crop.location}
          </p>

          <p className="text-gray-500">
            📅 {new Date(crop.expectedHarvest).toLocaleDateString()}
          </p>

        </div>

      ))

    )
  }

</div>
<UpcomingHarvests />


</DashboardLayout>
  );
};

export default Dashboard;