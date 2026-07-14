import { useEffect, useState } from "react";
import { getUpcomingHarvests } from "../services/cropService";

const UpcomingHarvests = () => {
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    fetchUpcomingHarvests();
  }, []);

  const fetchUpcomingHarvests = async () => {
    try {
      const res = await getUpcomingHarvests();
      setCrops(res.data.crops);
    } catch (error) {
      console.error(error);
    }
  };

  const getDaysRemaining = (harvestDate) => {
    const today = new Date();
    const harvest = new Date(harvestDate);

    const diffTime = harvest - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getBadgeColor = (days) => {
    if (days <= 7) return "bg-red-100 text-red-600";
    if (days <= 30) return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 mt-8">

      <h2 className="text-2xl font-bold mb-6">
        📅 Upcoming Harvests
      </h2>

      {crops.length === 0 ? (
        <p className="text-gray-500">
          No upcoming harvests.
        </p>
      ) : (
        crops.map((crop) => {
          const days = getDaysRemaining(crop.expectedHarvest);

          return (
            <div
              key={crop._id}
              className="border-b py-4 last:border-none flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-lg">
                  🌾 {crop.cropName}
                </h3>

                <p className="text-gray-500">
                  📍 {crop.location}
                </p>

                <p className="text-gray-500">
                  📅 {new Date(crop.expectedHarvest).toLocaleDateString()}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getBadgeColor(days)}`}
              >
                {days} days left
              </span>
            </div>
          );
        })
      )}

    </div>
  );
};

export default UpcomingHarvests;