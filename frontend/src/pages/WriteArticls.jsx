import { Edit, Sparkle } from "lucide-react";
import React, { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000";

const articleLength = [
  { length: 800, text: "Short (500-800 words)" },
  { length: 1200, text: "Medium (800-1200 words)" },
  { length: 1600, text: "Long (1200-1600 words)" },
];

const WriteArticls = () => {
  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [input, setInput] = useState("");
  const [generatedArticle, setGeneratedArticle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    const prompt = `Write an article about ${input} in ${selectedLength.text} words. `;
    try {
      const token = await getToken();

      const { data } = await axios.post(
        `https://daily-ai-xi.vercel.app//api/ai/generate-article`,
        {
          prompt: prompt,
          length: selectedLength.length,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Backend response:", data);

      if (data.success) {
        toast.success("Article Generated Successfully");
        setGeneratedArticle(data.content);
      } else {
        alert(data.message || "Failed to generate article");
      }
    } catch (error) {
      console.error("Error generating article:", error);
      alert("Failed to generate article. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* left col */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkle className="w-6 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Article Configuration</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Article Topic</p>
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="The Importance of Healthy Eating is..."
          required
        />
        <p className="mt-4 text-sm font-medium">Article Length</p>
        <div className="mt-3 flex gap-3 flex-wrap sm:max-w-9/11">
          {articleLength.map((item, index) => (
            <span
              onClick={() => setSelectedLength(item)}
              key={index}
              className={`text-xs px-4  py-1 border rounded-full cursor-pointer ${
                selectedLength.text === item.text
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-500 border-gray-300"
              }`}
            >
              {item.text}
            </span>
          ))}
        </div>
        <br />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="flex w-full justify-center gap-2 bg-gradient-to-r from-[#226BFF] to-[#65ADFF] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Edit className="mx-4" />
          {isLoading ? "Generating..." : "Generate Article"}
        </button>
      </form>

      {/*Right side*/}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 h-[600px]">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <Edit className="w-5 h-5 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Generated Article</h1>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="h-full flex flex-col justify-center items-center text-gray-400">
              <div className="text-sm flex flex-col items-center gap-5">
                <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-[#4A7AFF]"></div>
                <p>Generating Article...</p>
              </div>
            </div>
          ) : generatedArticle ? (
            <div className="h-full overflow-y-auto text-sm text-slate-600 whitespace-pre-wrap break-words pr-2">
              <div className=".reset-tw">
                <ReactMarkdown>{generatedArticle}</ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col justify-center items-center text-gray-400">
              <div className="text-sm flex flex-col items-center gap-5">
                <Edit className="w-9 h-9" />
                <p>Enter a topic and click "Generate Article" to get started</p>
              </div>
            </div>
          )}

          {/* {generatedArticle ? (
            <div className=".reset-tw">
              <ReactMarkdown>{generatedArticle}</ReactMarkdown>
            </div> // wrap in a div for safety
          ) : (
            <div className="flex flex-col items-center gap-5 text-gray-400">
              <Edit className="w-9 h-9" />
              <p>Enter a topic and click "Generate Article" to get started</p>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default WriteArticls;
