import Image from "next/image";

export function HeroSection() {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="hero-media" aria-hidden="true">
        <Image className="hero-image" src="/images/wedding-storyboard.png" alt="" fill priority unoptimized sizes="100vw" />
      </div>
      <div className="container hero-content">
        <div className="hero-copy">
          <p className="eyebrow">Bali Wedding Content Creator</p>
          <h1 className="display" id="hero-title">Your Love, Beautifully Remembered</h1>
          <p className="hero-support">Natural, emotional, and social-ready wedding content created for couples celebrating their love in Bali.</p>
          <div className="hero-actions">
            <a className="button button--light" href="#contact">Check Your Date</a>
            <a className="button button--outline" href="#portfolio">View Our Stories</a>
          </div>
        </div>
      </div>
      <span className="hero-note">Scroll to discover</span>
    </section>
  );
}
