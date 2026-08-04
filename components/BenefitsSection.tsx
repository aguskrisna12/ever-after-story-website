const benefits = [
  { title: "Real Moments", copy: "We capture spontaneous emotions, small details, and the moments happening between the main events." },
  { title: "Social-Ready Content", copy: "Receive vertical wedding content designed for Instagram, TikTok, and sharing with family and friends." },
  { title: "Fast Delivery", copy: "Relive and share selected moments while the excitement of your wedding celebration is still fresh." },
];

export function BenefitsSection() {
  return (
    <section className="section benefits" aria-labelledby="benefits-title">
      <div className="container">
        <div className="section-head"><div><p className="eyebrow">Why Ever After Story</p><h2 className="section-title" id="benefits-title">Present for every in-between moment</h2></div><p className="section-copy">A personal perspective made for the way memories are shared today—without interrupting the way your day naturally unfolds.</p></div>
        <div className="benefit-list">
          {benefits.map((benefit, index) => <article className="benefit" key={benefit.title}><span className="benefit-number">0{index + 1}</span><h3>{benefit.title}</h3><p>{benefit.copy}</p></article>)}
        </div>
      </div>
    </section>
  );
}
