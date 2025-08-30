import React from "react";
import {
  FaLeaf,
  FaClock,
  FaBookOpen,
  FaMobileAlt,
  FaImages,
  FaShareAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";

type Feature = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const FEATURES: Feature[] = [
  {
    icon: <FaLeaf className="text-[#8b4a3c] text-2xl" />,
    title: "Daily Journal Writing",
    description:
      "Write freely with AI-powered prompts and emotional insights to guide your thoughts.",
  },
  {
    icon: <FaClock className="text-[#8b4a3c] text-2xl" />,
    title: "Timeline Memory Explorer",
    description:
      "Navigate through your memories with an interactive timeline and powerful search.",
  },
  {
    icon: <FaBookOpen className="text-[#8b4a3c] text-2xl" />,
    title: "Life Story Generator",
    description:
      "Transform your entries into beautiful autobiographical narratives with AI.",
  },
  {
    icon: <FaMobileAlt className="text-[#8b4a3c] text-2xl" />,
    title: "Real-time Sync",
    description:
      "Access your journal seamlessly across all your devices, anywhere, anytime.",
  },
  {
    icon: <FaImages className="text-[#8b4a3c] text-2xl" />,
    title: "Media Support",
    description:
      "Embed photos, videos, and voice notes to create rich, multimedia memories.",
  },
  {
    icon: <FaShareAlt className="text-[#8b4a3c] text-2xl" />,
    title: "PDF Export & Sharing",
    description:
      "Export your stories as beautiful PDFs or share privately with loved ones.",
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section
      id="features"
      className="min-h-screen py-20 px-6 bg-white flex flex-col justify-center text-center"
    >
      {/* Title Animation */}
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: false }}
        className="text-3xl md:text-4xl font-bold text-[#4b2e2e] mb-4"
      >
        Powerful Features for Your Life Story
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        viewport={{ once: false }}
        className="text-gray-600 max-w-2xl mx-auto mb-12"
      >
        Everything you need to capture, enhance, and preserve your precious
        memories with the help of AI.
      </motion.p>

      {/* Feature Cards */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {FEATURES.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            viewport={{ once: false }}
            className="p-6 bg-white rounded-xl shadow border border-gray-100 hover:shadow-lg hover:scale-105 transform transition duration-300"
          >
            <div className="flex justify-center items-center w-14 h-14 mx-auto mb-4 rounded-full bg-[#f2e7e4]">
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
