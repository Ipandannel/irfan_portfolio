import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientDist = path.join(__dirname, "../client/dist");
app.use(express.static(clientDist));

app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) return res.status(404).send("Not found");
  res.sendFile(path.join(clientDist, "index.html"));
});

console.log("Booting API from:", import.meta.url);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

// 10 requests / 10 minutes per IP (tweak as needed)
const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

app.post("/api/contact", contactLimiter, async (req, res) => {
  try {
    const { name, email, message, subject, phone, website } = req.body || {};

    // Honeypot: if 'website' (hidden field) is filled, it's likely a bot
    if (website) return res.json({ ok: true });

    // Minimal validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing fields" });
    }
    const clean = (s = "") => String(s).toString().slice(0, 5000);
    const safeName = clean(name);
    const safeEmail = clean(email);
    const safeMessage = clean(message);
    const safeSubject = clean(subject || "New portfolio contact");
    const safePhone = clean(phone || "—");

    // Email to YOU (CONTACT_TO)
    await resend.emails.send({
      from: process.env.CONTACT_FROM,        // e.g. onboarding@resend.dev (for testing) or verified domain
      to: process.env.CONTACT_TO,            // your inbox
      reply_to: safeEmail,
      subject: `Portfolio contact — ${safeName}: ${safeSubject}`,
      html: `
        <div style="font-family: ui-sans-serif, -apple-system, Segoe UI, Roboto, Arial; color:#0b0f14;">
          <h2 style="margin:0 0 8px;">New message from ${escapeHtml(safeName)}</h2>
          <p style="margin:0 0 2px;"><b>Email:</b> ${escapeHtml(safeEmail)}</p>
          <p style="margin:0 0 2px;"><b>Phone:</b> ${escapeHtml(safePhone)}</p>
          <p style="margin:12px 0 6px;"><b>Subject:</b> ${escapeHtml(safeSubject)}</p>
          <pre style="white-space:pre-wrap;background:#f6f8fa;padding:12px;border-radius:8px;border:1px solid #e5e7eb;font-family: ui-monospace, SFMono-Regular, Menlo, Consolas;">
${escapeHtml(safeMessage)}
          </pre>
        </div>
      `,
    });

    // Optional: Auto-reply to the sender (comment out if you don't want it)
    await resend.emails.send({
      from: process.env.CONTACT_FROM,
      to: safeEmail,
      subject: `Thanks, ${safeName}! I’ve received your message`,
      html: `
        <div style="font-family: ui-sans-serif, -apple-system, Segoe UI, Roboto, Arial; color:#0b0f14;">
          <p>Hi ${escapeHtml(safeName)},</p>
          <p>Thanks for reaching out — I’ve received your message and will reply soon.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:12px 0;" />
          <p><b>Your message:</b></p>
          <pre style="white-space:pre-wrap;background:#f6f8fa;padding:12px;border-radius:8px;border:1px solid #e5e7eb;font-family: ui-monospace, SFMono-Regular, Menlo, Consolas;">
${escapeHtml(safeMessage)}
          </pre>
          <p style="margin-top:12px;">— Irfan</p>
        </div>
      `,
    });

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Email failed" });
  }
});

// Helper to avoid HTML injection in emails
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const PORT = process.env.PORT || 5174;
app.get("/api/health", (req, res) =>
  res.json({ ok: true, time: new Date().toISOString() })
);
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
