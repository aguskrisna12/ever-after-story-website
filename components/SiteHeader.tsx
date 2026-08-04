"use client";

import { useEffect, useState } from "react";
import { navigation } from "@/content/site-config";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("menu-open");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`site-header${scrolled ? " scrolled" : ""}${menuOpen ? " menu-active" : ""}`}>
      <div className="container header-inner">
        <a className="brand" href="#home" aria-label="Ever After Story, home" onClick={closeMenu}>
          Ever After Story
          <small>Wedding content creator</small>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => <a className="nav-link" href={item.href} key={item.href}>{item.label}</a>)}
        </nav>
        <a className="button button--primary header-cta" href="#contact">Check Availability</a>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen((open) => !open)}>
          <span className="menu-lines" aria-hidden="true" />
        </button>
      </div>
      <nav className="mobile-panel" id="mobile-navigation" aria-label="Mobile navigation" aria-hidden={!menuOpen}>
        {navigation.map((item) => <a className="nav-link" href={item.href} key={item.href} onClick={closeMenu}>{item.label}</a>)}
        <a className="button button--primary" href="#contact" onClick={closeMenu}>Check Availability</a>
      </nav>
    </header>
  );
}
