// /api/contact.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const { name, phone, email, message, to } = req.body || {};

    if (!name || !phone || !email || !message) {
      return res.status(400).json({ ok: false, error: "Missing fields" });
    }

    // Check for SMTP config
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      // Fallback: log message and return success for dev/local
      console.warn(
        "SMTP config missing. Logging contact form message instead of sending email.",
      );
      console.log({ name, phone, email, message });
      return res
        .status(200)
        .json({
          ok: true,
          dev: true,
          message: "SMTP config missing. Message logged only.",
        });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort || 465),
      secure: String(process.env.SMTP_SECURE || "true") === "true",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      // tls: { rejectUnauthorized: false }
    });

    const toEmail = process.env.TO_EMAIL || to || "support@signsense.io";

    const subject = `New contact form message from ${name}`;
    const text = [
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      "",
      "Message:",
      message,
    ].join("\n");

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6">
        <h2 style="margin:0 0 10px">New Contact Form Message</h2>
        <p><b>Name:</b> ${escapeHtml(name)}</p>
        <p><b>Phone:</b> ${escapeHtml(phone)}</p>
        <p><b>Email:</b> ${escapeHtml(email)}</p>
        <p><b>Message:</b><br/>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"SignSense Contact" <${smtpUser}>`,
      to: toEmail,
      subject,
      text,
      html,
      replyTo: email,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("contact.js error:", err);
    return res.status(500).json({ ok: false, error: "Email failed" });
  }
}

function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
