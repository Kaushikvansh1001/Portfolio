"use client";

import { useState } from "react";
import styles from "@/app/page.module.css";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          company: data.get("company"),
        }),
      });

      const result = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !result.ok) {
        setStatus("error");
        setError(result.error || "Could not send the message.");
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
    <form className={styles.contactForm} onSubmit={onSubmit}>
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className={styles.contactHoneypot}
        aria-hidden="true"
      />
      <input
        className={styles.contactInput}
        type="text"
        name="name"
        placeholder="Name"
        required
        minLength={2}
        autoComplete="name"
      />
      <input
        className={styles.contactInput}
        type="email"
        name="email"
        placeholder="Email"
        required
        autoComplete="email"
      />
      <textarea
        className={`${styles.contactInput} ${styles.contactTextarea}`}
        name="message"
        placeholder="Message"
        required
        minLength={10}
        rows={6}
      />
      <button className={styles.contactSubmit} type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : "Submit"}
      </button>
      {status === "sent" ? (
        <p className={styles.contactStatus}>Message sent. I’ll get back to you soon.</p>
      ) : null}
      {status === "error" ? (
        <p className={`${styles.contactStatus} ${styles.contactStatusError}`}>{error}</p>
      ) : null}
    </form>
  );
}
