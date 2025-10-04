// /api/contact.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const { name, phone, email, message, to } = req.body || {};

    // Basic validation (same rules as the frontend)
    if (!name || !phone || !email || !message) {
      return res.status(400).json({ ok: false, error: "Missing fields" });
    }

    // Namecheap PrivateEmail SMTP (mail.privateemail.com)
    // Use 465 (secure) by default. If your account prefers 587, see note below.
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,       // e.g. "mail.privateemail.com"
      port: Number(process.env.SMTP_PORT || 465),
      secure: String(process.env.SMTP_SECURE || "true") === "true", // true for 465
      auth: {
        user: process.env.SMTP_USER,     // e.g. "support@signsense.io"
        pass: process.env.SMTP_PASS
      }
    });

    const toEmail = process.env.TO_EMAIL || to || "support@signsense.io";

    const subject = `New contact form message from ${name}`;
    const text = [
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      "",
      "Message:",
      message
    ].join("\n");

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6">
        <h2 style="margin:0 0 10px">New Contact Form Message</h2>
        <p><b>Name:</b> ${escapeHtml(name)}</p>
        <p><b>Phone:</b> ${escapeHtml(phone)}</p>
        <p><b>Email:</b> ${escapeHtml(email)}</p>
        <p><b>Message:</b><br/>${escapeHtml(message).replace(/\n/g,"<br/>")}</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"SignSense Contact" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject,
      text,
      html,
      replyTo: email // lets you reply directly to the sender
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("contact.js error:", err);
    return res.status(500).json({ ok: false, error: "Email failed" });
  }
}

// tiny helper to avoid HTML injection
function escapeHtml(str = "") {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
