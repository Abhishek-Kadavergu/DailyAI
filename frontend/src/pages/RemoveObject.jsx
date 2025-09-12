import { Scissors } from "lucide-react";
import React, { useState } from "react";

const RemoveObject = () => {
  const [image, setImage] = useState(null);
  const [objectName, setObjectName] = useState("");
  const [processedImage, setProcessedImage] = useState(null);

  const onImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!image || !objectName) {
      alert("Please upload an image and enter object name to remove!");
      return;
    }

    // Placeholder for API call
    console.log("Image:", image);
    console.log("Remove Object:", objectName);

    // After API response -> set processed image
    // setProcessedImage("processed-image-url");
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
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
        <input
          type="file"
          accept="image/*"
          onChange={onImageChange}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          required
        />

        {/* Object name */}
        <p className="mt-4 text-sm font-medium">
          Describe object name to remove
        </p>
        <input
          type="text"
          placeholder="e.g., watch or spoon"
          value={objectName}
          onChange={(e) => setObjectName(e.target.value)}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          required
        />

        {/* Button */}
        <button
          type="submit"
          className="flex w-full justify-center gap-2 bg-gradient-to-r from-[#226BFF] to-[#65ADFF] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer"
        >
          <Scissors className="mx-4" />
          Remove Object
        </button>
      </form>

      {/* Right Side */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3">
          <Scissors className="w-5 h-5 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>

        <div className="flex-1 flex justify-center items-center">
          {processedImage ? (
            <img
              src={processedImage}
              alt="Processed"
              className="max-h-full max-w-full object-contain rounded-md"
            />
          ) : (
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Scissors className="w-9 h-9" />
              <p>Upload an image and click "Remove Object" to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RemoveObject;
