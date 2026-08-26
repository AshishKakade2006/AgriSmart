import { useEffect, useState } from "react";
import {
  CalendarDays,
  MapPin,
  Sprout,
  Clock3,
} from "lucide-react";

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

    return Math.ceil(
      diffTime / (1000 * 60 * 60 * 24)
    );
  };

  const getBadgeStyle = (days) => {
    if (days <= 7) {
      return "bg-red-50 text-red-600";
    }

    if (days <= 30) {
      return "bg-amber-50 text-amber-600";
    }

    return "bg-emerald-50 text-emerald-600";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden h-full">

      {/* ================= HEADER ================= */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">

        <div>
          <p className="text-sm font-medium text-emerald-600">
            Harvest Schedule
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-1">
            Upcoming Harvests
          </h2>
        </div>

        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
          <CalendarDays
            size={20}
            className="text-emerald-600"
          />
        </div>

      </div>

      {/* ================= CONTENT ================= */}
      <div className="px-6">

        {crops.length === 0 ? (
          <div className="py-12 text-center">

            <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
              <Sprout
                size={21}
                className="text-emerald-600"
              />
            </div>

            <p className="text-sm font-medium text-gray-700 mt-3">
              No upcoming harvests
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Your upcoming harvests will appear here.
            </p>

          </div>
        ) : (
          <div className="divide-y divide-gray-100">

            {crops.map((crop) => {
              const days = getDaysRemaining(
                crop.expectedHarvest
              );

              return (
                <div
                  key={crop._id}
                  className="py-4 flex items-center justify-between gap-4"
                >

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

                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                        <MapPin size={13} />

                        <span className="truncate">
                          {crop.location}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                        <CalendarDays size={13} />

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
                  </div>

                  {/* Days remaining */}
                  <div className="flex-shrink-0 text-right">

                    <div className="flex items-center justify-end gap-1 text-xs text-gray-400 mb-1">
                      <Clock3 size={12} />

                      <span>
                        Remaining
                      </span>
                    </div>

                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getBadgeStyle(
                        days
                      )}`}
                    >
                      {days <= 0
                        ? "Due"
                        : `${days} days`}
                    </span>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
};

export default UpcomingHarvests;