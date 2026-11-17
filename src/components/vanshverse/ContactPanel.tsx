"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

export default function ContactPanel() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setError("");

    if (!ACCESS_KEY) {
      setStatus("error");
      setError("Contact form is not configured yet. Email me instead.");
      return;
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          subject: `VANSHVERSE message from ${data.get("name")}`,
          from_name: "VANSHVERSE Contact",
          botcheck: Boolean(data.get("botcheck")),
        }),
      });
      const result = (await response.json()) as { success?: boolean; message?: string };
      if (!response.ok || !result.success) {
        setStatus("error");
        setError(result.message || "Could not send the message.");
        return;
      }
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
      setError("Could not send the message. Please try email instead.");
    }
  }

  return (
    <div>
      <p className="font-mono text-[11px] tracking-[0.24em] text-gold">SEND A SIGNAL</p>
      <div className="mt-4">
      {status === "sent" ? (
        <div className="glass-panel flex flex-col items-start justify-center rounded-3xl p-8">
          <Check className="text-teal" />
          <h4 className="mt-3 font-display text-2xl">Message sent</h4>
          <p className="mt-2 text-sm text-mist/70">I&apos;ll get back to you soon.</p>
        </div>
      ) : (
        <form className="grid gap-4" onSubmit={onSubmit}>
          <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" />
          <label className="grid gap-1 text-xs uppercase tracking-[0.16em] text-mist/60">
            Name
            <input
              required
              minLength={2}
              name="name"
              autoComplete="name"
              className="rounded-2xl border border-mist/15 bg-void/50 px-4 py-3 text-sm tracking-normal text-ivory outline-none focus:border-lavender"
            />
          </label>
          <label className="grid gap-1 text-xs uppercase tracking-[0.16em] text-mist/60">
            Email
            <input
              required
              type="email"
              name="email"
              autoComplete="email"
              className="rounded-2xl border border-mist/15 bg-void/50 px-4 py-3 text-sm tracking-normal text-ivory outline-none focus:border-lavender"
            />
          </label>
          <label className="grid gap-1 text-xs uppercase tracking-[0.16em] text-mist/60">
            Message
            <textarea
              required
              minLength={10}
              name="message"
              rows={5}
              className="rounded-2xl border border-mist/15 bg-void/50 px-4 py-3 text-sm tracking-normal text-ivory outline-none focus:border-lavender"
            />
          </label>
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-void disabled:opacity-60"
          >
            {status === "sending" ? "Sending" : "Send message"}
            <ArrowRight size={16} />
          </button>
          {status === "error" ? <p className="text-sm text-red-300">{error}</p> : null}
        </form>
      )}
      </div>
    </div>
  );
}
