"use client";

import { useState } from "react";
import { IconArrow, IconCheck } from "@/components/Icons";
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
          from_name: "Portfolio Contact",
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

  if (status === "sent") {
    return (
      <div className={styles.contactForm}>
        <div className={styles.contactDone}>
          <span className={styles.contactDoneIcon} aria-hidden="true">
            <IconCheck />
          </span>
          <h4>Message sent</h4>
          <p>I&apos;ll get back to you soon.</p>
        </div>
      </div>
    );
  }

  return (
    <form className={styles.contactForm} onSubmit={onSubmit}>
      <div className={styles.contactFormHead}>
        <p className={styles.kicker}>Contact</p>
        <h3 id="talk-dialog-title">Get in touch</h3>
      </div>

      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        className={styles.contactHoneypot}
        aria-hidden="true"
      />

      <div className={styles.contactSheet}>
        <label className={styles.contactField}>
          <span>Name</span>
          <input
            className={styles.contactInput}
            type="text"
            name="name"
            placeholder=" "
            required
            minLength={2}
            autoComplete="name"
          />
        </label>
        <label className={styles.contactField}>
          <span>Email</span>
          <input
            className={styles.contactInput}
            type="email"
            name="email"
            placeholder=" "
            required
            autoComplete="email"
          />
        </label>
        <label className={styles.contactField}>
          <span>Message</span>
          <textarea
            className={`${styles.contactInput} ${styles.contactTextarea}`}
            name="message"
            placeholder=" "
            required
            minLength={10}
            rows={5}
          />
        </label>
      </div>

      <button
        className={styles.contactSubmit}
        type="submit"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending" : "Send"}
        <IconArrow />
      </button>

      {status === "error" ? (
        <p className={`${styles.contactStatus} ${styles.contactStatusError}`}>
          {error}
        </p>
      ) : null}
    </form>
  );
}
