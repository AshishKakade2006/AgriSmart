import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import DashboardLayout from "../components/DashboardLayout";
import {
  getCropById,
  updateCrop,
} from "../services/cropService";
import toast from "react-hot-toast";

const EditCrop = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchCrop();
  }, []);

  const fetchCrop = async () => {
    try {
      const res = await getCropById(id);

      const crop = res.data.crop;

      reset({
        cropName: crop.cropName,
        area: crop.area,
        location: crop.location,
        sowingDate: crop.sowingDate.slice(0, 10),
        expectedHarvest: crop.expectedHarvest.slice(0, 10),
      });
    } catch (error) {
      toast.error("Failed to load crop");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      await updateCrop(id, data);

      toast.success("Crop Updated Successfully 🌾");

      navigate("/crops");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Update Failed"
      );
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <h2>Loading...</h2>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>

      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">

        <h1 className="text-3xl font-bold text-emerald-700 mb-6">
          ✏ Edit Crop
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >

          <div>
            <label>Crop Name</label>

            <input
              className="w-full border rounded-xl p-3 mt-2"
              {...register("cropName", {
                required: "Crop Name is required",
              })}
            />

            <p className="text-red-500">
              {errors.cropName?.message}
            </p>
          </div>

          <div>
            <label>Area</label>

            <input
              type="number"
              className="w-full border rounded-xl p-3 mt-2"
              {...register("area", {
                required: "Area is required",
              })}
            />
          </div>

          <div>
            <label>Location</label>

            <input
              className="w-full border rounded-xl p-3 mt-2"
              {...register("location", {
                required: "Location is required",
              })}
            />
          </div>

          <div>
            <label>Sowing Date</label>

            <input
              type="date"
              className="w-full border rounded-xl p-3 mt-2"
              {...register("sowingDate")}
            />
          </div>

          <div>
            <label>Expected Harvest</label>

            <input
              type="date"
              className="w-full border rounded-xl p-3 mt-2"
              {...register("expectedHarvest")}
            />
          </div>

          <button
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700"
          >
            Update Crop
          </button>

        </form>

      </div>

    </DashboardLayout>
  );
};

export default EditCrop;