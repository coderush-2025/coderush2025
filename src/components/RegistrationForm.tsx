"use client";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Member } from "@/types/registration";

interface FormData {
  teamName: string;
  hackerrankUsername: string;
  members: Member[];
  consent: boolean;
}

const MEMBER_COUNT = 3; // Adjust based on your requirements

export default function RegistrationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    teamName: "",
    hackerrankUsername: "",
    members: Array(MEMBER_COUNT).fill(null).map(() => ({
      fullName: "",
      indexNumber: "",
      batch: "",
      email: "",
    })),
    consent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const steps = [
    { title: "Team Details", icon: "👥" },
    { title: "Team Members", icon: "👤" },
    { title: "Confirmation", icon: "✅" },
  ];

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        return formData.teamName.trim().length >= 3 && 
               formData.hackerrankUsername.trim().length > 0 &&
               /^[A-Za-z0-9._-]+_CR$/i.test(formData.hackerrankUsername);
      case 1:
        return formData.members.every(member => 
          member.fullName.trim().length > 0 &&
          member.indexNumber.trim().length > 0 &&
          member.batch.trim().length === 4 &&
          /\S+@\S+\.\S+/.test(member.email)
        );
      case 2:
        return formData.consent;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const sessionId = uuidv4();
      
      // Submit to your API endpoint
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          ...formData,
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
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

  const updateMember = (index: number, field: keyof Member, value: string) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      ),
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-2">
                Team Name *
              </label>
              <input
                id="teamName"
                type="text"
                value={formData.teamName}
                onChange={(e) => setFormData(prev => ({ ...prev, teamName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your team name (min 3 characters)"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="TeamName_CR"
                required
              />
              <p className="mt-1 text-sm text-gray-600">
                Must end with &ldquo;_CR&rdquo; (e.g., TeamName_CR)
              </p>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Team Members</h3>
            {formData.members.map((member, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-3">Member {index + 1}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={member.fullName}
                      onChange={(e) => updateMember(index, "fullName", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      value={member.indexNumber}
                      onChange={(e) => updateMember(index, "indexNumber", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      value={member.batch}
                      onChange={(e) => updateMember(index, "batch", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      value={member.email}
                      onChange={(e) => updateMember(index, "email", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Registration Summary</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Team Name:</span>
                  <span className="ml-2">{formData.teamName}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">HackerRank Username:</span>
                  <span className="ml-2">{formData.hackerrankUsername}</span>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Team Members:</span>
                  <div className="mt-2 space-y-2">
                    {formData.members.map((member, index) => (
                      <div key={index} className="text-sm bg-white p-3 rounded border">
                        <div><strong>{index + 1}. {member.fullName}</strong></div>
                        <div className="text-gray-600">{member.indexNumber} • {member.batch} • {member.email}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <input
                id="consent"
                type="checkbox"
                checked={formData.consent}
                onChange={(e) => setFormData(prev => ({ ...prev, consent: e.target.checked }))}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="consent" className="text-sm text-gray-700">
                I agree to the terms and conditions of the competition and confirm that all information provided is accurate. *
              </label>
            </div>

            {submitStatus === "success" && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Registration Successful!
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>Your team has been successfully registered for CodeRush 2025.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Registration Failed
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>There was an error processing your registration. Please try again.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-6">
            <h1 className="text-2xl font-bold text-white text-center">
              Multi-Step Registration
            </h1>
            <p className="text-blue-100 text-center mt-1">
              Complete your registration step by step
            </p>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 bg-gray-50 border-b">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                      ${index <= currentStep 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-300 text-gray-600'
                      }
                    `}
                  >
                    {index < currentStep ? '✓' : step.icon}
                  </div>
                  <span
                    className={`
                      ml-2 text-sm font-medium
                      ${index <= currentStep ? 'text-blue-600' : 'text-gray-500'}
                    `}
                  >
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div
                      className={`
                        w-16 h-0.5 mx-4
                        ${index < currentStep ? 'bg-blue-600' : 'bg-gray-300'}
                      `}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="px-6 py-8">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="px-6 py-4 bg-gray-50 border-t flex justify-between">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`
                px-4 py-2 rounded-md text-sm font-medium
                ${currentStep === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
                }
              `}
            >
              Previous
            </button>
            
            <div className="flex space-x-3">
              {currentStep < steps.length - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={!validateStep(currentStep)}
                  className={`
                    px-6 py-2 rounded-md text-sm font-medium
                    ${!validateStep(currentStep)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                    }
                  `}
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!validateStep(currentStep) || isSubmitting}
                  className={`
                    px-6 py-2 rounded-md text-sm font-medium
                    ${!validateStep(currentStep) || isSubmitting
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                    }
                  `}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}