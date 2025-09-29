"use client";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Member } from "@/types/registration";

export default function SimpleRegistrationForm() {
  const [formData, setFormData] = useState({
    teamName: "",
    hackerrankUsername: "",
    member1: { fullName: "", indexNumber: "", batch: "", email: "" },
    member2: { fullName: "", indexNumber: "", batch: "", email: "" },
    member3: { fullName: "", indexNumber: "", batch: "", email: "" },
    consent: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    // Team name validation
    if (formData.teamName.trim().length < 3) {
      newErrors.push("Team name must be at least 3 characters");
    }

    // HackerRank username validation
    if (!/^[A-Za-z0-9._-]+_CR$/i.test(formData.hackerrankUsername)) {
      newErrors.push("HackerRank username must end with '_CR'");
    }

    // Member validation
    const members = [formData.member1, formData.member2, formData.member3];
    members.forEach((member, index) => {
      if (!member.fullName.trim()) {
        newErrors.push(`Member ${index + 1}: Full name is required`);
      }
      if (!member.indexNumber.trim()) {
        newErrors.push(`Member ${index + 1}: Index number is required`);
      }
      if (!/^\d{4}$/.test(member.batch)) {
        newErrors.push(`Member ${index + 1}: Batch must be a 4-digit year`);
      }
      if (!/\S+@\S+\.\S+/.test(member.email)) {
        newErrors.push(`Member ${index + 1}: Valid email is required`);
      }
    });

    // Consent validation
    if (!formData.consent) {
      newErrors.push("You must accept the terms and conditions");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const sessionId = uuidv4();
      const members: Member[] = [
        formData.member1,
        formData.member2,
        formData.member3,
      ];

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          teamName: formData.teamName,
          hackerrankUsername: formData.hackerrankUsername,
          members,
          consent: formData.consent,
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        // Reset form
        setFormData({
          teamName: "",
          hackerrankUsername: "",
          member1: { fullName: "", indexNumber: "", batch: "", email: "" },
          member2: { fullName: "", indexNumber: "", batch: "", email: "" },
          member3: { fullName: "", indexNumber: "", batch: "", email: "" },
          consent: false,
        });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateMember = (memberKey: 'member1' | 'member2' | 'member3', field: keyof Member, value: string) => {
    setFormData(prev => ({
      ...prev,
      [memberKey]: {
        ...prev[memberKey],
        [field]: value,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              🚀 Quick Registration
            </h1>
            <p className="text-lg text-blue-100">
              Register your team in one simple form
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {/* Error Messages */}
            {errors.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded">
                <h3 className="text-red-800 font-medium mb-2">Please fix the following errors:</h3>
                <ul className="text-red-700 text-sm space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Success Message */}
            {submitStatus === "success" && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded">
                <h3 className="text-green-800 font-medium">🎉 Registration Successful!</h3>
                <p className="text-green-700 text-sm mt-1">
                  Your team has been successfully registered for CodeRush 2025.
                </p>
              </div>
            )}

            {/* Team Details */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                👥 Team Details
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-2">
                    Team Name *
                  </label>
                  <input
                    id="teamName"
                    type="text"
                    value={formData.teamName}
                    onChange={(e) => setFormData(prev => ({ ...prev, teamName: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="Enter your team name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="hackerrankUsername" className="block text-sm font-medium text-gray-700 mb-2">
                    HackerRank Username *
                  </label>
                  <input
                    id="hackerrankUsername"
                    type="text"
                    value={formData.hackerrankUsername}
                    onChange={(e) => setFormData(prev => ({ ...prev, hackerrankUsername: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="TeamName_CR"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Must end with &ldquo;_CR&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Team Members */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                👤 Team Members
              </h2>

              {(['member1', 'member2', 'member3'] as const).map((memberKey, index) => (
                <div key={memberKey} className="mb-6 p-6 bg-gray-50 rounded-xl border">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">
                    Member {index + 1}
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData[memberKey].fullName}
                        onChange={(e) => updateMember(memberKey, "fullName", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Index Number *
                      </label>
                      <input
                        type="text"
                        value={formData[memberKey].indexNumber}
                        onChange={(e) => updateMember(memberKey, "indexNumber", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="IT2023/101"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Batch *
                      </label>
                      <input
                        type="text"
                        value={formData[memberKey].batch}
                        onChange={(e) => updateMember(memberKey, "batch", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="2023"
                        maxLength={4}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData[memberKey].email}
                        onChange={(e) => updateMember(memberKey, "email", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Consent */}
            <div className="mb-8">
              <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <input
                  id="consent"
                  type="checkbox"
                  checked={formData.consent}
                  onChange={(e) => setFormData(prev => ({ ...prev, consent: e.target.checked }))}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  required
                />
                <label htmlFor="consent" className="text-sm text-gray-700">
                  <strong>I agree to the terms and conditions</strong> of CodeRush 2025 and confirm 
                  that all information provided is accurate. I understand that any false information 
                  may result in disqualification. *
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  w-full md:w-auto px-8 py-4 rounded-lg text-lg font-semibold transition duration-200
                  ${isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105'
                  }
                  text-white shadow-lg
                `}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering...
                  </span>
                ) : (
                  '🚀 Register Team'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}