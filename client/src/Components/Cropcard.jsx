import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import { deleteCrop } from "../services/cropService";
import toast from "react-hot-toast";

const CropCard = ({ crop, onDelete }) => {

  const handleDelete = async () => {

    const confirmDelete = window.confirm(
      `Delete ${crop.cropName}?`
    );

    if (!confirmDelete) return;

    try {

      await deleteCrop(crop._id);

      toast.success("Crop Deleted Successfully");

      onDelete(crop._id);

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to delete crop"
      );

    }

  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold text-emerald-700">
        {crop.cropName}
      </h2>

      <div className="mt-4 space-y-2">

        <p><strong>Area:</strong> {crop.area} Acres</p>

        <p><strong>Location:</strong> {crop.location}</p>

        <p>
          <strong>Sowing:</strong>{" "}
          {new Date(crop.sowingDate).toLocaleDateString()}
        </p>

        <p>
          <strong>Harvest:</strong>{" "}
          {new Date(crop.expectedHarvest).toLocaleDateString()}
        </p>

      </div>

      <div className="flex gap-4 mt-6">

        <Link
          to={`/edit-crop/${crop._id}`}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
        >
          <Pencil size={18} />
          Edit
        </Link>

        <button
          onClick={handleDelete}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
        >
          <Trash2 size={18} />
          Delete
        </button>

      </div>

    </div>
  );
};

export default CropCard;