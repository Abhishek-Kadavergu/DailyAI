import { Hash, Sparkle } from "lucide-react";
import React, { useState } from "react";

const categories = [
  "General",
  "Technology",
  "Business",
  "Health",
  "Lifestyle",
  "Education",
  "Travel",
  "Food",
];

const BlogTitles = () => {
  const [input, setInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("General");
  const [generatedTitles, setGeneratedTitles] = useState([]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // TODO: Replace with your API call
    const fakeTitles = [
      `Exploring ${input} in ${selectedCategory}`,
      `${input}: The Future of ${selectedCategory}`,
      `Why ${input} Matters in ${selectedCategory}`,
    ];
    setGeneratedTitles(fakeTitles);
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
          <h1 className="text-xl font-semibold">AI Title Generator</h1>
        </div>

        {/* Keyword input */}
        <p className="mt-6 text-sm font-medium">Keyword</p>
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="The future of artificial intelligence is..."
          required
        />

        {/* Category */}
        <p className="mt-4 text-sm font-medium">Category</p>
        <div className="mt-3 flex gap-2 flex-wrap">
          {categories.map((cat, index) => (
            <span
              key={index}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedCategory === cat
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-500 border-gray-300"
              }`}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Generate button */}
        <button className="flex w-full justify-center gap-2 bg-gradient-to-r from-[#226BFF] to-[#65ADFF] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer">
          <Hash className="mx-4" />
          Generate Title
        </button>
      </form>

      {/* Right column - Generated titles */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3">
          <Hash className="w-5 h-5 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Generated Titles</h1>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center text-gray-400">
          {generatedTitles.length === 0 ? (
            <div className="text-sm flex flex-col items-center gap-5">
              <Hash className="w-9 h-9" />
              <p>Enter a topic and click "Generate Title" to get started</p>
            </div>
          ) : (
            <ul className="mt-4 space-y-2 text-sm text-slate-700 w-full">
              {generatedTitles.map((title, i) => (
                <li
                  key={i}
                  className="p-2 border rounded-md bg-gray-50 hover:bg-gray-100"
                >
                  {title}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogTitles;
