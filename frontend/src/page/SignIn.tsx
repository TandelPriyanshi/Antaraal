import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

type FormData = yup.InferType<typeof schema>;

const SignIn: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      await login(data.email, data.password, "/");
      toast.success("Logged in successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-background"> 
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-[850px] bg-[#fff] rounded-2xl shadow-lg overflow-hidden"
      >
        {/* Top Navbar */}
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-between items-center px-6 py-4 bg-[#5A3A32] text-white rounded-t-2xl"
        >
          <h1 className="text-2xl font-semibold"></h1>
          <div className="flex items-center gap-4">
            <span className="text-[#f5e1d7]">Don’t have an account?</span>
            <Link
              to="/signup"
              className="bg-[#2B2624] text-white px-5 py-2 rounded-md hover:bg-[#3a3330]"
            >
              Sign Up
            </Link>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex justify-between items-center px-10 py-12">
          {/* Left Form */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="w-1/2"
          >
            <h2 className="text-2xl font-semibold mb-6 text-[#2B2624]">Sign In</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-[#2B2624] text-sm mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A3A32] ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-[#2B2624] text-sm mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  {...register("password")}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A3A32] ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                )}
                <div className="mt-2 text-right">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-[#5A3A32] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#5A3A32] text-white py-2 px-4 rounded-md hover:bg-[#4a3029] transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Forgot Password */}
            <p className="mt-2 text-sm text-[#2B2624] text-center">
              <Link to="/forgot-password" className="hover:underline">
                Forgot Password?
              </Link>
            </p>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-1/2 flex justify-center"
          >
            <motion.img
              src="https://cdn-icons-png.flaticon.com/512/1995/1995574.png"
              alt="Books"
              className="w-70 h-auto"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;
