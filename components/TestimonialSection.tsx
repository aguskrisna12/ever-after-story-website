import { testimonials } from "@/content/testimonials";

export function TestimonialSection() {
  return (
    <section className="section testimonials" aria-labelledby="testimonial-title">
      <div className="container">
        <div className="section-head"><div><p className="eyebrow">Kind words</p><h2 className="section-title" id="testimonial-title">Memories felt, not staged</h2></div><p className="section-copy">A glimpse of the experience we want every couple to have: relaxed, personal, and full of feeling.</p></div>
        <div className="testimonial-grid">{testimonials.map((item) => <figure className="testimonial" key={item.couple}><blockquote>“{item.quote}”</blockquote><figcaption><cite>{item.couple}<span>{item.location}</span></cite></figcaption></figure>)}</div>
      </div>
    </section>
  );
}
