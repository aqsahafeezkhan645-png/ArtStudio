
import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

import {
  Flower2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

export default function Login() {
  const {
    login,
    logout,
    forgotPassword,
    showToast
  } = useApp();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loginMode, setLoginMode] = useState(
    searchParams.get("mode") === "admin" ? "admin" : "customer"
  );

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

  const inputStyle = {
    backgroundColor: theme.input,
    color: theme.text,
    borderColor: theme.border,
    "--tw-ring-color": theme.accent
  };

  const primaryButtonStyle = {
    backgroundColor: theme.primary,
    color: "#ffffff"
  };

  // ========================================
  // LOGIN STATES
  // ========================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ========================================
  // FORGOT PASSWORD STATES
  // ========================================

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");

  // ========================================
  // LOGIN VALIDATION
  // ========================================

  const validate = () => {
    const errs = {};

    if (!email.trim()) {
      errs.email = "Email address is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      errs.email = "Please enter a valid email address.";
    }

    if (!password) {
      errs.password = "Password is required.";
    }

    setErrors(errs);

    return Object.keys(errs).length === 0;
  };

  // ========================================
  // LOGIN WITH BACKEND
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading || !validate()) return;

    setLoading(true);

    try {
      const result = await login(
        email.trim().toLowerCase(),
        password,
        rememberMe
      );

      if (result?.success) {
        const loggedInUser = result.user;

        const expectedRole = loginMode === "admin" ? "admin" : "customer";

        if (loggedInUser?.role !== expectedRole) {
          // Do not leave a user signed in when they selected the wrong login area.
          await logout();

          setErrors({
            submit:
              loginMode === "admin"
                ? "This account is not an administrator. Please use Customer Login."
                : "This is an administrator account. Please use Admin Login."
          });

          return;
        }

        if (expectedRole === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }

    } catch (error) {
      console.error("Login failed:", error);

      showToast(
        "Something went wrong. Please try again.",
        "error"
      );

    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // OPEN FORGOT PASSWORD MODAL
  // ========================================

  const openForgotModal = () => {
    setForgotEmail(email.trim());
    setForgotError("");
    setForgotMessage("");
    setShowForgotModal(true);
  };

  // ========================================
  // SEND FORGOT PASSWORD REQUEST
  // ========================================

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();

    if (forgotLoading) return;

    const normalizedEmail = forgotEmail.trim().toLowerCase();

    if (!normalizedEmail) {
      setForgotError(
        "Please enter your registered email address."
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setForgotError("Please enter a valid email address.");
      return;
    }

    setForgotLoading(true);
    setForgotError("");
    setForgotMessage("");

    try {
      const result = await forgotPassword(normalizedEmail);

      if (!result?.success) {
        setForgotError(
          result?.message ||
          "Unable to send password reset request."
        );
        return;
      }

      setForgotMessage(
        result.message ||
        "If an account exists with this email, a password reset link will be sent."
      );

    } catch (error) {
      console.error("Forgot password error:", error);

      setForgotError(
        "Unable to connect to the server. Please try again."
      );

    } finally {
      setForgotLoading(false);
    }
  };

  // ========================================
  // CLOSE FORGOT PASSWORD MODAL
  // ========================================

  const closeForgotModal = () => {
    if (forgotLoading) return;

    setShowForgotModal(false);
    setForgotError("");
    setForgotMessage("");
  };

  // ========================================
  // MAIN LOGIN PAGE
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
        className="max-w-md w-full rounded-3xl p-8 sm:p-10 shadow-xl space-y-6 transition-colors duration-300"
        style={{
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`,
          boxShadow: `0 15px 40px ${theme.primary}12`
        }}
      >

        {/* HEADER */}

        <div className="text-center space-y-2">

          <div
            className="w-12 h-12 mx-auto rounded-2xl flex items-center justify-center text-white shadow-md"
            style={{
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`
            }}
          >
            <Flower2 className="w-6 h-6" />
          </div>

          <h1
            className="font-serif text-2xl sm:text-3xl font-bold"
            style={{ color: theme.text }}
          >
            {loginMode === "admin" ? "ArtStudio Admin Login" : "Welcome to ArtStudio"}
          </h1>

          <p
            className="text-xs"
            style={{ color: theme.muted }}
          >
            {loginMode === "admin"
              ? "Authorized store administrators only."
              : "Sign in to track orders, save designs and manage your wishlist."}
          </p>

        </div>

        {/* CUSTOMER / ADMIN LOGIN MODE */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl" style={{ backgroundColor: theme.input, border: `1px solid ${theme.border}` }}>
          <button
            type="button"
            onClick={() => {
              setLoginMode("customer");
              setErrors({});
            }}
            className="py-2.5 rounded-lg text-xs font-bold transition-all"
            style={{
              backgroundColor: loginMode === "customer" ? theme.primary : "transparent",
              color: loginMode === "customer" ? "#ffffff" : theme.muted
            }}
          >
            Customer Login
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMode("admin");
              setErrors({});
            }}
            className="py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            style={{
              backgroundColor: loginMode === "admin" ? theme.primary : "transparent",
              color: loginMode === "admin" ? "#ffffff" : theme.muted
            }}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin Login
          </button>
        </div>

        {errors.submit && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
            <p className="text-xs text-rose-600">{errors.submit}</p>
          </div>
        )}

        {/* SECURITY MESSAGE */}

        <div
          className="p-3 rounded-2xl flex items-center gap-3"
          style={{
            backgroundColor: theme.input,
            border: `1px solid ${theme.border}`
          }}
        >

          <ShieldCheck
            className="w-5 h-5 shrink-0"
            style={{ color: theme.primary }}
          />

          <div>
            <p
              className="text-xs font-bold"
              style={{ color: theme.primary }}
            >
              {loginMode === "admin" ? "Restricted Administrator Access" : "Secure Customer Login"}
            </p>

            <p
              className="text-[10px]"
              style={{ color: theme.muted }}
            >
              {loginMode === "admin"
                ? "Only accounts with the admin role can enter the Admin Dashboard."
                : "Your account is authenticated through ArtStudio's backend."}
            </p>
          </div>

        </div>

        {/* LOGIN FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* EMAIL */}

          <div>

            <label
              className="text-xs font-semibold block mb-1"
              style={{ color: theme.primary }}
            >
              Email Address
            </label>

            <div className="relative">

              <Mail
                className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2"
                style={{ color: theme.muted }}
              />

              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);

                  setErrors(prev => ({
                    ...prev,
                    email: ""
                  }));
                }}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={loading}
                className="w-full pl-10 pr-3.5 py-2.5 text-xs border rounded-xl outline-none focus:ring-2 transition"
                style={{
                  ...inputStyle,
                  borderColor: errors.email ? "#f87171" : theme.border
                }}
              />

            </div>

            {errors.email && (
              <p className="text-[11px] text-rose-500 mt-1">
                {errors.email}
              </p>
            )}

          </div>

          {/* PASSWORD */}

          <div>

            <div className="flex justify-between items-center mb-1">

              <label
                className="text-xs font-semibold"
                style={{ color: theme.primary }}
              >
                Password
              </label>

              <button
                type="button"
                onClick={openForgotModal}
                className="text-[11px] hover:underline"
                style={{ color: theme.primary }}
              >
                Forgot Password?
              </button>

            </div>

            <div className="relative">

              <Lock
                className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2"
                style={{ color: theme.muted }}
              />

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);

                  setErrors(prev => ({
                    ...prev,
                    password: ""
                  }));
                }}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={loading}
                className="w-full pl-10 pr-10 py-2.5 text-xs border rounded-xl outline-none focus:ring-2 transition"
                style={{
                  ...inputStyle,
                  borderColor: errors.password ? "#f87171" : theme.border
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2"
                style={{ color: theme.muted }}
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>

            </div>

            {errors.password && (
              <p className="text-[11px] text-rose-500 mt-1">
                {errors.password}
              </p>
            )}

          </div>

          {/* REMEMBER ME */}

          <div className="flex items-center justify-between text-xs pt-1">

            <label
              className="flex items-center gap-2 cursor-pointer"
              style={{ color: theme.text }}
            >

              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded"
                style={{
                  accentColor: theme.primary
                }}
              />

              <span>Remember me</span>

            </label>

          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 hover:opacity-90"
            style={primaryButtonStyle}
          >

            <span>
              {loading ? "Signing In..." : loginMode === "admin" ? "Admin Sign In" : "Sign In"}
            </span>

            {loading ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}

          </button>

        </form>

        {/* ACCOUNT LINKS */}

        <div
          className="text-center text-xs pt-2"
          style={{ color: theme.muted }}
        >
          {loginMode === "customer" ? (
            <>
              Don't have an account yet?{" "}
              <Link
                to="/signup"
                className="font-bold hover:underline"
                style={{ color: theme.primary }}
              >
                Create a Customer Account
              </Link>
            </>
          ) : (
            <>
              Not an administrator?{" "}
              <button
                type="button"
                onClick={() => {
                  setLoginMode("customer");
                  setErrors({});
                }}
                className="font-bold hover:underline"
                style={{ color: theme.primary }}
              >
                Customer Login
              </button>
              <p className="mt-2 text-[10px]" style={{ color: theme.muted }}>
                Admin accounts are created securely by the store owner. Public admin registration is disabled.
              </p>
            </>
          )}
        </div>

      </div>

      {/* ========================================
          FORGOT PASSWORD MODAL
      ======================================== */}

      {showForgotModal && (

        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeForgotModal();
            }
          }}
        >

          <div
            className="rounded-3xl p-6 max-w-sm w-full shadow-xl space-y-4"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
              color: theme.text
            }}
          >

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between">

              <h3
                className="font-serif text-lg font-bold"
                style={{ color: theme.text }}
              >
                Reset Password
              </h3>

              <button
                type="button"
                onClick={closeForgotModal}
                disabled={forgotLoading}
                className="text-xl disabled:opacity-50"
                style={{ color: theme.muted }}
                aria-label="Close modal"
              >
                ×
              </button>

            </div>

            {forgotMessage ? (

              /* SUCCESS MESSAGE */

              <div className="space-y-4">

                <div className="p-4 rounded-xl bg-green-50 border border-green-200">

                  <p className="text-sm font-semibold text-green-700 mb-2">
                    Reset request submitted!
                  </p>

                  <p className="text-xs text-green-700 leading-5">
                    {forgotMessage}
                  </p>

                  <p className="text-[11px] text-green-600 mt-2">
                    Please check your inbox and spam folder.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={closeForgotModal}
                  className="w-full px-4 py-2.5 text-white text-xs font-semibold rounded-xl hover:opacity-90"
                  style={primaryButtonStyle}
                >
                  Close
                </button>

              </div>

            ) : (

              /* FORGOT PASSWORD FORM */

              <>

                <p
                  className="text-xs leading-5"
                  style={{ color: theme.muted }}
                >
                  Enter your registered email address. We will send you a secure password reset link.
                </p>

                <form
                  onSubmit={handleForgotPasswordSubmit}
                  className="space-y-3"
                >

                  <div>

                    <label
                      className="block text-xs font-semibold mb-1"
                      style={{ color: theme.primary }}
                    >
                      Registered Email Address
                    </label>

                    <div className="relative">

                      <Mail
                        className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2"
                        style={{ color: theme.muted }}
                      />

                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => {
                          setForgotEmail(e.target.value);
                          setForgotError("");
                        }}
                        placeholder="name@example.com"
                        autoComplete="email"
                        required
                        disabled={forgotLoading}
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs border rounded-xl outline-none focus:ring-2 disabled:opacity-60"
                        style={inputStyle}
                      />

                    </div>

                  </div>

                  {/* ERROR MESSAGE */}

                  {forgotError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">

                      <p className="text-xs text-rose-600">
                        {forgotError}
                      </p>

                    </div>
                  )}

                  {/* MODAL BUTTONS */}

                  <div className="flex gap-2 justify-end pt-2">

                    <button
                      type="button"
                      onClick={closeForgotModal}
                      disabled={forgotLoading}
                      className="px-3 py-2 text-xs disabled:opacity-50"
                      style={{ color: theme.muted }}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="px-4 py-2.5 text-white text-xs font-semibold rounded-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 hover:opacity-90"
                      style={primaryButtonStyle}
                    >

                      {forgotLoading ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="w-3.5 h-3.5" />
                          Send Reset Link
                        </>
                      )}

                    </button>

                  </div>

                </form>

              </>

            )}

          </div>

        </div>

      )}

    </div>
  );
}
