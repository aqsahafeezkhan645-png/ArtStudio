
import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api/store-settings';
const CONTACT_API_URL = 'http://localhost:5000/api/contact';

export default function Contact() {
  const { showToast } = useApp();

  // ========================================
  // STORE INFORMATION FROM MONGODB
  // ========================================

  const [storeSettings, setStoreSettings] = useState({
    email: '',
    phone: '',
    address: '',
    workingHours: ''
  });

  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsError, setSettingsError] = useState('');

  // ========================================
  // CONTACT FORM STATE
  // ========================================

  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'Custom Order Inquiry',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  // Email submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // ========================================
  // FETCH STORE INFORMATION FROM BACKEND
  // ========================================

  useEffect(() => {
    const controller = new AbortController();

    const fetchStoreSettings = async () => {
      try {
        setSettingsLoading(true);
        setSettingsError('');

        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            Accept: 'application/json'
          },
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(
            `Backend returned an error: ${response.status}`
          );
        }

        const data = await response.json();

        if (!data.success || !data.settings) {
          throw new Error(
            data.message || 'Store information is unavailable.'
          );
        }

        setStoreSettings({
          email: data.settings.email || '',
          phone: data.settings.phone || '',
          address: data.settings.address || '',
          workingHours: data.settings.workingHours || ''
        });

      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Store settings error:', error);

          setSettingsError(
            error.message || 'Unable to load contact information.'
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setSettingsLoading(false);
        }
      }
    };

    fetchStoreSettings();

    return () => controller.abort();
  }, []);

  // ========================================
  // FAQ DATA
  // ========================================

  const faqs = [
    {
      q: 'How long does a customized card take to craft and deliver?',
      a: 'Customized cards are hand-pressed and penned within 24 hours. Nationwide delivery across Pakistan takes 2–3 business days via reputable express couriers.'
    },
    {
      q: 'Can you print bulk personalized cards for weddings or corporate events?',
      a: 'Yes! We specialize in bespoke wedding invitation suites and bulk milestone celebration suites. Contact us with your guest count for bulk volume pricing.'
    },
    {
      q: 'Do you offer Cash on Delivery (COD)?',
      a: 'Yes, Cash on Delivery is available across all major cities and towns in Pakistan with zero extra fee.'
    },
    {
      q: 'Are the dried flowers genuine and long-lasting?',
      a: 'Every petal and blossom is 100% natural, botanically pressed and sealed with archival protective spray to maintain its vibrant hue for years.'
    }
  ];

  // ========================================
  // FORM VALIDATION
  // ========================================

  const validate = () => {
    const errs = {};

    if (!form.name.trim()) {
      errs.name = 'Please provide your name.';
    } else if (form.name.trim().length > 100) {
      errs.name = 'Name cannot exceed 100 characters.';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !form.email.trim() ||
      !emailPattern.test(form.email.trim())
    ) {
      errs.email = 'Please provide a valid email.';
    } else if (form.email.trim().length > 254) {
      errs.email = 'Email address is too long.';
    }

    if (
      !form.message.trim() ||
      form.message.trim().length < 10
    ) {
      errs.message = 'Please provide a message of at least 10 characters.';
    } else if (form.message.trim().length > 5000) {
      errs.message = 'Message cannot exceed 5000 characters.';
    }

    setErrors(errs);

    return Object.keys(errs).length === 0;
  };

  // ========================================
  // SEND CONTACT MESSAGE THROUGH BACKEND
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    if (!validate()) return;

    setSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch(CONTACT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject,
          message: form.message.trim()
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Your message could not be sent.'
        );
      }

      // Show success only after backend accepts the email
      setSubmitted(true);

      showToast(
        'Your message has been sent successfully! 💌'
      );

      setForm({
        name: '',
        email: '',
        subject: 'Custom Order Inquiry',
        message: ''
      });

      setErrors({});

    } catch (error) {
      console.error('Contact form error:', error);

      setSubmitError(
        error.message || 'Unable to send your message. Please try again.'
      );

      showToast(
        'Message could not be sent.',
        'error'
      );

    } finally {
      setSubmitting(false);
    }
  };

  // ========================================
  // DISPLAY CONTACT INFORMATION
  // ========================================

  const contactValue = (value) => {
    if (settingsLoading) return 'Loading...';

    if (settingsError) {
      return 'Unable to load contact information.';
    }

    return value || 'Not available';
  };

  // ========================================
  // MAIN CONTACT PAGE
  // ========================================

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

      {/* HEADER */}

      <div className="text-center max-w-2xl mx-auto space-y-2">

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3ECFA] text-xs font-semibold text-[#7041A6]">
          <Sparkles className="w-3.5 h-3.5" />

          <span>We'd Love to Hear From You</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#40334F]">
          Get in Touch with Our Studio
        </h1>

        <p className="text-xs sm:text-sm text-[#81758F]">
          Have questions about bulk orders, bespoke calligraphy, or special
          delivery timing? Drop us a note!
        </p>

      </div>

      {/* MAIN GRID */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

        {/* CONTACT FORM LEFT */}

        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#E9DDF7] shadow-sm space-y-6">

          <h2 className="font-serif text-xl font-bold text-[#40334F]">
            Send Us a Message
          </h2>

          {submitted ? (

            /* SUCCESS MESSAGE */

            <div className="p-6 bg-[#FAF7FD] border border-[#C8A2E8] rounded-2xl text-center space-y-3">

              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <h3 className="font-serif text-lg font-bold text-[#40334F]">
                Message Sent Successfully!
              </h3>

              <p className="text-xs text-[#81758F]">
                Thank you for reaching out. Your message has been accepted
                for email delivery. Our team will get back to you.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setSubmitError('');
                }}
                className="px-4 py-2 bg-[#7041A6] hover:bg-[#9B72CF] text-white text-xs font-semibold rounded-xl transition"
              >
                Send Another Message
              </button>

            </div>

          ) : (

            /* CONTACT FORM */

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* NAME AND EMAIL */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* NAME */}

                <div>

                  <label className="text-xs font-semibold text-[#7041A6] block mb-1">
                    Your Name *
                  </label>

                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => {
                      setForm({
                        ...form,
                        name: e.target.value
                      });

                      setErrors({
                        ...errors,
                        name: ''
                      });
                    }}
                    placeholder="e.g. Sara Ahmed"
                    maxLength={100}
                    disabled={submitting}
                    className={`w-full px-3.5 py-2.5 text-xs bg-[#FAF7FD] border rounded-xl text-[#40334F] focus:outline-none focus:ring-2 focus:ring-[#9B72CF] ${
                      errors.name
                        ? 'border-rose-400'
                        : 'border-[#C8A2E8]'
                    }`}
                  />

                  {errors.name && (
                    <p className="text-[11px] text-rose-500 mt-1">
                      {errors.name}
                    </p>
                  )}

                </div>

                {/* EMAIL */}

                <div>

                  <label className="text-xs font-semibold text-[#7041A6] block mb-1">
                    Email Address *
                  </label>

                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => {
                      setForm({
                        ...form,
                        email: e.target.value
                      });

                      setErrors({
                        ...errors,
                        email: ''
                      });
                    }}
                    placeholder="sara@example.com"
                    maxLength={254}
                    disabled={submitting}
                    className={`w-full px-3.5 py-2.5 text-xs bg-[#FAF7FD] border rounded-xl text-[#40334F] focus:outline-none focus:ring-2 focus:ring-[#9B72CF] ${
                      errors.email
                        ? 'border-rose-400'
                        : 'border-[#C8A2E8]'
                    }`}
                  />

                  {errors.email && (
                    <p className="text-[11px] text-rose-500 mt-1">
                      {errors.email}
                    </p>
                  )}

                </div>

              </div>

              {/* SUBJECT */}

              <div>

                <label className="text-xs font-semibold text-[#7041A6] block mb-1">
                  Subject
                </label>

                <select
                  value={form.subject}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      subject: e.target.value
                    })
                  }
                  disabled={submitting}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7FD] border border-[#C8A2E8] rounded-xl text-[#40334F] focus:outline-none focus:ring-2 focus:ring-[#9B72CF]"
                >

                  <option value="Custom Order Inquiry">
                    Custom Card Inquiry
                  </option>

                  <option value="Wedding / Bulk Cards">
                    Wedding & Bulk Suite
                  </option>

                  <option value="Order Tracking">
                    Order & Shipping Support
                  </option>

                  <option value="Other">
                    Other Question
                  </option>

                </select>

              </div>

              {/* MESSAGE */}

              <div>

                <label className="text-xs font-semibold text-[#7041A6] block mb-1">
                  Your Message *
                </label>

                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      message: e.target.value
                    });

                    setErrors({
                      ...errors,
                      message: ''
                    });
                  }}
                  placeholder="Tell us what you have in mind, special colors, or questions..."
                  maxLength={5000}
                  disabled={submitting}
                  className={`w-full px-3.5 py-2.5 text-xs bg-[#FAF7FD] border rounded-xl text-[#40334F] focus:outline-none focus:ring-2 focus:ring-[#9B72CF] resize-none ${
                    errors.message
                      ? 'border-rose-400'
                      : 'border-[#C8A2E8]'
                  }`}
                />

                {errors.message && (
                  <p className="text-[11px] text-rose-500 mt-1">
                    {errors.message}
                  </p>
                )}

              </div>

              {/* BACKEND ERROR MESSAGE */}

              {submitError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs">
                  {submitError}
                </div>
              )}

              {/* SUBMIT BUTTON */}

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-[#7041A6] hover:bg-[#9B72CF] text-white text-xs font-bold rounded-xl shadow-md shadow-[#7041A6]/20 transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >

                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Studio Message
                  </>
                )}

              </button>

            </form>

          )}

        </div>

        {/* STUDIO INFORMATION AND FAQ */}

        <div className="lg:col-span-5 space-y-6">

          {/* STUDIO CONTACT CARD */}

          <div className="bg-white rounded-3xl p-6 border border-[#E9DDF7] shadow-sm space-y-4 text-xs">

            <h3 className="font-serif text-lg font-bold text-[#40334F]">
              Atelier Information
            </h3>

            <div className="space-y-3">

              {/* EMAIL */}

              <div className="flex items-start gap-3">

                <div className="w-8 h-8 rounded-lg bg-[#F3ECFA] text-[#7041A6] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>

                <div>
                  <p className="font-bold text-[#40334F]">
                    Direct Email
                  </p>

                  <p className="text-[#81758F] break-all">
                    {contactValue(storeSettings.email)}
                  </p>
                </div>

              </div>

              {/* PHONE */}

              <div className="flex items-start gap-3">

                <div className="w-8 h-8 rounded-lg bg-[#F3ECFA] text-[#7041A6] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>

                <div>
                  <p className="font-bold text-[#40334F]">
                    Call & WhatsApp
                  </p>

                  <p className="text-[#81758F]">
                    {contactValue(storeSettings.phone)}
                  </p>
                </div>

              </div>

              {/* ADDRESS */}

              <div className="flex items-start gap-3">

                <div className="w-8 h-8 rounded-lg bg-[#F3ECFA] text-[#7041A6] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>

                <div>
                  <p className="font-bold text-[#40334F]">
                    Studio Location
                  </p>

                  <p className="text-[#81758F]">
                    {contactValue(storeSettings.address)}
                  </p>
                </div>

              </div>

              {/* WORKING HOURS */}

              <div className="flex items-start gap-3">

                <div className="w-8 h-8 rounded-lg bg-[#F3ECFA] text-[#7041A6] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>

                <div>
                  <p className="font-bold text-[#40334F]">
                    Studio Working Hours
                  </p>

                  <p className="text-[#81758F]">
                    {contactValue(storeSettings.workingHours)}
                  </p>
                </div>

              </div>

            </div>
          </div>

          {/* FAQ ACCORDION */}

          <div className="bg-white rounded-3xl p-6 border border-[#E9DDF7] shadow-sm space-y-3">

            <h3 className="font-serif text-lg font-bold text-[#40334F]">
              Frequently Asked Questions
            </h3>

            <div className="divide-y divide-[#F3ECFA] text-xs">

              {faqs.map((faq, idx) => (

                <div key={idx} className="py-2.5">

                  <button
                    type="button"
                    onClick={() =>
                      setOpenFaq(openFaq === idx ? -1 : idx)
                    }
                    className="w-full flex items-center justify-between text-left font-semibold text-[#40334F] hover:text-[#7041A6]"
                  >

                    <span>{faq.q}</span>

                    {openFaq === idx ? (
                      <ChevronUp className="w-4 h-4 text-[#7041A6] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#81758F] shrink-0" />
                    )}

                  </button>

                  {openFaq === idx && (
                    <p className="text-[#81758F] mt-2 leading-relaxed text-[11px] animate-fadeIn">
                      {faq.a}
                    </p>
                  )}

                </div>

              ))}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
