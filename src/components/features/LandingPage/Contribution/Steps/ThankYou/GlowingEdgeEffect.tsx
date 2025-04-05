import React, { useState } from "react";

const GlowingEdgeEffect: React.FC = () => {
  const [showGlow, setShowGlow] = useState(false);

  const handleSuccess = () => {
    setShowGlow(true);
    setTimeout(() => setShowGlow(false), 2000); // Glow effect lasts for 2 seconds
  };

  return (
    <div className="relative w-screen h-screen flex justify-center items-center bg-gray-900">
      {/* Glowing edge */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-500 ${
          showGlow
            ? "border-[10px] border-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 animate-pulse"
            : "border-[10px] border-transparent"
        }`}
        style={{
          boxShadow: showGlow
            ? "0 0 20px 5px rgba(128,0,128,0.7), 0 0 50px 10px rgba(0,0,255,0.5), 0 0 100px 20px rgba(255,20,147,0.5)"
            : "",
        }}
      />

      {/* Main content */}
      <div className="z-10 text-center">
        <h1 className="text-4xl text-white font-bold mb-4">
          Success Effect Demo
        </h1>
        <button
          onClick={handleSuccess}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Trigger Success
        </button>
      </div>
    </div>
  );
};

export default GlowingEdgeEffect;
