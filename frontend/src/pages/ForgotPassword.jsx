
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import {
  Mail,
  ArrowLeft,
  Send,
  CheckCircle,
  Heart
} from "lucide-react";

export default function ForgotPassword() {
  const { forgotPassword } = useApp();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setSuccess(false);

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const result = await forgotPassword(normalizedEmail);

      if (!result.success) {
        setError(result.message || "Unable to send reset request.");
        return;
      }

      setSuccess(true);
      setMessage(
        result.message ||
        "If an account exists with this email, a reset link will be sent shortly."
      );

    } catch (err) {
      console.error("Forgot password error:", err);
      setError("Something went wrong. Please try again.");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#faf7ff]">

      <div className="w-full max-w-md">

        {/* MAIN CARD */}
        <div className="bg-white rounded-3xl shadow-xl border border-purple-100 p-7 sm:p-9">

          {/* LOGO */}
          <div className="text-center mb-7">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-100 flex items-center justify-center mb-4">
              <Mail size={30} className="text-purple-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-800">
              Forgot Password?
            </h1>

            <p className="text-gray-500 mt-3 text-sm leading-6">
              Don't worry! Enter your registered email address
              and we'll help you reset your password.
            </p>

          </div>

          {/* SUCCESS MESSAGE */}
          {success && (
            <div className="mb-5 p-4 rounded-xl bg-green-50 border border-green-200">

              <div className="flex items-center gap-2 text-green-700 font-semibold mb-2">
                <CheckCircle size={20} />
                Request submitted
              </div>

              <p className="text-sm text-green-700 leading-6">
                {message}
              </p>

              <p className="text-xs text-green-600 mt-2">
                Please check your inbox and spam folder.
              </p>

            </div>
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit}>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>

            <div className="relative mb-6">

              <Mail
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400"
              />

              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                  setSuccess(false);
                }}
                placeholder="Enter your registered email"
                autoComplete="email"
                required
                disabled={loading}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-purple-200 bg-purple-50/40 text-gray-800 outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition"
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg shadow-purple-200 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >

              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send Reset Link
                </>
              )}

            </button>

          </form>

          {/* BACK TO LOGIN */}
          <div className="text-center mt-7">

            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-semibold text-sm transition"
            >
              <ArrowLeft size={17} />
              Back to Login
            </Link>

          </div>

        </div>

        {/* FOOTER */}
        <div className="text-center mt-6 text-sm text-gray-500">
          Made with <Heart size={13} className="inline text-purple-500 fill-purple-500" /> by ArtStudio
        </div>

      </div>

    </div>
  );
}
