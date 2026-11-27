
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import {
  Flower2,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

export default function Signup() {
  const { signup } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Theme-aware colors from theme.js
  const colors = {
    primary: "var(--theme-primary)",
    secondary: "var(--theme-secondary)",
    accent: "var(--theme-accent)",
    light: "var(--theme-light)",
    soft: "var(--theme-soft)",
    background: "var(--theme-background)",
    text: "var(--theme-text)",
    muted: "var(--theme-muted)"
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      submit: ""
    }));
  };

  // FORM VALIDATION
  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      newErrors.email = "Please provide a valid email.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required for shipping updates.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    } else if (formData.password.length > 72) {
      newErrors.password = "Password cannot exceed 72 characters.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // REGISTER CUSTOMER
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading || !validate()) return;

    setLoading(true);

    try {
      const result = await signup({
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password
      });

      if (result?.success) {
        navigate("/", { replace: true });
      } else {
        setErrors({
          submit: result?.message || "Unable to create your account."
        });
      }
    } catch (error) {
      console.error("Signup failed:", error);

      setErrors({
        submit: "Unable to create your account. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  // Reusable theme-aware input style
  const inputStyle = {
    backgroundColor: colors.soft,
    borderColor: colors.light,
    color: colors.text
  };

  const iconStyle = {
    color: colors.muted
  };

  const labelStyle = {
    color: colors.secondary
  };

  const focusStyle = {
    "--tw-ring-color": colors.primary
  };

  return (
    <div
      className="min-h-[85vh] flex items-center justify-center px-4 py-12 transition-colors duration-300"
      style={{
        backgroundColor: colors.background,
        color: colors.text
      }}
    >
      <div
        className="max-w-md w-full rounded-3xl p-8 sm:p-10 border shadow-xl space-y-6 transition-all duration-300"
        style={{
          backgroundColor: "var(--theme-card, #ffffff)",
          borderColor: colors.light,
          boxShadow: "0 12px 35px color-mix(in srgb, var(--theme-primary) 12%, transparent)"
        }}
      >

        {/* LOGO AND HEADER */}
        <div className="text-center space-y-3">

          <div
            className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-white shadow-md transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              boxShadow: "0 5px 15px color-mix(in srgb, var(--theme-primary) 30%, transparent)"
            }}
          >
            <Flower2 className="w-7 h-7" />
          </div>

          <h1
            className="font-serif text-2xl sm:text-3xl font-bold"
            style={{ color: colors.secondary }}
          >
            Join the ArtStudio Family
          </h1>

          <p
            className="text-xs leading-5"
            style={{ color: colors.muted }}
          >
            Create an account to save personalized cards and receive studio updates.
          </p>
        </div>

        {/* SECURITY MESSAGE */}
        <div
          className="p-3 rounded-2xl border flex items-center gap-3 transition-colors duration-300"
          style={{
            backgroundColor: colors.soft,
            borderColor: colors.light
          }}
        >
          <ShieldCheck
            className="w-5 h-5 shrink-0"
            style={{ color: colors.primary }}
          />

          <div>
            <p
              className="text-xs font-bold"
              style={{ color: colors.secondary }}
            >
              Create Your Secure Account
            </p>

            <p
              className="text-[10px]"
              style={{ color: colors.muted }}
            >
              Your password is securely hashed by the backend.
            </p>
          </div>
        </div>

        <div
          className="rounded-xl border p-3 text-center space-y-1"
          style={{ backgroundColor: colors.soft, borderColor: colors.light }}
        >
          <p className="text-xs font-semibold" style={{ color: colors.secondary }}>
            Customer Registration Only
          </p>
          <p className="text-[10px] leading-4" style={{ color: colors.muted }}>
            Admin accounts cannot be created from this public signup page.
          </p>
          <Link
            to="/login?mode=admin"
            className="inline-flex items-center gap-1 text-xs font-bold hover:underline mt-1"
            style={{ color: colors.primary }}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin Login
          </Link>
        </div>

        {/* SIGNUP FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* FULL NAME */}
          <div>
            <label
              className="text-xs font-semibold block mb-1"
              style={labelStyle}
            >
              Full Name *
            </label>

            <div className="relative">
              <User
                className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2"
                style={iconStyle}
              />

              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Ayla Noor"
                autoComplete="name"
                disabled={loading}
                className="w-full pl-10 pr-3.5 py-3 text-xs border rounded-xl outline-none focus:ring-2 transition-all"
                style={{ ...inputStyle, ...focusStyle }}
              />
            </div>

            {errors.fullName && (
              <p className="text-[11px] text-rose-500 mt-1">
                {errors.fullName}
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label
              className="text-xs font-semibold block mb-1"
              style={labelStyle}
            >
              Email Address *
            </label>

            <div className="relative">
              <Mail
                className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2"
                style={iconStyle}
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ayla@example.com"
                autoComplete="email"
                disabled={loading}
                className="w-full pl-10 pr-3.5 py-3 text-xs border rounded-xl outline-none focus:ring-2 transition-all"
                style={{ ...inputStyle, ...focusStyle }}
              />
            </div>

            {errors.email && (
              <p className="text-[11px] text-rose-500 mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* PHONE */}
          <div>
            <label
              className="text-xs font-semibold block mb-1"
              style={labelStyle}
            >
              Phone Number *
            </label>

            <div className="relative">
              <Phone
                className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2"
                style={iconStyle}
              />

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+92 300 1234567"
                autoComplete="tel"
                disabled={loading}
                className="w-full pl-10 pr-3.5 py-3 text-xs border rounded-xl outline-none focus:ring-2 transition-all"
                style={{ ...inputStyle, ...focusStyle }}
              />
            </div>

            {errors.phone && (
              <p className="text-[11px] text-rose-500 mt-1">
                {errors.phone}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label
              className="text-xs font-semibold block mb-1"
              style={labelStyle}
            >
              Password (minimum 8 characters) *
            </label>

            <div className="relative">
              <Lock
                className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2"
                style={iconStyle}
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Choose a strong password"
                autoComplete="new-password"
                maxLength={72}
                disabled={loading}
                className="w-full pl-10 pr-10 py-3 text-xs border rounded-xl outline-none focus:ring-2 transition-all"
                style={{ ...inputStyle, ...focusStyle }}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: colors.primary }}
                aria-label={showPassword ? "Hide password" : "Show password"}
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

          {/* CONFIRM PASSWORD */}
          <div>
            <label
              className="text-xs font-semibold block mb-1"
              style={labelStyle}
            >
              Confirm Password *
            </label>

            <div className="relative">
              <Lock
                className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2"
                style={iconStyle}
              />

              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                maxLength={72}
                disabled={loading}
                className="w-full pl-10 pr-10 py-3 text-xs border rounded-xl outline-none focus:ring-2 transition-all"
                style={{ ...inputStyle, ...focusStyle }}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: colors.primary }}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="text-[11px] text-rose-500 mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* GENERAL ERROR */}
          {errors.submit && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
              <p className="text-xs text-rose-600">
                {errors.submit}
              </p>
            </div>
          )}

          {/* CREATE ACCOUNT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-white text-xs font-bold rounded-xl shadow-md transition-all duration-300 hover:brightness-95 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              boxShadow: "0 5px 15px color-mix(in srgb, var(--theme-primary) 25%, transparent)"
            }}
          >
            <span>
              {loading ? "Creating Account..." : "Create My Account"}
            </span>

            {loading ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>

        </form>

        {/* LOGIN LINK */}
        <div
          className="text-center text-xs pt-2"
          style={{ color: colors.muted }}
        >
          Already have an account?{" "}

          <Link
            to="/login"
            className="font-bold hover:underline transition-colors"
            style={{ color: colors.primary }}
          >
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
}
