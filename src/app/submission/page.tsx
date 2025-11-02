"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function SubmissionPage() {
  const [formData, setFormData] = useState({
    teamName: "",
    githubLink: "",
    googleDriveLink: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch("/api/submission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessageType("success");
        setMessage(data.message || "Submission successful! ✅");
        setFormData({
          teamName: "",
          githubLink: "",
          googleDriveLink: "",
        });
      } else {
        setMessageType("error");
        setMessage(data.error || "Submission failed. Please try again.");
      }
    } catch (error) {
      setMessageType("error");
      setMessage("Network error. Please check your connection and try again.");
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: "linear-gradient(135deg, #0e243f 0%, #204168 50%, #37c2cc 100%)",
        }}
      />

      {/* Glowing Orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(55, 194, 204, 0.4) 0%, transparent 70%)",
          top: "10%",
          left: "5%",
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(32, 65, 104, 0.5) 0%, transparent 70%)",
          bottom: "10%",
          right: "5%",
        }}
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -40, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #37c2cc 0%, #ffffff 50%, #37c2cc 100%)",
              }}
            >
              Project Submission
            </span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Submit your CodeRush 2025 project here. Make sure you&apos;re a registered team!
          </p>
        </motion.div>

        {/* Submission Form */}
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white/10 backdrop-blur-xl border-2 border-[#37c2cc]/30 rounded-3xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Team Name */}
              <div>
                <label className="block text-[#37c2cc] font-semibold mb-2 text-lg">
                  Team Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your registered team name"
                  className="w-full px-4 py-3 bg-[#0e243f]/80 border-2 border-[#37c2cc]/30 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#37c2cc] focus:ring-2 focus:ring-[#37c2cc]/30 transition-all"
                />
                <p className="text-white/60 text-sm mt-1">
                  Must match your registered team name exactly
                </p>
              </div>

              {/* GitHub Repository Link */}
              <div>
                <label className="block text-[#37c2cc] font-semibold mb-2 text-lg">
                  GitHub Repository Link <span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  name="githubLink"
                  value={formData.githubLink}
                  onChange={handleInputChange}
                  required
                  placeholder="https://github.com/username/repository"
                  className="w-full px-4 py-3 bg-[#0e243f]/80 border-2 border-[#37c2cc]/30 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#37c2cc] focus:ring-2 focus:ring-[#37c2cc]/30 transition-all"
                />
                <p className="text-white/60 text-sm mt-1">
                  Repository must be public
                </p>
              </div>

              {/* Google Drive Folder Link */}
              <div>
                <label className="block text-[#37c2cc] font-semibold mb-2 text-lg">
                  Google Drive Folder Link <span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  name="googleDriveLink"
                  value={formData.googleDriveLink}
                  onChange={handleInputChange}
                  required
                  placeholder="https://drive.google.com/drive/folders/..."
                  className="w-full px-4 py-3 bg-[#0e243f]/80 border-2 border-[#37c2cc]/30 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#37c2cc] focus:ring-2 focus:ring-[#37c2cc]/30 transition-all"
                />
                <div className="text-white/60 text-sm mt-2 space-y-1">
                  <p>📁 Folder name: <span className="text-[#37c2cc] font-semibold">[Your Team Name]</span></p>
                  <p>📹 Video file: <span className="text-[#37c2cc] font-semibold">[Your Team Name]_demo.mp4</span></p>
                  <p>📄 Report file: <span className="text-[#37c2cc] font-semibold">[Your Team Name]_report.pdf</span></p>
                  <p className="text-yellow-400">⚠️ Set sharing to &quot;Anyone with the link can view&quot;</p>
                </div>
              </div>

              {/* Message Display */}
              {message && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-4 rounded-xl ${
                    messageType === "success"
                      ? "bg-green-500/20 border-2 border-green-500/50 text-green-200"
                      : "bg-red-500/20 border-2 border-red-500/50 text-red-200"
                  }`}
                >
                  <p className="font-semibold">{message}</p>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  isSubmitting
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#37c2cc] to-[#2ba8b3] hover:from-[#2ba8b3] hover:to-[#37c2cc] hover:scale-105 shadow-lg shadow-[#37c2cc]/50"
                } text-white`}
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
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
                    Submitting...
                  </span>
                ) : (
                  "Submit Project"
                )}
              </motion.button>
            </form>

            {/* Additional Information */}
            <div className="mt-8 p-4 bg-[#37c2cc]/10 rounded-xl border border-[#37c2cc]/30">
              <h3 className="text-[#37c2cc] font-bold mb-2">📋 Submission Guidelines:</h3>
              <ul className="text-white/70 text-sm space-y-1 list-disc list-inside">
                <li>Only registered teams can submit</li>
                <li>GitHub repository must be public</li>
                <li>Google Drive folder must be accessible to anyone with the link</li>
                <li>Ensure file names match your team name exactly</li>
                <li>Video format: MP4 (max 10 minutes)</li>
                <li>Report format: PDF (max 10 MB)</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
