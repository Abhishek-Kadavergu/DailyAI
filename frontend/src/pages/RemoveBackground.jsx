import { Upload, Eraser } from "lucide-react";
import React, { useState } from "react";

const RemoveBackground = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert("Please upload an image first!");

    // TODO: Replace with your background removal API
    // For now using a placeholder image
    const fakeProcessed =
      "https://res.cloudinary.com/drv22apr4/image/upload/v1745740347/otvy2mgk0bp6ng77izs5.jpg";
    setProcessedImage(fakeProcessed);
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
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
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-2 text-sm"
          required
        />
        <p className="text-xs text-gray-400 mt-1">
          Supports JPG, PNG, and other image formats
        </p>

        <button className="flex w-full justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-400 text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer">
          <Eraser className="w-4 h-4" />
          Remove Background
        </button>
      </form>

      {/* Right column - Processed image */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3">
          <Eraser className="w-5 h-5 text-[#FF7A29]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>

        <div className="flex-1 flex justify-center items-center">
          {processedImage ? (
            <img
              src={processedImage}
              alt="Processed"
              className="max-w-full max-h-80 rounded-md border"
            />
          ) : (
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Eraser className="w-9 h-9" />
              <p>
                Upload an image and click{" "}
                <span className="font-medium">"Remove Background"</span> to get
                started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RemoveBackground;
