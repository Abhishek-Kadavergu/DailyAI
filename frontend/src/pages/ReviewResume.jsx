import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { FileText, Sparkle } from "lucide-react";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const { getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
      ];

      if (allowedTypes.includes(file.type)) {
        setResumeFile(file);
      } else {
      }
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!resumeFile) {
      alert("Please upload your resume (PDF only).");
      return;
    }
    setIsLoading(true);
    setAnalysisResult(null);
    try {
      console.log("process started");
      const token = await getToken();
      const formData = new FormData();
      formData.append("resume", resumeFile);

      console.log(resumeFile);
      const response = await axios.post(
        `${BASE_URL}/api/ai/review-resume`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      console.log("response from the backend", data);
      if (data.success && data.content) {
        setAnalysisResult(data.content);
        setIsLoading(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to generate article. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Left Side */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkle className="w-6 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Resume Review</h1>
        </div>

        {/* Upload Resume */}
        <p className="mt-6 text-sm font-medium">Upload Resume</p>
        <input
          type="file"
          accept=".pdf"
          onChange={onFileChange}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          required
        />

        {/* Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`flex w-full justify-center gap-2 bg-gradient-to-r from-[#226BFF] to-[#65ADFF] text-white px-4 py-2 mt-6 text-sm rounded-lg ${
            isLoading
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:from-[#1a5bff] hover:to-[#4a9dff]"
          }`}
        >
          <FileText className="mx-4" />
          {isLoading ? "Analyzing..." : "Review Resume"}
        </button>
      </form>

      {/* Right Side */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 h-[600px]">
        <div className="flex items-center gap-3 mb-3">
          <FileText className="w-5 h-5 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Analysis Results</h1>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="h-full flex flex-col justify-center items-center text-gray-400">
              <div className="text-sm flex flex-col items-center gap-5">
                <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-[#4A7AFF]"></div>
                <p>Analyzing your resume...</p>
              </div>
            </div>
          ) : analysisResult ? (
            <div className="h-full overflow-y-auto text-sm text-slate-600 whitespace-pre-wrap break-words pr-2">
              <div className=".reset-tw">
                <ReactMarkdown>{analysisResult}</ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col justify-center items-center text-gray-400">
              <div className="text-sm flex flex-col items-center gap-5">
                <FileText className="w-9 h-9" />
                <p>Upload a resume and click "Review Resume" to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewResume;
