import { Image as ImageIcon, Sparkle, Download } from "lucide-react";
import React, { useState } from "react";

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

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // TODO: Replace with your API call
    const fakeImage =
      "https://res.cloudinary.com/drv22apr4/image/upload/v1745740847/woru0i5zk6utm2yscwcu.jpg";
    setGeneratedImage(fakeImage);
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
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 resize-none"
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
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedStyle === style
                  ? "bg-green-50 text-green-700 border-green-400"
                  : "text-gray-500 border-gray-300"
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
            className="cursor-pointer"
          />
          <p className="text-sm text-gray-600">Make this image Public</p>
        </div>

        {/* Generate button */}
        <button className="flex w-full justify-center gap-2 bg-gradient-to-r from-green-500 to-green-400 text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer">
          <ImageIcon className="mx-4" />
          Generate Image
        </button>
      </form>

      {/* Right column - Generated image */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3">
          <ImageIcon className="w-5 h-5 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Generated Image</h1>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center">
          {generatedImage ? (
            <div className="flex flex-col items-center gap-4">
              <img
                src={generatedImage}
                alt="Generated"
                className="max-w-full max-h-80 rounded-md border"
              />
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg shadow cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download Image
              </button>
            </div>
          ) : (
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <ImageIcon className="w-9 h-9" />
              <p>Enter a topic and click "Generate Image" to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateImages;
