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
  const [currentStep, setCurrentStep] = useState("");
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      setError(null);
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
        setError(null);
      } else {
        setError("Please upload a PDF or DOCX file only.");
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
          className="flex w-full justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer"
        >
          <FileText className="mx-4" />
          {isLoading ? "Reviewing Resume..." : "Review Resume"}
        </button>
      </form>

      {/* Right Side */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Analysis Results</h1>
        </div>

        <div className="flex-1 mt-3 overflow-y-auto text-sm text-slate-600 whitespace-pre-wrap break-words">
          {analysisResult ? (
            <div className=".reset-tw">
              <ReactMarkdown>{analysisResult}</ReactMarkdown>
            </div>
          ) : (
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <FileText className="w-9 h-9" />
              <p>Upload a resume and click "Review Resume" to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewResume;
