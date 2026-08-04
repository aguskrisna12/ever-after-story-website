"use client";

import { FormEvent, useEffect, useState } from "react";
import { servicePackages } from "@/content/services";
import { siteConfig } from "@/content/site-config";

type FormFields = "name" | "email" | "date" | "package" | "message" | "consent";
type FormErrors = Partial<Record<FormFields, string>>;

export function ContactSection() {
  const [selectedPackage, setSelectedPackage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState("");

  useEffect(() => {
    const onSelectPackage = (event: Event) => setSelectedPackage((event as CustomEvent<string>).detail);
    window.addEventListener("select-package", onSelectPackage);
    return () => window.removeEventListener("select-package", onSelectPackage);
  }, []);

  const submitInquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const nextErrors: FormErrors = {};
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const date = String(data.get("date") ?? "").trim();
    const packageInterest = String(data.get("package") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    if (!name) nextErrors.name = "Please share your name.";
    if (!email) nextErrors.email = "Please share your email.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = "Please enter a valid email address.";
    if (!date) nextErrors.date = "Please select your wedding date.";
    if (!packageInterest) nextErrors.package = "Please select a package interest.";
    if (!message) nextErrors.message = "Please tell us a little about your celebration.";
    if (!data.get("consent")) nextErrors.consent = "Please agree before continuing.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("Please review the highlighted fields.");
      requestAnimationFrame(() => form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
      return;
    }
    if (!siteConfig.whatsappNumber) {
      setStatus("WhatsApp is not configured yet. Please message us on Instagram instead.");
      return;
    }
    const lines = [
      "Hello Ever After Story, I would love to check your availability.", "",
      `Name: ${name}`, `Partner: ${String(data.get("partner") ?? "").trim() || "—"}`,
      `Email: ${email}`, `WhatsApp: ${String(data.get("whatsapp") ?? "").trim() || "—"}`,
      `Wedding date: ${date}`, `Venue / location: ${String(data.get("venue") ?? "").trim() || "—"}`,
      `Package interest: ${packageInterest}`, "", "Our plans:", message,
    ];
    const popup = window.open(`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener,noreferrer");
    if (!popup) setStatus("We could not open WhatsApp. Please allow pop-ups or message us on Instagram.");
  };

  const invalid = (field: FormFields) => Boolean(errors[field]);

  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="container contact-layout">
        <div className="contact-aside"><p className="eyebrow">Start your story</p><h2 className="section-title" id="contact-title">Let’s Tell Your Love Story</h2><p className="section-copy">Share your wedding date and plans with us. We would love to hear your story and check our availability.</p><a className="text-link instagram-link" href={siteConfig.instagramUrl} target="_blank" rel="noreferrer">Message Us on Instagram</a></div>
        <form className="inquiry-form" noValidate onSubmit={submitInquiry}>
          <FormField label="Your name" name="name" required error={errors.name} invalid={invalid("name")} placeholder="Your name" />
          <FormField label="Partner’s name" name="partner" placeholder="Partner’s name" />
          <FormField label="Email" name="email" type="email" required error={errors.email} invalid={invalid("email")} placeholder="you@example.com" />
          <FormField label="WhatsApp number" name="whatsapp" type="tel" placeholder="Include country code" />
          <FormField label="Wedding date" name="date" type="date" required error={errors.date} invalid={invalid("date")} />
          <FormField label="Wedding venue or location" name="venue" placeholder="Venue, area, or undecided" />
          <div className="field field--full"><label htmlFor="package">Package interest *</label><select id="package" name="package" required value={selectedPackage} aria-invalid={invalid("package")} aria-describedby="package-error" onChange={(event) => setSelectedPackage(event.target.value)}><option value="">Select a starting point</option>{servicePackages.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}</select><p className="field-error" id="package-error">{errors.package}</p></div>
          <div className="field field--full"><label htmlFor="message">Tell us about your day *</label><textarea id="message" name="message" required placeholder="Your plans, priorities, and anything you would love us to know" aria-invalid={invalid("message")} aria-describedby="message-error" /><p className="field-error" id="message-error">{errors.message}</p></div>
          <div className="consent"><input id="consent" name="consent" type="checkbox" aria-invalid={invalid("consent")} aria-describedby="consent-error" /><label htmlFor="consent">I agree for Ever After Story to use these details to respond to my inquiry via WhatsApp or email.</label></div>
          {errors.consent ? <p className="field-error field--full" id="consent-error">{errors.consent}</p> : null}
          <div className="form-actions"><button className="button button--light" type="submit">Send Inquiry via WhatsApp</button><span>or</span><a className="text-link" href={siteConfig.instagramUrl} target="_blank" rel="noreferrer">Message Us on Instagram</a></div>
          <p className="form-status" role="alert" aria-live="polite">{status}</p>
        </form>
      </div>
    </section>
  );
}

interface FormFieldProps { label: string; name: string; type?: string; placeholder?: string; required?: boolean; error?: string; invalid?: boolean; }
function FormField({ label, name, type = "text", placeholder, required, error, invalid }: FormFieldProps) {
  const errorId = `${name}-error`;
  return <div className="field"><label htmlFor={name}>{label}{required ? " *" : ""}</label><input id={name} name={name} type={type} placeholder={placeholder} required={required} aria-invalid={invalid} aria-describedby={error ? errorId : undefined} /><p className="field-error" id={errorId}>{error}</p></div>;
}
