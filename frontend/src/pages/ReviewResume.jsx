import { FileText, Sparkle } from "lucide-react";
import React, { useState } from "react";

const ReviewResume = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const onFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!resumeFile) {
      alert("Please upload your resume (PDF only).");
      return;
    }

    console.log("Uploaded Resume:", resumeFile);

    // Placeholder: Call your API here
    // Example:
    // const formData = new FormData();
    // formData.append("resume", resumeFile);
    // const res = await fetch("/api/review-resume", { method: "POST", body: formData });
    // const data = await res.json();
    // setAnalysisResult(data);

    // Mock response
    setAnalysisResult(
      "Your resume is strong! Add more details about projects."
    );
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
          Review Resume
        </button>
      </form>

      {/* Right Side */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Analysis Results</h1>
        </div>

        <div className="flex-1 flex justify-center items-center">
          {analysisResult ? (
            <div className="text-sm text-gray-700 whitespace-pre-wrap">
              {analysisResult}
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
