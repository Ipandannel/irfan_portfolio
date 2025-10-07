import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * VisitTracker
 * - Shows a one-time-per-session modal asking for an optional name.
 * - Sends POST /api/visit with { name?, at, path }.
 * - Remembers chosen name in localStorage; remembers the "visit sent" in sessionStorage.
 */
export default function VisitTracker() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    // If we've already pinged this session, do nothing
    if (sessionStorage.getItem("visitPingSent")) return;

    // If we already know their name from a previous visit, auto-send silently
    const saved = localStorage.getItem("visitorName") || "";
    if (saved) {
      sendPing(saved);
      return;
    }

    // Otherwise show the modal
    setOpen(true);
  }, []);

  useEffect(() => {
    if (open) {
      // focus the input when modal opens
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  function sendPing(optionalName) {
    // Guard: prevent double sends
    if (sessionStorage.getItem("visitPingSent")) return;

    fetch("/api/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: optionalName || null,
        at: new Date().toISOString(),
        path: window.location.pathname,
      }),
    }).catch(() => { /* ignore network errors for this non-critical ping */ });

    sessionStorage.setItem("visitPingSent", "1");
  }

  function handleConfirm(e) {
    e?.preventDefault?.();
    const trimmed = name.trim();
    if (trimmed) {
      localStorage.setItem("visitorName", trimmed);
      sendPing(trimmed);
    } else {
      // no name provided, still send
      sendPing(null);
    }
    setOpen(false);
  }

  function handleSkip() {
    sendPing(null);
    setOpen(false);
  }

  // Close on Escape
  useEffect(() => {
    function onKey(e) {
      if (!open) return;
      if (e.key === "Escape") handleSkip();
      if (e.key === "Enter" && document.activeElement === inputRef.current) handleConfirm(e);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, name]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="vt-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden
          />

          {/* Modal */}
          <motion.div
            className="vt-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="vt-title"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <h3 id="vt-title" className="vt-title">Say hello 👋 (optional)</h3>
            <p className="vt-sub">
              Leave your name so Irfan knows who visited. You can also skip.
            </p>

            <form onSubmit={handleConfirm} className="vt-form">
              <input
                ref={inputRef}
                type="text"
                placeholder="Your name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="vt-input"
                aria-label="Your name"
              />

              <div className="vt-actions">
                <button type="button" className="btn ghost" onClick={handleSkip}>
                  Skip
                </button>
                <button type="submit" className="btn">
                  Notify Irfan
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
