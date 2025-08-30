import React from "react";
import { motion } from "framer-motion";
import { FaLock, FaHeart, FaCloud } from "react-icons/fa";

const benefits = [
  {
    icon: <FaLock className="text-[#8b4a3c] text-2xl" />,
    title: "Privacy First",
    description:
      "Your memories are encrypted and stored securely. Only you decide who sees them.",
  },
  {
    icon: <FaHeart className="text-[#8b4a3c] text-2xl" />,
    title: "Emotional Wellness",
    description:
      "Reflect on your emotions and track your growth over time with AI insights.",
  },
  {
    icon: <FaCloud className="text-[#8b4a3c] text-2xl" />,
    title: "Seamless Backup",
    description:
      "Never lose a memory—your journal is safely backed up across all devices.",
  },
];

const BenefitsSection: React.FC = () => {
  return (
    <section
      id="benefits"
      className="relative min-h-screen flex flex-col justify-center py-20 px-6 bg-white text-center"
    >
      {/* Heading animation */}
      <motion.h2
        initial={{ y: -30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false }}
        className="text-3xl md:text-4xl font-bold text-[#4b2e2e] mb-4"
      >
        Why Choose Antaraal
      </motion.h2>

      {/* Subtitle animation */}
      <motion.p
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: false }}
        className="text-gray-600 max-w-2xl mx-auto mb-12"
      >
        Designed with care, Antaraal ensures your journaling journey is private,
        meaningful, and seamless.
      </motion.p>

      {/* Benefits with stagger animation */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: false }}
            className="p-6 bg-white rounded-lg shadow transition border border-gray-100 hover:shadow-md"
          >
            <div className="flex justify-center items-center w-12 h-12 mx-auto mb-4 rounded-md bg-[#f2e7e4]">
              {benefit.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {benefit.title}
            </h3>
            <p className="text-gray-600 text-sm">{benefit.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default BenefitsSection;
