"use client";

import { useState } from "react";
import styles from "@/app/page.module.css";

const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("sending");
    setError("");

    if (data.get("company")) {
      form.reset();
      setStatus("sent");
      return;
    }

    if (!ACCESS_KEY) {
      setStatus("error");
      setError("Contact form is not configured yet.");
      return;
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          subject: `Portfolio message from ${data.get("name")}`,
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
