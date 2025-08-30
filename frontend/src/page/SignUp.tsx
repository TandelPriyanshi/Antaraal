import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

const schema = yup.object().shape({
  username: yup.string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters"),
  email: yup.string()
    .email("Invalid email")
    .required("Email is required"),
  password: yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: yup.string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

type FormData = yup.InferType<typeof schema>;

const SignUp: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      await register(data.username, data.email, data.password, "/signin");
      toast.success("Account created successfully! Please sign in.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      {/* Animate container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-[850px] bg-[#fff] rounded-2xl shadow-lg overflow-hidden"
      >
        {/* Top Navbar */}
        <div className="flex justify-between items-center px-6 py-4 bg-[#5A3A32] text-white rounded-t-2xl">
          <h1 className="text-2xl font-semibold">SignUp</h1>
          <div className="flex items-center gap-4">
            <span className="text-[#f5e1d7]">Already have an account?</span>
            <Link
              to="/signin"
              className="bg-[#2B2624] text-white px-5 py-2 rounded-md hover:bg-[#3a3330] transition"
            >
              Sign In 
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex justify-between items-center px-10 py-12">
          {/* Left Form with Slide-in Animation */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-1/2"
          >
            <h2 className="text-2xl font-semibold mb-6 text-[#2B2624]">Create Your Account</h2>

            {/* Username */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-[#2B2624] text-sm mb-2">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  {...formRegister("username")}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A3A32] ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Choose a username"
                  disabled={isLoading}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-[#2B2624] text-sm mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...formRegister("email")}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A3A32] ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-[#2B2624] text-sm mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  {...formRegister("password")}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A3A32] ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Create a password"
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-[#2B2624] text-sm mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  {...formRegister("confirmPassword")}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A3A32] ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#5A3A32] text-white py-2 px-4 rounded-md hover:bg-[#4a3029] transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          </motion.div>

          {/* Right Image with Slide-in Animation */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="w-1/2 flex justify-center"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/1995/1995574.png"
              alt="Books"
              className="w-75 h-auto"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
