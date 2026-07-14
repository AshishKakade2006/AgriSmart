import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { getMyCrops } from "../services/cropService";
import CropCard from "../components/CropCard";
import toast from "react-hot-toast";

const Crops = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const res = await getMyCrops();
      setCrops(res.data.crops);
    } catch (error) {
      toast.error("Failed to load crops");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = (id) => {
  setCrops((prev) => prev.filter((crop) => crop._id !== id));
};

  return (
    <DashboardLayout>
      <h1 className="text-4xl font-bold mb-8">
        🌾 My Crops
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : crops.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center shadow">
          <h2 className="text-2xl font-semibold">
            No Crops Added
          </h2>

          <p className="text-gray-500 mt-3">
            Click "Add Crop" to add your first crop.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {crops.map((crop) => (
            <CropCard
              key={crop._id}
              crop={crop}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Crops;