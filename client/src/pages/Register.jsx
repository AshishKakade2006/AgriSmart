import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Leaf } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import api from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await api.post("/auth/register", data);

      toast.success("Registration Successful!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration Failed"
      );
    }
  };

  return (
    <>
      <Toaster position="top-right" />

      <div className="min-h-screen bg-slate-50 flex">

        {/* Left Side */}

        <div className="hidden lg:flex w-1/2 bg-emerald-600 text-white items-center justify-center p-12">

          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Leaf size={80} />

            <h1 className="text-5xl font-bold mt-6">
              Join AgriSmart
            </h1>

            <p className="mt-6 text-xl text-emerald-100">
              Start managing your crops intelligently.
            </p>

          </motion.div>

        </div>

        {/* Right Side */}

        <div className="flex-1 flex items-center justify-center px-6">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10"
          >

            <h2 className="text-3xl font-bold">
              Create Account
            </h2>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5 mt-8"
            >

              {/* Name */}

              <div>

                <label>Name</label>

                <div className="border rounded-xl flex items-center px-4 mt-2">

                  <User size={18} />

                  <input
                    className="w-full p-3 outline-none"
                    placeholder="Full Name"
                    {...register("name", {
                      required: "Name is required",
                    })}
                  />

                </div>

                <p className="text-red-500 text-sm">
                  {errors.name?.message}
                </p>

              </div>

              {/* Email */}

              <div>

                <label>Email</label>

                <div className="border rounded-xl flex items-center px-4 mt-2">

                  <Mail size={18} />

                  <input
                    type="email"
                    className="w-full p-3 outline-none"
                    placeholder="Email"
                    {...register("email", {
                      required: "Email is required",
                    })}
                  />

                </div>

                <p className="text-red-500 text-sm">
                  {errors.email?.message}
                </p>

              </div>

              {/* Password */}

              <div>

                <label>Password</label>

                <div className="border rounded-xl flex items-center px-4 mt-2">

                  <Lock size={18} />

                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full p-3 outline-none"
                    placeholder="Password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>

                </div>

                <p className="text-red-500 text-sm">
                  {errors.password?.message}
                </p>

              </div>

              {/* Role */}

              <div>

                <label>Role</label>

                <select
                  className="w-full border rounded-xl p-3 mt-2"
                  {...register("role")}
                >
                  <option value="farmer">Farmer</option>
                  <option value="admin">Admin</option>
                </select>

              </div>

              <button
                className="w-full bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700"
              >
                Register
              </button>

            </form>

            <p className="text-center mt-6">

              Already have an account?

              <Link
                className="text-emerald-600 ml-2"
                to="/login"
              >
                Login
              </Link>

            </p>

          </motion.div>

        </div>

      </div>

    </>
  );
};

export default Register;