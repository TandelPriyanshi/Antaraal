import React from "react";
import { FaPen, FaBrain, FaStar } from "react-icons/fa6";

const steps = [
  {
    id: 1,
    icon: <FaPen className="text-white text-2xl" />,
    title: "Write",
    description:
      "Add your journal entry with our intuitive AI-assisted writing interface.",
  },
  {
    id: 2,
    icon: <FaBrain className="text-white text-2xl" />,
    title: "AI Enhances",
    description:
      "Our AI detects emotions, tags topics, and provides intelligent insights.",
  },
  {
    id: 3,
    icon: <FaStar className="text-white text-2xl" />,
    title: "Relive & Share",
    description:
      "Search memories, generate life stories, and share your journey securely.",
  },
];

const HowItWorksSection: React.FC = () => {
  return (
    <section
      id="how-it-works"
      className="py-20 px-6 bg-gradient-to-b from-[#f8f6f4] to-[#f2f0ed] text-center min-h-screen justify-center flex flex-col"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-[#4b2e2e] mb-4">
        How Antaraal Works
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto mb-12">
        Transform your daily thoughts into meaningful memories with just three
        simple steps.
      </p>

      <div className="grid gap-12 md:grid-cols-3 max-w-6xl mx-auto">
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center text-center">
            <div className="relative">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#8b4a3c] shadow-md">
                {step.icon}
              </div>
              <span className="absolute -top-2 -right-2 bg-[#d4b8ad] text-[#4b2e2e] text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                {step.id}
              </span>
            </div>
            <h3 className="mt-6 text-xl font-semibold text-gray-800">
              {step.title}
            </h3>
            <p className="mt-2 text-gray-600 max-w-xs">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorksSection;
