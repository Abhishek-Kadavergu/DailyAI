import { useAuth } from "@clerk/clerk-react";
import { Hash, Sparkle } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000";

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
  const [isLoading, setIsLoading] = useState(false);

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneratedTitles([]);

    try {
      const token = await getToken();
      const prompt = `Generate 5 creative and engaging blog post titles about "${input}" in the ${selectedCategory} category. Each title should be unique, compelling, and optimized for SEO. Return only the titles, one per line, without numbering or bullet points.`;

      const response = await axios.post(
        `${BASE_URL}/api/ai/generate-blog-titles`,
        { prompt },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      console.log("backend res:", data);

      if (data.success) {
        // Split the response content by newlines and filter out empty strings
        const titles = data.content
          .split("\n")
          .map((title) => title.trim())
          .filter((title) => title.length > 0);
        setGeneratedTitles(titles);
      } else {
        console.error("API Error:", data.message);
        // Fallback to fake titles if API fails
        const fallbackTitles = [
          `Exploring ${input} in ${selectedCategory}`,
          `${input}: The Future of ${selectedCategory}`,
          `Why ${input} Matters in ${selectedCategory}`,
        ];
        setGeneratedTitles(fallbackTitles);
      }
    } catch (error) {
      console.error("Network Error:", error);
      // Fallback to fake titles if network fails
      const fallbackTitles = [
        `Exploring ${input} in ${selectedCategory}`,
        `${input}: The Future of ${selectedCategory}`,
        `Why ${input} Matters in ${selectedCategory}`,
      ];
      setGeneratedTitles(fallbackTitles);
    } finally {
      setIsLoading(false);
    }
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
        <button
          type="submit"
          disabled={isLoading}
          className={`flex w-full justify-center gap-2 bg-gradient-to-r from-[#226BFF] to-[#65ADFF] text-white px-4 py-2 mt-6 text-sm rounded-lg ${
            isLoading
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:from-[#1a5bff] hover:to-[#4a9dff]"
          }`}
        >
          <Hash className="mx-4" />
          {isLoading ? "Generating..." : "Generate Title"}
        </button>
      </form>

      {/* Right column - Generated titles */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3">
          <Hash className="w-5 h-5 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Generated Titles</h1>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center text-gray-400">
          {isLoading ? (
            <div className="text-sm flex flex-col items-center gap-5">
              <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-[#4A7AFF]"></div>
              <p>Generating creative titles...</p>
            </div>
          ) : generatedTitles.length === 0 ? (
            <div className="text-sm flex flex-col items-center gap-5">
              <Hash className="w-9 h-9" />
              <p>Enter a topic and click "Generate Title" to get started</p>
            </div>
          ) : (
            <ul className="mt-4 space-y-2 text-sm text-slate-700 w-full">
              {generatedTitles.map((title, i) => (
                <li
                  key={i}
                  className="p-2 border rounded-md bg-gray-50 hover:bg-gray-100 transition-colors"
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
