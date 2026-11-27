
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  ArrowLeft,
  Heart,
  KeyRound
} from "lucide-react";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword } = useApp();

  // ========================================
  // THEME COLORS
  // ========================================

  const theme = {
    background: "var(--theme-background, #faf7ff)",
    surface: "var(--theme-card, #ffffff)",
    text: "var(--theme-text, #40334F)",
    muted: "var(--theme-muted, #81758F)",
    primary: "var(--theme-primary, #7041A6)",
    accent: "var(--theme-accent, #9B72CF)",
    border: "var(--theme-border, #E9DDF7)",
    input: "var(--theme-input, #FAF7FD)"
  };

  const primaryButtonStyle = {
    backgroundColor: theme.primary,
    color: "#ffffff"
  };

  const inputStyle = {
    backgroundColor: theme.input,
    color: theme.text,
    borderColor: theme.border,
    "--tw-ring-color": theme.accent
  };

  // ========================================
  // STATES
  // ========================================

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  // ========================================
  // RESET PASSWORD
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!token) {
      setError("Invalid or missing password reset link.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password.length > 72) {
      setError("Password cannot be longer than 72 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const result = await resetPassword(token, password);

      if (!result?.success) {
        setError(
          result?.message ||
          "Unable to reset password. Please try again."
        );
        return;
      }

      setSuccess(true);

      setMessage(
        result.message ||
        "Your password has been reset successfully."
      );

    } catch (err) {
      console.error("Reset password error:", err);

      setError("Something went wrong. Please try again.");

    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // PAGE UI
  // ========================================

  return (
    <div
      className="min-h-[80vh] flex items-center justify-center px-4 py-12 transition-colors duration-300"
      style={{
        backgroundColor: theme.background,
        color: theme.text
      }}
    >

      <div
        className="w-full max-w-lg rounded-3xl p-7 sm:p-10 shadow-xl transition-colors duration-300"
        style={{
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`,
          boxShadow: `0 15px 40px ${theme.primary}12`
        }}
      >

        {/* HEADER */}

        <div className="text-center mb-8">

          <div
            className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-5"
            style={{
              backgroundColor: `${theme.primary}18`,
              color: theme.primary
            }}
          >
            <KeyRound size={36} />
          </div>

          <h1
            className="text-3xl sm:text-4xl font-bold font-serif"
            style={{ color: theme.text }}
          >
            Reset Password
          </h1>

          <p
            className="mt-3 text-sm leading-6"
            style={{ color: theme.muted }}
          >
            Create a new password for your ArtStudio account.
          </p>

        </div>

        {/* SUCCESS SCREEN */}

        {success ? (

          <div className="text-center">

            <div className="mb-6 p-5 rounded-2xl bg-green-50 border border-green-200">

              <CheckCircle
                size={42}
                className="text-green-600 mx-auto mb-3"
              />

              <h2 className="text-lg font-bold text-green-700 mb-2">
                Password Reset Successful!
              </h2>

              <p className="text-sm text-green-700 leading-6">
                {message}
              </p>

            </div>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full py-3.5 rounded-xl font-semibold transition hover:opacity-90"
              style={primaryButtonStyle}
            >
              Go to Login
            </button>

          </div>

        ) : (

          <>

            {/* ERROR MESSAGE */}

            {error && (
              <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200">

                <p className="text-sm text-red-600">
                  {error}
                </p>

              </div>
            )}

            {/* RESET FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* NEW PASSWORD */}

              <div>

                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: theme.text }}
                >
                  New Password
                </label>

                <div className="relative">

                  <Lock
                    size={20}
                    className="absolute left-5 top-1/2 -translate-y-1/2"
                    style={{ color: theme.accent }}
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    maxLength={72}
                    disabled={loading}
                    className="w-full pl-14 pr-14 py-4 rounded-2xl border outline-none focus:ring-2 transition"
                    style={inputStyle}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2"
                    style={{ color: theme.primary }}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={21} />
                    ) : (
                      <Eye size={21} />
                    )}
                  </button>

                </div>

              </div>

              {/* CONFIRM PASSWORD */}

              <div>

                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: theme.text }}
                >
                  Confirm New Password
                </label>

                <div className="relative">

                  <Lock
                    size={20}
                    className="absolute left-5 top-1/2 -translate-y-1/2"
                    style={{ color: theme.accent }}
                  />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    maxLength={72}
                    disabled={loading}
                    className="w-full pl-14 pr-14 py-4 rounded-2xl border outline-none focus:ring-2 transition"
                    style={inputStyle}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-5 top-1/2 -translate-y-1/2"
                    style={{ color: theme.primary }}
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={21} />
                    ) : (
                      <Eye size={21} />
                    )}
                  </button>

                </div>

              </div>

              {/* PASSWORD INFORMATION */}

              <p
                className="text-xs leading-5"
                style={{ color: theme.muted }}
              >
                Your password must be between 8 and 72 characters.
              </p>

              {/* RESET BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-white font-bold shadow-lg transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  ...primaryButtonStyle,
                  boxShadow: `0 8px 20px ${theme.primary}30`
                }}
              >

                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  <>
                    <Lock size={21} />
                    Reset Password
                  </>
                )}

              </button>

            </form>

            {/* BACK TO LOGIN */}

            <div className="text-center mt-7">

              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-semibold hover:underline"
                style={{ color: theme.primary }}
              >
                <ArrowLeft size={17} />
                Back to Login
              </Link>

            </div>

          </>

        )}

      </div>

      {/* FOOTER */}

      <div
        className="hidden"
        aria-hidden="true"
      >
        <Heart />
      </div>

    </div>
  );
}
