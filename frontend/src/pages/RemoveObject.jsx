import { Scissors, Loader2, Download, X, Upload } from "lucide-react";
import React, { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {
  const [image, setImage] = useState(null);
  const [objectName, setObjectName] = useState("");
  const [processedImage, setProcessedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const { getToken } = useAuth();

  const onImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setError(null);
    setProcessedImage(null);

    // Create preview URL
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!image || !objectName) {
      setError("Please upload an image and enter object name to remove!");
      return;
    }

    setIsLoading(true);
    setError(null);
    setProcessedImage(null);

    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("image", image);
      formData.append("object", objectName);

      const response = await axios.post(
        `${BASE_URL}/api/ai/remove-image-object`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      console.log("Object removal response:", data);

      if (data.success && data.content) {
        setProcessedImage(data.content);
      } else {
        setError(data.message || "Failed to remove object");
        // Fallback to demo image
        const fallbackImage =
          "https://res.cloudinary.com/drv22apr4/image/upload/v1745740347/otvy2mgk0bp6ng77izs5.jpg";
        setProcessedImage(fallbackImage);
      }
    } catch (error) {
      console.error("Object removal error:", error);
      setError(error.message || "Network error. Using fallback image.");
      // Fallback to demo image
      const fallbackImage =
        "https://res.cloudinary.com/drv22apr4/image/upload/v1745740347/otvy2mgk0bp6ng77izs5.jpg";
      setProcessedImage(fallbackImage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle download
  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement("a");
    link.href = processedImage;
    link.download = "object-removed.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Clear file
  const clearFile = () => {
    setImage(null);
    setPreviewUrl(null);
    setProcessedImage(null);
    setObjectName("");
    setError(null);
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
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
      {/* Left Side */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Scissors className="w-6 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Object Removal</h1>
        </div>

        {/* Upload */}
        <p className="mt-6 text-sm font-medium">Upload Image</p>

        {/* File upload area */}
        <div className="mt-2 relative">
          <input
            type="file"
            accept="image/*"
            onChange={onImageChange}
            className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors duration-300"
            required
          />
          {image && (
            <button
              type="button"
              onClick={clearFile}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <p className="text-xs text-gray-400 mt-1">
          Supports JPG, PNG, and other image formats (Max 10MB)
        </p>

        {/* File preview */}
        {previewUrl && (
          <div className="mt-4 ">
            <p className="text-sm font-medium mb-2">Preview:</p>
            <img
              src={previewUrl}
              alt="Preview"
              className="w-[auto] h-[200px] object-cover rounded-md border mx-auto"
            />
          </div>
        )}

        {/* Object name */}
        <p className="mt-4 text-sm font-medium">
          Describe object name to remove
        </p>
        <input
          type="text"
          placeholder="e.g., watch, spoon, car, person"
          value={objectName}
          onChange={(e) => setObjectName(e.target.value)}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 transition-all duration-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:shadow-md"
          required
        />

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">⚠️ {error}</p>
          </div>
        )}

        {/* Button */}
        <button
          type="submit"
          disabled={isLoading || !image || !objectName}
          className={`flex w-full justify-center gap-2 bg-gradient-to-r from-[#226BFF] to-[#65ADFF] text-white px-4 py-2 mt-6 text-sm rounded-lg transition-all duration-300 ${
            isLoading || !image || !objectName
              ? "opacity-50 cursor-not-allowed transform scale-95"
              : "cursor-pointer hover:from-[#1a5bff] hover:to-[#4a9dff] hover:scale-105 hover:shadow-lg active:scale-95"
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Scissors className="w-4 h-4" />
              Remove Object
            </>
          )}
        </button>
      </form>

      {/* Right Side */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3">
          <Scissors className="w-5 h-5 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center text-gray-400">
          {isLoading ? (
            <div className="text-sm flex flex-col items-center gap-5">
              <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-[#4A7AFF]"></div>
              <p>Removing object...</p>
            </div>
          ) : processedImage ? (
            <div className="flex flex-col items-center gap-4 mt-4 animate-fadeIn">
              <img
                src={processedImage}
                alt="Generated"
                className="max-w-full max-h-120 rounded-md border shadow-lg object-contain"
              />
            </div>
          ) : (
            <div className="text-sm flex flex-col items-center gap-5">
              <div className="relative">
                <Scissors className="w-9 h-9 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
              </div>
              <p className="text-center">
                Upload an image and click{" "}
                <span className="font-medium text-blue-600">
                  "Remove Object"
                </span>{" "}
                to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RemoveObject;
