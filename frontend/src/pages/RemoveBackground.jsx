import { Upload, Eraser, Loader2, Download, X } from "lucide-react";
import React, { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const RemoveBackground = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const { getToken } = useAuth();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
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
    if (!selectedFile) {
      setError("Please upload an image first!");
      return;
    }

    setIsLoading(true);
    setError(null);
    setProcessedImage(null);

    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await axios.post(
        `${BASE_URL}/api/ai/remove-image-background`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      console.log("Background removal response:", data);

      if (data.success && data.content) {
        setProcessedImage(data.content);
      } else {
        setError(data.message || "Failed to remove background");
        // Fallback to demo image
        const fallbackImage =
          "https://res.cloudinary.com/drv22apr4/image/upload/v1745740347/otvy2mgk0bp6ng77izs5.jpg";
        setProcessedImage(fallbackImage);
      }
    } catch (error) {
      console.error("Background removal error:", error);
      setError(error.message || "Network error. Using fallback image.");
      // Fallback to demo image
      const fallbackImage =
        "https://res.cloudinary.com/drv22apr4/image/upload/v1757847113/ai-images/ymmvdzuxewddczhnqwnu.png";
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
    link.download = "background-removed.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Clear file
  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setProcessedImage(null);
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
      {/* Left column - Upload */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Eraser className="w-6 text-[#FF7A29]" />
          <h1 className="text-xl font-semibold">Background Removal</h1>
        </div>

        <p className="mt-6 text-sm font-medium">Upload Image</p>

        {/* File upload area */}
        <div className="mt-2 relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-400 transition-colors duration-300"
            required
          />
          {selectedFile && (
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
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Preview:</p>
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full max-h-32 object-cover rounded-md border"
            />
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">⚠️ {error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !selectedFile}
          className={`flex w-full justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-400 text-white px-4 py-2 mt-6 text-sm rounded-lg transition-all duration-300 ${
            isLoading || !selectedFile
              ? "opacity-50 cursor-not-allowed transform scale-95"
              : "cursor-pointer hover:from-orange-600 hover:to-red-500 hover:scale-105 hover:shadow-lg active:scale-95"
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Eraser className="w-4 h-4" />
              Remove Background
            </>
          )}
        </button>
      </form>

      {/* Right column - Processed image */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3">
          <Eraser className="w-5 h-5 text-[#FF7A29]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center text-gray-400">
          {isLoading ? (
            <div className="text-sm flex flex-col items-center gap-5">
              <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-[#4A7AFF]"></div>
              <p>Removing background...</p>
            </div>
          ) : processedImage ? (
            <div className="flex flex-col items-center gap-4 mt-4 animate-fadeIn">
              <img
                src={processedImage}
                alt="Generated"
                className="max-w-full max-h-120 rounded-md  shadow-lg object-contain"
              />
            </div>
          ) : (
            <div className="text-sm flex flex-col items-center gap-5">
              <div className="relative">
                <Eraser className="w-9 h-9 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-ping"></div>
              </div>
              <p className="text-center">
                Upload an image and click{" "}
                <span className="font-medium text-orange-600">
                  "Remove Background"
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

export default RemoveBackground;
