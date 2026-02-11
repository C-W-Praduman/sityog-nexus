import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFileUpload, FaArrowLeft, FaRocket } from "react-icons/fa";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL from "../config/api";

function UploadPage() {
  const [title, setTitle] = useState("");
  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");
  const [documentType, setDocumentType] = useState("Notes");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingServer, setProcessingServer] = useState(false);
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e) => {
    setFile((prev)=>{
      const selectedFile = e.target.files[0];
      if (selectedFile) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
        return selectedFile;
      }
    });

  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!branch || !semester) {
      toast.error("Please select branch and semester");
      return;
    }

    if (branch === "Common" && semester !== "1") {
      toast.error("Common branch notes should be Semester 1 only");
      return;
    }

    if (!file) {
      toast.error("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("semester", semester);
    formData.append("branch", branch);
    formData.append("documentType", documentType);
    formData.append("uploaderName", user.name);
    formData.append("file", file);

    setUploading(true);
    setProgress(0);

    const xhr = new XMLHttpRequest();

    // Track upload progress
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const percentComplete = (e.loaded / e.total) * 100;
        setProgress(Math.round(percentComplete));
        
        // When file finishes uploading, show server processing message
        if (Math.round(percentComplete) === 100) {
          setProcessingServer(true);
        }
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status === 201 || xhr.status === 200) {
        setProgress(100);
        setProcessingServer(false);

        toast.success("File uploaded successfully!", {
          duration: 2000,
          style: {
            background: "#1a202c",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
          },
        });

        setTimeout(() => {
          setUploading(false);
          setProgress(0);
          navigate(`/download?branch=${branch}&semester=${semester}`);
        }, 300);
      } else {
        toast.error("Upload failed. Please try again.");
        setUploading(false);
        setProgress(0);
        setProcessingServer(false);
      }
    });

    xhr.addEventListener("error", () => {
      toast.error("Error uploading file");
      setUploading(false);
      setProgress(0);
      setProcessingServer(false);
    });

    xhr.open("POST", `${API_BASE_URL}/api/upload`, true);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.send(formData);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 bg-[#0a0f1d] overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-150 h-150 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-125 h-125 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-xl w-full relative z-10 animate-fade-in-up">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-blue-400 hover:text-blue-300 font-bold transition-all group"
          >
            <FaArrowLeft className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
            Return to Nexus
          </Link>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-white/10">
          <div className="bg-linear-to-r from-blue-600/20 to-purple-600/20 px-6 sm:px-8 py-8 sm:py-10 border-b border-white/5 text-center">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] sm:text-xs font-bold tracking-widest border border-blue-500/20 uppercase mb-3 sm:mb-4">
              <FaRocket className="mr-2" /> Contribute Upload
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Upload New Note
            </h2>
            <p className="text-sm sm:text-base text-gray-400 mt-2 font-medium">
              Empower the SITYOG galaxy with your knowledge
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-12 space-y-6 sm:space-y-8"
          >
            <div className="grid grid-cols-1 gap-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-blue-400 uppercase tracking-widest mb-3 ml-1">
                    Select Branch
                  </label>
                  <div className="relative">
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                    >
                      <option
                        value=""
                        disabled
                        className="bg-[#0a0f1d] text-gray-400"
                      >
                        Select Branch
                      </option>

                      {[
                        "Common",
                        "CSE",
                        "Electrical",
                        "Electronics",
                        "Civil",
                        "Mechanical",
                      ].map((b) => (
                        <option
                          key={b}
                          value={b}
                          className="bg-[#0a0f1d] text-white"
                        >
                          {b}
                        </option>
                      ))}
                    </select>

                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <label className="block text-xs font-bold text-blue-400 uppercase tracking-widest mb-3 ml-1">
                    Select Semester
                  </label>
                  <div className="relative">
                    <select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                    >
                      <option
                        value=""
                        disabled
                        className="bg-[#0a0f1d] text-gray-400"
                      >
                        Select Semester
                      </option>

                      {["1", "2", "3", "4", "5", "6"].map((num) => (
                        <option
                          key={num}
                          value={num}
                          className="bg-[#0a0f1d] text-white"
                        >
                          Semester {num}
                        </option>
                      ))}
                    </select>

                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-400 uppercase tracking-widest mb-3 ml-1">
                  Document Type
                </label>
                <div className="relative">
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer appearance-none"
                  >
                    {["Notes", "PYQ", "Other Materials"].map((type) => (
                      <option
                        key={type}
                        value={type}
                        className="bg-[#0a0f1d] text-white"
                      >
                        {type}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-400 uppercase tracking-widest mb-3 ml-1">
                  Note Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Quantum Mechanics Module 1"
                  required
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-600"
                />
              </div>

              <div className="bg-blue-600/5 border border-blue-500/10 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                    Uploader
                  </p>
                  <p className="text-white font-bold">{user?.name}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-400 uppercase tracking-widest mb-3 ml-1">
                  Upload Attachment
                </label>
                <div
                  onClick={() => fileInputRef.current.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative group bg-white/5 border-2 border-dashed rounded-3xl sm:rounded-4xl p-6 sm:p-10 transition-all cursor-pointer text-center ${
                    isDragging
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-white/10 hover:border-blue-500/50 hover:bg-white/10"
                  }`}
                >
                  <div className="space-y-3 sm:space-y-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-500 mx-auto group-hover:scale-110 transition-transform">
                      <FaFileUpload className="text-2xl sm:text-3xl" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-white font-bold text-base sm:text-lg">
                        {file
                          ? file.name
                          : "Click to select or drag upload here"}
                      </p>
                      <p className="text-gray-500 text-[10px] sm:text-sm">
                        Only PDF files up to 10MB
                      </p>
                      <p className="text-gray-400 text-xs sm:hidden mt-2">
                        💡 Tap the area above to select a file
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-4 sm:py-5 px-8 bg-blue-600 text-white font-black rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_50px_rgba(37,99,235,0.5)] hover:bg-blue-500 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-3 active:scale-[0.98] ${uploading ? "opacity-70 cursor-not-allowed" : ""}`}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {processingServer ? (
                    <>FINALIZING... {progress}%</>
                  ) : (
                    <>UPLOADING YOUR NOTES... {progress}%</>
                  )}
                </>
              ) : (
                <>
                  <FaRocket className="text-xl" /> TRANSMIT UPLOAD
                </>
              )}
            </button>

            {uploading && (
              <div className="space-y-3">
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/20">
                  <div
                    className="h-full bg-linear-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-300 ease-out shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <p className="text-gray-400 font-medium">
                    {processingServer ? "Finalizing..." : "Uploading your notes..."}
                  </p>
                  <p className="text-blue-400 font-bold text-lg">{progress}%</p>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
      `,
        }}
      />
    </div>
  );
}

export default UploadPage;
