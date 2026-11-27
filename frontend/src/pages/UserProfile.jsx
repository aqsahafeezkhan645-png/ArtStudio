
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  ShoppingBag,
  Heart,
  Palette,
  LogOut,
  Save
} from 'lucide-react';

export default function UserProfile() {
  const {
    user,
    updateUserProfile,
    changeUserPassword,
    logout,
    orders,
    wishlist,
    savedCustomCards,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Load user details
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        postalCode: user.postalCode || ''
      });
    }
  }, [user]);

  // Common input styles
  const inputClass =
    "w-full px-3.5 py-2.5 text-xs bg-[#FAF7FD] border border-[#C8A2E8] rounded-xl text-[#40334F] focus:outline-none focus:ring-2 focus:ring-[#9B72CF]";

  const labelClass =
    "text-xs font-semibold text-[#7041A6] block mb-1";

  // Handle profile inputs
  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save profile
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showToast('Please enter your full name.', 'error');
      return;
    }

    setSaving(true);

    try {
      const result = await updateUserProfile({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        postalCode: formData.postalCode.trim()
      });

      if (result?.success) {
        setFormData(prev => ({
          ...prev,
          ...result.user
        }));
      }
    } catch (error) {
      console.error('Profile update:', error);
      showToast('Unable to save profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Handle password inputs
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Change password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword) {
      showToast('Please enter your current password.', 'error');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      showToast(
        'New password must be at least 8 characters long.',
        'error'
      );
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }

    if (!changeUserPassword) {
      showToast('Password service is not connected.', 'error');
      return;
    }

    setChangingPassword(true);

    try {
      const result = await changeUserPassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (result?.success) {
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Password update:', error);
      showToast('Unable to change password.', 'error');
    } finally {
      setChangingPassword(false);
    }
  };

  // Sign-in message
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#F3ECFA] text-[#7041A6] flex items-center justify-center">
          <User className="w-8 h-8" />
        </div>

        <h2 className="font-serif text-2xl font-bold text-[#40334F]">
          Please Sign In
        </h2>

        <p className="text-xs text-[#81758F]">
          Access your profile, orders, and saved card designs.
        </p>

        <Link
          to="/login"
          className="inline-block px-6 py-2.5 bg-[#7041A6] hover:bg-[#9B72CF] text-white text-xs font-semibold rounded-xl"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* PROFILE HEADER */}
      <div className="bg-gradient-to-r from-[#F3ECFA] to-[#E9DDF7] rounded-3xl p-6 sm:p-8 border border-[#C8A2E8]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

        <div className="flex items-center gap-4">

          <div className="w-16 h-16 rounded-2xl bg-[#7041A6] text-white flex items-center justify-center font-serif text-2xl font-bold shadow-md shadow-[#7041A6]/20">
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>

          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#40334F]">
              {user.name}
            </h1>

            <p className="text-xs text-[#81758F]">
              {user.email} · {user.role === 'admin'
                ? 'Studio Artisan (Admin)'
                : 'ArtStudio Member'}
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={logout}
          className="px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>

      </div>

      {/* QUICK METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <Link
          to="/orders"
          className="bg-white rounded-2xl p-5 border border-[#E9DDF7] hover:border-[#C8A2E8] shadow-sm flex items-center justify-between transition-all"
        >
          <div>
            <p className="text-xs text-[#81758F]">
              Order History
            </p>

            <p className="text-xl font-bold text-[#7041A6]">
              {orders?.length || 0} Placed
            </p>
          </div>

          <div className="w-10 h-10 rounded-xl bg-[#F3ECFA] text-[#7041A6] flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </Link>

        <Link
          to="/wishlist"
          className="bg-white rounded-2xl p-5 border border-[#E9DDF7] hover:border-[#C8A2E8] shadow-sm flex items-center justify-between transition-all"
        >
          <div>
            <p className="text-xs text-[#81758F]">
              Wishlist Cards
            </p>

            <p className="text-xl font-bold text-[#7041A6]">
              {wishlist?.length || 0} Saved
            </p>
          </div>

          <div className="w-10 h-10 rounded-xl bg-[#F3ECFA] text-[#7041A6] flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
        </Link>

        <div className="bg-white rounded-2xl p-5 border border-[#E9DDF7] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-[#81758F]">
              Saved Card Designs
            </p>

            <p className="text-xl font-bold text-[#7041A6]">
              {savedCustomCards?.length || 0} Creations
            </p>
          </div>

          <div className="w-10 h-10 rounded-xl bg-[#F3ECFA] text-[#7041A6] flex items-center justify-center">
            <Palette className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* TABS */}
      <div className="flex flex-wrap border-b border-[#E9DDF7] gap-6 text-sm font-semibold">

        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'profile'
              ? 'text-[#7041A6]'
              : 'text-[#81758F] hover:text-[#40334F]'
          }`}
        >
          Personal Information & Shipping Address

          {activeTab === 'profile' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#7041A6]" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'security'
              ? 'text-[#7041A6]'
              : 'text-[#81758F] hover:text-[#40334F]'
          }`}
        >
          Security & Password

          {activeTab === 'security' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#7041A6]" />
          )}
        </button>

      </div>

      {/* PERSONAL INFORMATION FORM */}
      {activeTab === 'profile' && (

        <form
          onSubmit={handleProfileSubmit}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9DDF7] shadow-sm space-y-6"
        >

          <h2 className="font-serif text-lg font-bold text-[#40334F]">
            Edit Customer Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className={labelClass}>
                Full Name
              </label>

              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B72CF]" />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleProfileChange}
                  required
                  maxLength={100}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B72CF]" />

                <input
                  type="email"
                  value={formData.email}
                  readOnly
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-gray-100 border border-[#E9DDF7] rounded-xl text-gray-500 cursor-not-allowed"
                />
              </div>

              <p className="text-[10px] text-[#81758F] mt-1">
                Email cannot be changed from this form.
              </p>
            </div>

            <div>
              <label className={labelClass}>
                Phone Number
              </label>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B72CF]" />

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleProfileChange}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>
                City
              </label>

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleProfileChange}
                className={inputClass}
              />
            </div>

          </div>

          <div>
            <label className={labelClass}>
              Shipping Address
            </label>

            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-[#9B72CF]" />

              <textarea
                rows={3}
                name="address"
                value={formData.address}
                onChange={handleProfileChange}
                className={`${inputClass} pl-10 resize-none`}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Postal Code
            </label>

            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleProfileChange}
              className={`${inputClass} sm:max-w-md`}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#7041A6] hover:bg-[#9B72CF] disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />

              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>

        </form>
      )}

      {/* SECURITY AND PASSWORD FORM */}
      {activeTab === 'security' && (

        <form
          onSubmit={handlePasswordSubmit}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9DDF7] shadow-sm space-y-5 max-w-xl"
        >

          <div>
            <h2 className="font-serif text-lg font-bold text-[#40334F]">
              Change Password
            </h2>

            <p className="text-xs text-[#81758F] mt-1">
              Keep your ArtStudio account secure by updating your password.
            </p>
          </div>

          <div>
            <label className={labelClass}>
              Current Password
            </label>

            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              autoComplete="current-password"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              New Password
            </label>

            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              minLength={8}
              autoComplete="new-password"
              required
              className={inputClass}
            />

            <p className="text-[10px] text-[#81758F] mt-1">
              Minimum 8 characters.
            </p>
          </div>

          <div>
            <label className={labelClass}>
              Confirm New Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              minLength={8}
              autoComplete="new-password"
              required
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={changingPassword}
            className="px-6 py-2.5 bg-[#7041A6] hover:bg-[#9B72CF] disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Lock className="w-3.5 h-3.5" />

            {changingPassword
              ? 'Updating Password...'
              : 'Update Password'}
          </button>

        </form>
      )}

    </div>
  );
}
