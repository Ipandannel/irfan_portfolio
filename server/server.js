import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express(); // ✅ Define app first
app.use(cors());
app.use(express.json());

const clientDist = path.join(__dirname, "../client/dist");
app.use(express.static(clientDist));

app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) return res.status(404).send("Not found");
  res.sendFile(path.join(clientDist, "index.html"));
});

console.log("Booting API from:", import.meta.url);

const resend = new Resend(process.env.RESEND_API_KEY);

// 10 requests / 10 minutes per IP (tweak as needed)
const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

const visitLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 30,                   // at most 30 visit emails per IP per 10min
  standardHeaders: true,
  legacyHeaders: false,
});
async function geolocateIp(ip) {
  try {
    if (!ip) return null;
    // Use the first IP if there's a list (proxies)
    const clean = ip.split(",")[0].trim();
    // If it's a private/localhost, skip lookup
    if (/^(::1|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(clean)) return null;

    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 2500); // 2.5s timeout
    const resp = await fetch(`https://ipapi.co/${clean}/json/`, { signal: ctl.signal });
    clearTimeout(t);
    if (!resp.ok) return null;
    const d = await resp.json();
    return {
      ip: clean,
      city: d.city || null,
      region: d.region || null,
      country: d.country_name || d.country || null,
      org: d.org || d.asn || null,
    };
  } catch {
    return null;
  }
}

app.post("/api/visit", visitLimiter, async (req, res) => {
  try {
    const { name, at, path: pagePath } = req.body || {};
    const ts = at || new Date().toISOString();
    const ipHeader = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
    const ua = req.get("User-Agent") || "";
    const ref = req.get("Referer") || req.get("Referrer") || "";

    const geo = await geolocateIp(ipHeader);

    await resend.emails.send({
      from: process.env.CONTACT_FROM,
      to: process.env.CONTACT_TO,
      subject: `Site visit${name ? ` — ${String(name).slice(0,120)}` : " — anonymous"} @ ${ts}`,
      html: `
        <div style="font-family: ui-sans-serif, -apple-system, Segoe UI, Roboto, Arial;">
          <h2 style="margin:0 0 8px;">New website visit</h2>
          <p><b>Time:</b> ${ts}</p>
          <p><b>Name:</b> ${name ? String(name).slice(0,120) : "—"}</p>
          <p><b>Page:</b> ${pagePath || "unknown"}</p>
          <p><b>Referrer:</b> ${ref || "—"}</p>
          <p><b>User-Agent:</b> ${ua}</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:12px 0;" />
          <p><b>Approx. location:</b> ${
            geo ? [geo.city, geo.region, geo.country].filter(Boolean).join(", ") : "—"
          }</p>
          <p><b>Network:</b> ${geo?.org || "—"}</p>
        </div>
      `,
    });

    res.json({ ok: true });
  } catch (e) {
    console.error("VISIT EMAIL ERROR:", e);
    res.status(500).json({ error: "Failed to send visit email" });
  }
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



