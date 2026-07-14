import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import DashboardLayout from "../components/DashboardLayout";
import { createCrop } from "../services/cropService";

const AddCrop = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      await createCrop(data);

      toast.success("Crop Added Successfully 🌾");

      navigate("/crops");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add crop"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8"
      >
        <h1 className="text-3xl font-bold text-emerald-700 mb-6">
          🌾 Add New Crop
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          {/* Crop Name */}

          <div>
            <label className="font-medium">Crop Name</label>

            <input
              className="w-full border rounded-xl p-3 mt-2"
              placeholder="Example: Wheat"
              {...register("cropName", {
                required: "Crop Name is required",
              })}
            />

            <p className="text-red-500 text-sm">
              {errors.cropName?.message}
            </p>
          </div>

          {/* Area */}

          <div>
            <label className="font-medium">
              Area (Acres)
            </label>

            <input
              type="number"
              className="w-full border rounded-xl p-3 mt-2"
              {...register("area", {
                required: "Area is required",
              })}
            />

            <p className="text-red-500 text-sm">
              {errors.area?.message}
            </p>
          </div>

          {/* Location */}

          <div>
            <label className="font-medium">
              Location
            </label>

            <input
              className="w-full border rounded-xl p-3 mt-2"
              placeholder="Bhopal"
              {...register("location", {
                required: "Location is required",
              })}
            />

            <p className="text-red-500 text-sm">
              {errors.location?.message}
            </p>
          </div>

          {/* Sowing Date */}

          <div>
            <label className="font-medium">
              Sowing Date
            </label>

            <input
              type="date"
              className="w-full border rounded-xl p-3 mt-2"
              {...register("sowingDate", {
                required: "Sowing Date is required",
              })}
            />

            <p className="text-red-500 text-sm">
              {errors.sowingDate?.message}
            </p>
          </div>

          {/* Harvest Date */}

          <div>
            <label className="font-medium">
              Expected Harvest
            </label>

            <input
              type="date"
              className="w-full border rounded-xl p-3 mt-2"
              {...register("expectedHarvest", {
                required: "Expected Harvest is required",
              })}
            />

            <p className="text-red-500 text-sm">
              {errors.expectedHarvest?.message}
            </p>
          </div>

          <button
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 transition"
          >
            {loading ? "Saving..." : "Save Crop"}
          </button>
        </form>
      </motion.div>
    </DashboardLayout>
  );
};

export default AddCrop;