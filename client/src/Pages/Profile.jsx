
import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { getProfile, updateProfile } from "../services/profileService";
import toast from "react-hot-toast";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    farmLocation: "",
    farmSize: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      setProfile(res.data.user);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateProfile(profile);
      toast.success("Profile Updated");
    } catch (err) {
      toast.error("Update Failed");
    }
  };

  return (
    <DashboardLayout>

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-3xl font-bold mb-8">
          👤 My Profile
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            name="name"
            value={profile.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full border rounded-xl p-3"
          />

          <input
            name="email"
            value={profile.email}
            disabled
            className="w-full border rounded-xl p-3 bg-gray-100"
          />

          <input
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full border rounded-xl p-3"
          />

          <input
            name="farmLocation"
            value={profile.farmLocation}
            onChange={handleChange}
            placeholder="Farm Location"
            className="w-full border rounded-xl p-3"
          />

          <input
            type="number"
            name="farmSize"
            value={profile.farmSize}
            onChange={handleChange}
            placeholder="Farm Size (Acres)"
            className="w-full border rounded-xl p-3"
          />

          <button
            className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700"
          >
            Save Changes
          </button>

        </form>

      </div>

    </DashboardLayout>
  );
};

export default Profile;