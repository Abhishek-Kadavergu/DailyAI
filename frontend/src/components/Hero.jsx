import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className="px-4 sm:px-20 xl:px-32 relative inline-flex flex-col w-full justify-center bg-[url(/gradientBackground.png)] bg-cover bg-no-repeat min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-semibold mx-auto leading-[1.2]">
          Create amazing content <br /> with
          <span className="text-primary"> AI tools</span>
        </h1>
        <p className="mt-4 max-w-xs sm:max-w-lg 2xl:max-w-xl mx-auto max-sm:text-xs text-gray-600">
          Transform your content creation with our suite of premium AI tools.
          Write articles, generate images, and enhance your workflow.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
        <button
          onClick={() => navigate("/ai")}
          className="px-6 py-3 rounded-full bg-primary text-white hover:scale-[1.02] active:scale-95 transition-transform"
        >
          Start creating now
        </button>
        <button className="px-6 py-3 rounded-full border border-gray-300 hover:scale-[1.02] active:scale-95 transition-transform">
          Watch demo
        </button>
      </div>
      <div className="flex items-center justify-center gap-2 mt-6">
        <img src={assets.user_group} alt="" className="h-6" />
        Trusted by 10k+ users
      </div>
    </div>
  );
};

export default Hero;
