// client/src/components/Contact.jsx
import { useState } from "react";
import confetti from "canvas-confetti";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5174";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    phone: "",
    message: "",
    website: "" // honeypot (hidden)
  });
  const [status, setStatus] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setStatus("ok");
      setForm({ name:"", email:"", subject:"", phone:"", message:"", website:"" });
      confetti({ particleCount: 90, spread: 60, startVelocity: 35, scalar: .8, origin: { y: 0.2 } });
    } catch (err) {
      setStatus(`error:${err.message}`);
    }
  }

  return (
    <section id="contact" className="section">
      <div className="card" style={{ maxWidth: 680 }}>
        <h2 style={{ marginTop: 0 }}>Contact me</h2>
        <p className="small">Let’s build something great together.</p>

        <form onSubmit={submit} style={{ marginTop: 12, display:"grid", gap:12 }}>
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            placeholder="Subject (optional)"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          />
          <input
            placeholder="Phone (optional)"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          {/* Honeypot: stays hidden; bots often fill it */}
          <input
            style={{ position: "absolute", left: "-9999px" }}
            tabIndex="-1"
            autoComplete="off"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            placeholder="Your website"
          />
          <textarea
            rows={5}
            placeholder="Your message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
          />
          <button type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending..." : "Send"}
          </button>
          {status === "ok" && <p className="small">Thanks — I’ll get back to you soon.</p>}
          {status?.startsWith("error") && (
            <p className="small" style={{ color: "#ffb4b4" }}>
              {status.replace("error:", "")}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
