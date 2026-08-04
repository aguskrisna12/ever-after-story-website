import Image from "next/image";
import { portfolioStories } from "@/content/portfolio";
import { siteConfig } from "@/content/site-config";

export function PortfolioSection() {
  return (
    <section className="section portfolio" id="portfolio" aria-labelledby="portfolio-title">
      <div className="container">
        <div className="section-head">
          <div><p className="eyebrow">Recent stories</p><h2 className="section-title" id="portfolio-title">Love, as it really happened</h2></div>
          <p className="section-copy">Quiet anticipation, happy tears, and the celebration in between—captured with a warm, observant eye.</p>
        </div>
        <div className="portfolio-grid">
          {portfolioStories.map((story) => (
            <article className="portfolio-item" key={story.couple}>
              <div className="portfolio-media"><Image className="portfolio-image" src="/images/wedding-storyboard.png" alt={story.alt} fill unoptimized sizes="(max-width: 680px) 100vw, (max-width: 960px) 50vw, 33vw" /></div>
              <div className="portfolio-meta"><h3 className="portfolio-title">{story.couple}</h3><p className="portfolio-location">{story.location}</p><p className="portfolio-category">{story.category}</p></div>
            </article>
          ))}
        </div>
        <div className="portfolio-footer"><a className="text-link" href={siteConfig.instagramUrl} target="_blank" rel="noreferrer">See More on Instagram</a></div>
      </div>
    </section>
  );
}
