
import express from "express";
import nodemailer from "nodemailer";
import rateLimit from "express-rate-limit";
import StoreSetting from "../models/storeSetting.js";

const router = express.Router();

// ========================================
// CONTACT FORM RATE LIMIT
// ========================================

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: {
    success: false,
    message: "Too many messages. Please try again later."
  }
});

// ========================================
// ESCAPE HTML CONTENT
// ========================================

const escapeHTML = (value = "") =>
  String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);

// ========================================
// CONTACT FORM API
// ========================================

router.post("/", contactLimiter, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required."
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanMessage = message.trim();
    const cleanSubject =
      typeof subject === "string" && subject.trim()
        ? subject.trim().slice(0, 150).replace(/[\r\n]/g, " ")
        : "General Inquiry";

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address."
      });
    }

    // Validate lengths
    if (
      cleanName.length > 100 ||
      cleanEmail.length > 254 ||
      cleanMessage.length < 10 ||
      cleanMessage.length > 5000
    ) {
      return res.status(400).json({
        success: false,
        message: "Please check the length of your form details."
      });
    }

    // ========================================
    // GET LATEST CONTACT EMAIL FROM MONGODB
    // ========================================

    const storeSettings = await StoreSetting.findOne();

    const recipientEmail = storeSettings?.email?.trim();

    if (!recipientEmail) {
      return res.status(500).json({
        success: false,
        message: "Please configure your contact email in Website Settings."
      });
    }

    // Validate configured recipient
    if (!emailPattern.test(recipientEmail)) {
      throw new Error("The contact email in Website Settings is invalid.");
    }

    // ========================================
    // CHECK SMTP CONFIGURATION
    // ========================================

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error("SMTP_USER or SMTP_PASS is missing.");
    }

    // ========================================
    // CREATE EMAIL TRANSPORTER
    // ========================================

    const smtpPort = Number(process.env.SMTP_PORT || 587);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // ========================================
    // PREPARE EMAIL
    // ========================================

    const safeName = escapeHTML(cleanName);
    const safeEmail = escapeHTML(cleanEmail);
    const safeSubject = escapeHTML(cleanSubject);
    const safeMessage = escapeHTML(cleanMessage);

    // ========================================
    // SEND EMAIL
    // ========================================

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,

      // Automatically uses the latest email saved in MongoDB
      to: recipientEmail,

      // Reply directly to the customer
      replyTo: cleanEmail,

      subject: `ArtStudio Contact: ${cleanSubject}`,

      text: `
New message from your ArtStudio website.

Name: ${cleanName}
Customer Email: ${cleanEmail}
Subject: ${cleanSubject}

Message:
${cleanMessage}
      `,

      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #7041A6;">
            New ArtStudio Contact Message
          </h2>

          <p><strong>Customer Name:</strong> ${safeName}</p>

          <p><strong>Customer Email:</strong> ${safeEmail}</p>

          <p><strong>Subject:</strong> ${safeSubject}</p>

          <hr />

          <h3>Customer Message:</h3>

          <p style="line-height: 1.7;">
            ${safeMessage.replace(/\n/g, "<br>")}
          </p>

          <hr />

          <p style="color: #888; font-size: 12px;">
            Sent through the ArtStudio Contact Us page.
          </p>
        </div>
      `
    });

    console.log("Contact email sent successfully!");
    console.log("Recipient:", recipientEmail);
    console.log("Message ID:", info.messageId);

    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully!"
    });

  } catch (error) {
    console.error("Contact email error:", error);

    return res.status(500).json({
      success: false,
      message: "Your message could not be sent. Please try again later."
    });
  }
});

export default router;
