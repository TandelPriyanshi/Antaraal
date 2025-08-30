import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Password reset link sent to ${email}`);
    navigate("/login"); // Redirect back to login after submit
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
            <span className="text-[#f5e1d7]">Remembered your password?</span>
            <Link
              to="/signin"
              className="bg-[#2B2624] text-white px-5 py-2 rounded-md hover:bg-[#3a3330]"
            >
              Log In
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
            <h2 className="text-2xl font-semibold mb-6 text-[#2B2624]">
              Forgot Password
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="mb-4">
                <label className="block text-[#2B2624] text-sm mb-2">
                  Enter your email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-[#5A3A32] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B2624]"
                  required
                />
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-[#5A3A32] text-white py-2 rounded-md hover:bg-[#2B2624]"
              >
                Send Reset Link
              </motion.button>
            </form>

            {/* Back to login link */}
            <p className="mt-2 text-sm text-[#2B2624] text-center">
              <Link to="/signin" className="hover:underline">
                Back to Signin
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
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJFelMv8FDbE_AaacOzgBM4V847xir7LKFGxmhcZ6r-wWJ31by2EoxZ1Y3sAqIUixwv1A&usqp=CAU"
              alt="Forgot Password"
              className="w-60 h-auto"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
