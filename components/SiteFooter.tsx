import { navigation, siteConfig } from "@/content/site-config";

export function SiteFooter() {
  const whatsappUrl = siteConfig.whatsappNumber ? `https://wa.me/${siteConfig.whatsappNumber}` : "";
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand"><strong>{siteConfig.name}</strong><span>{siteConfig.tagline} · {siteConfig.location}</span></div>
        <nav className="footer-nav" aria-label="Footer navigation">{navigation.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}</nav>
        <div className="footer-socials"><a href={siteConfig.instagramUrl} target="_blank" rel="noreferrer">Instagram</a>{whatsappUrl ? <a href={whatsappUrl} target="_blank" rel="noreferrer">WhatsApp</a> : null}</div>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} Ever After Story</span><span>Wedding content, thoughtfully captured in Bali.</span></div>
    </footer>
  );
}
