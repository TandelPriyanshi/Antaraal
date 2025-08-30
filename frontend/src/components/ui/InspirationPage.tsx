import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const inspirations = [
  "The only way to do great work is to love what you do. — Steve Jobs",
  "Happiness is not something ready made. It comes from your own actions. — Dalai Lama",
  "Success usually comes to those who are too busy to be looking for it. — Henry David Thoreau",
  "Don’t watch the clock; do what it does. Keep going. — Sam Levenson",
  "Act as if what you do makes a difference. It does. — William James",
];

export default function InspirationPage() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Pick a random starting quote when the page loads
    const randomIndex = Math.floor(Math.random() * inspirations.length);
    setIndex(randomIndex);
  }, []);

  const handleNext = () => {
    // Move to next quote, loop back if at the end
    setIndex((prev) => (prev + 1) % inspirations.length);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f9f9f9] p-6">
      <h1 className="text-2xl font-bold text-[#5C4033] mb-4">🌟 Daily Inspiration</h1>

      <p className="text-lg italic text-[#333] max-w-xl text-center bg-white p-6 rounded-xl shadow transition-all duration-500">
        {inspirations[index]}
      </p>

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-[#5C4033] text-white rounded-lg shadow hover:bg-[#3E2B23]"
        >
          ← Back
        </button>

        <button
          onClick={handleNext}
          className="px-4 py-2 bg-[#5C4033] text-white rounded-lg shadow hover:bg-[#3E2B23]"
        >
          Next Tip →
        </button>
      </div>
    </div>
  );
}
