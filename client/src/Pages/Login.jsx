import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Leaf } from "lucide-react";
import api from "../services/api";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/authContext";



const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
const onSubmit = async (data) => {
  try {
    const res = await api.post("/auth/login", data);

    login(res.data.token, res.data.user);

    toast.success(res.data.message);

    setTimeout(() => {
      navigate("/");
    }, 1000);

  } catch (err) {

    toast.error(
      err.response?.data?.message || "Login Failed"
    );

  }
};
  
  return (
    <>
  <Toaster position="top-right" />
    <div className="min-h-screen bg-slate-50 flex">
        

      {/* Left Section */}
      <div className="hidden lg:flex w-1/2 bg-emerald-600 text-white items-center justify-center p-12">

        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Leaf size={80} />

          <h1 className="text-5xl font-bold mt-6">
            AgriSmart
          </h1>

          <p className="mt-6 text-xl leading-9 text-emerald-100">
            Smart farming starts with smart decisions.
            Manage crops, monitor farms and leverage AI
            to improve productivity.
          </p>
        </motion.div>

      </div>

      {/* Right Section */}

      <div className="flex-1 flex items-center justify-center px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .6 }}
          className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-10"
        >

          <h2 className="text-3xl font-bold text-slate-800">
            Welcome Back 👋
          </h2>

          <p className="text-slate-500 mt-2">
            Login to continue.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 space-y-5"
          >

            {/* Email */}

            <div>

              <label className="font-medium">
                Email
              </label>

              <div className="flex items-center border rounded-xl mt-2 px-4">

                <Mail className="text-gray-400" size={18} />

                <input
                  type="email"
                  placeholder="Enter email"
                  className="w-full p-3 outline-none"

                  {...register("email", {
                    required: "Email is required",
                  })}
                />

              </div>

              <p className="text-red-500 text-sm mt-1">
                {errors.email?.message}
              </p>

            </div>

            {/* Password */}

            <div>

              <label className="font-medium">
                Password
              </label>

              <div className="flex items-center border rounded-xl mt-2 px-4">

                <Lock className="text-gray-400" size={18} />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className="w-full p-3 outline-none"

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

              <p className="text-red-500 text-sm mt-1">
                {errors.password?.message}
              </p>

            </div>

            <button
              className="w-full bg-emerald-600 hover:bg-emerald-700 transition text-white py-3 rounded-xl font-semibold"
            >
              Login
            </button>

          </form>

          <p className="text-center mt-8">

            Don't have an account?

            <Link
              to="/register"
              className="text-emerald-600 font-semibold ml-2"
            >
              Register
            </Link>

          </p>

        </motion.div>

      </div>

    </div>
    </>
  );
};

export default Login;