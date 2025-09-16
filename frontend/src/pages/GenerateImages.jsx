import { Image as ImageIcon, Sparkle, Download, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

const styles = [
  "Realistic",
  "Ghibli style",
  "Anime style",
  "Cartoon style",
  "Fantasy style",
  "Realistic style",
  "3D style",
  "Portrait style",
];

const GenerateImages = () => {
  const [input, setInput] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("Realistic");
  const [isPublic, setIsPublic] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { getToken } = useAuth();

  // Debug useEffect
  useEffect(() => {
    if (generatedImage) {
      console.log("Image set successfully:", generatedImage);
    }
  }, [generatedImage]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const token = await getToken();
      const prompt = `${input}  ${selectedStyle.toLowerCase()} style, high quality, detailed`;

      const response = await axios.post(
        "http://localhost:4000/api/ai/generate-image",
        { prompt, publish: isPublic },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      console.log("API Response:", data);
      console.log(data.secure_url);
      setGeneratedImage(data.secure_url);

      // if (data.success && data.secure_url) {
      //   console.log("Setting image URL:", data.secure_url);
      //   console.log(
      //     "URL starts with http:",
      //     data.secure_url.startsWith("http")
      //   );
      //   console.log("URL length:", data.secure_url.length);

      //   // Test if the URL is accessible
      //   fetch(data.secure_url, { method: "HEAD" })
      //     .then((response) => {
      //       console.log("Image URL accessibility test:", response.status);
      //       if (response.ok) {
      //         console.log("✅ Image URL is accessible");
      //       } else {
      //         console.error("❌ Image URL returned status:", response.status);
      //       }
      //     })
      //     .catch((error) => {
      //       console.error("❌ Image URL test failed:", error);
      //     });

      //   setGeneratedImage(data.secure_url);
      // } else {
      //   console.error("API Error:", data.message);
      //   setError(data.message || "Failed to generate image");
      //   // Fallback to demo image
      //   const fallbackImage =
      //     "https://res.cloudinary.com/drv22apr4/image/upload/v1757834002/naiylfjabqrmqy0ikzkq.png";
      //   setGeneratedImage(fallbackImage);
      // }
    } catch (error) {
      console.error("Image generation error:", error);
      setError(error.message || "Network error. Using fallback image.");
      // Fallback to demo image
      const fallbackImage =
        "https://res.cloudinary.com/drv22apr4/image/upload/v1757847113/ai-images/ymmvdzuxewddczhnqwnu.png";
      setGeneratedImage(fallbackImage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle download
  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = "generated-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
      {/* Left column - Form */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkle className="w-6 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">AI Image Generator</h1>
        </div>

        {/* Input field */}
        <p className="mt-6 text-sm font-medium">Describe Your Image</p>
        <textarea
          onChange={(e) => setInput(e.target.value)}
          value={input}
          rows={3}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 resize-none transition-all duration-300 focus:border-green-400 focus:ring-2 focus:ring-green-100 focus:shadow-md"
          placeholder="Describe what you want to see in the image.."
          required
        />

        {/* Style selection */}
        <p className="mt-4 text-sm font-medium">Style</p>
        <div className="mt-3 flex gap-2 flex-wrap">
          {styles.map((style, index) => (
            <span
              key={index}
              onClick={() => setSelectedStyle(style)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                selectedStyle === style
                  ? "bg-green-50 text-green-700 border-green-400 shadow-md scale-105"
                  : "text-gray-500 border-gray-300 hover:border-green-300 hover:text-green-600"
              }`}
            >
              {style}
            </span>
          ))}
        </div>

        {/* Toggle public */}
        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={() => setIsPublic(!isPublic)}
            className="cursor-pointer w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2 transition-all duration-300"
          />
          <p className="text-sm text-gray-600">Make this image Public</p>
        </div>

        {/* Generate button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`flex w-full justify-center gap-2 bg-gradient-to-r from-green-500 to-green-400 text-white px-4 py-2 mt-6 text-sm rounded-lg transition-all duration-300 ${
            isLoading
              ? "opacity-50 cursor-not-allowed transform scale-95"
              : "cursor-pointer hover:from-green-600 hover:to-green-500 hover:scale-105 hover:shadow-lg active:scale-95"
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <ImageIcon className="w-4 h-4" />
              Generate Image
            </>
          )}
        </button>
      </form>

      {/* Right column - Generated image */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3">
          <ImageIcon className="w-5 h-5 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Generated Image</h1>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center">
          {isLoading ? (
            <div className="text-sm flex flex-col items-center gap-5">
              <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-[#4A7AFF]"></div>
              <p>Generating creative images...</p>
            </div>
          ) : generatedImage ? (
            <div className="flex flex-col items-center gap-4 mt-4 animate-fadeIn">
              <img
                src={generatedImage}
                alt="Generated"
                className="max-w-full max-h-120 rounded-md border shadow-lg object-contain"
              />
            </div>
          ) : (
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <div className="relative">
                <ImageIcon className="w-9 h-9 animate-pulse" />
                {/* <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full "></div> */}
              </div>
              <p className="text-center">
                Enter a description and click "Generate Image" to create amazing
                artwork
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateImages;
