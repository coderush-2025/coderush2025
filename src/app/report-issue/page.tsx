'use client';

import { useState } from 'react';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import Link from 'next/link';

export default function ReportIssuePage() {
  const [formData, setFormData] = useState({
    teamName: '',
    contactNumber: '',
    email: '',
    problemType: 'registration',
    reason: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({
          teamName: '',
          contactNumber: '',
          email: '',
          problemType: 'registration',
          reason: '',
        });
      } else {
        setError(data.message || 'Failed to submit issue report');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Issue submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e243f] via-[#204168] to-[#0e243f] py-16 px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-[#37c2cc]/10 rounded-full blur-3xl top-20 left-20 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-[#37c2cc]/10 rounded-full blur-3xl bottom-20 right-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#37c2cc]/20 border border-[#37c2cc]/30 rounded-full mb-4">
            <FiAlertCircle className="text-[#37c2cc] text-3xl" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Report an Issue</h1>
          <p className="text-gray-300">
            Having trouble with registration or submission? Let us know and we&apos;ll help you out!
          </p>
        </div>

        {success ? (
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-full mb-4">
              <FiCheckCircle className="text-green-400 text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Issue Reported Successfully!</h2>
            <p className="text-gray-300 mb-6">
              Thank you for reporting the issue. Our team will review it and contact you soon at the email you provided.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setSuccess(false)}
                className="px-6 py-3 bg-[#37c2cc] text-white rounded-lg font-semibold hover:opacity-90 transition"
              >
                Report Another Issue
              </button>
              <Link
                href="/"
                className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/20 transition"
              >
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 space-y-6">
            {/* Team Name */}
            <div>
              <label htmlFor="teamName" className="block text-sm font-medium text-gray-200 mb-2">
                Team Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="teamName"
                name="teamName"
                value={formData.teamName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#37c2cc] focus:border-transparent transition"
                placeholder="Enter your team name"
                required
              />
            </div>

            {/* Contact Number */}
            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-200 mb-2">
                Contact Number <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#37c2cc] focus:border-transparent transition"
                placeholder="e.g., +94 77 123 4567"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#37c2cc] focus:border-transparent transition"
                placeholder="your.email@example.com"
                required
              />
            </div>

            {/* Problem Type */}
            <div>
              <label htmlFor="problemType" className="block text-sm font-medium text-gray-200 mb-2">
                Problem Type <span className="text-red-400">*</span>
              </label>
              <select
                id="problemType"
                name="problemType"
                value={formData.problemType}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#1a2942] border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#37c2cc] focus:border-transparent transition"
                style={{
                  colorScheme: 'dark'
                }}
                required
              >
                <option value="registration" className="bg-[#1a2942] text-white">Registration Process</option>
                <option value="submission" className="bg-[#1a2942] text-white">Submission Process</option>
                <option value="other" className="bg-[#1a2942] text-white">Other</option>
              </select>
            </div>

            {/* Reason */}
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-200 mb-2">
                Describe the Issue <span className="text-red-400">*</span>
              </label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#37c2cc] focus:border-transparent transition resize-none"
                placeholder="Please describe the issue you're facing in detail..."
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-[#37c2cc] to-[#2ba8b3] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Issue Report'}
              </button>
              <Link
                href="/"
                className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/20 transition text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        )}

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            For urgent matters, contact us directly at{' '}
            <a href="mailto:support@coderush.lk" className="text-[#37c2cc] hover:underline">
              support@coderush.lk
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
