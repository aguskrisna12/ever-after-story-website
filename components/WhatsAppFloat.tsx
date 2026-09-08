import { siteConfig } from "@/content/site-config";

export function WhatsAppFloat() {
  if (!siteConfig.whatsappNumber) return null;

  const message = "Hello Ever After Story, I would like to check your availability.";
  const href = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      className="whatsapp-float"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Ever After Story on WhatsApp"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12.04 2a9.84 9.84 0 0 0-8.41 14.95L2.05 22l5.18-1.53A9.9 9.9 0 1 0 12.04 2Zm5.75 13.98c-.24.68-1.42 1.3-1.98 1.38-.51.08-1.15.11-1.86-.12-.43-.14-.99-.32-1.7-.63-2.99-1.29-4.94-4.3-5.09-4.5-.14-.2-1.21-1.61-1.21-3.07s.77-2.18 1.04-2.48c.27-.3.59-.37.79-.37h.57c.18.01.43-.07.67.51.24.58.82 2 .89 2.15.07.14.12.31.02.5-.1.2-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.61.17.29.76 1.25 1.63 2.03 1.12 1 2.06 1.31 2.36 1.46.29.15.46.12.64-.07.17-.2.74-.87.94-1.16.2-.3.4-.25.67-.15.28.1 1.73.82 2.03.97.29.15.49.22.56.34.07.12.07.69-.17 1.37Z" />
      </svg>
      <span>Chat on WhatsApp</span>
    </a>
  );
}
