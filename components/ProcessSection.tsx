const steps = [
  { title: "Send Your Inquiry", copy: "Tell us your date, venue, and the kind of celebration you are planning." },
  { title: "Check Availability", copy: "We will confirm your date and recommend coverage that fits your day." },
  { title: "Plan Your Content", copy: "We align on your timeline, priorities, and the moments you want remembered." },
  { title: "Celebrate & Receive", copy: "Be fully present, then relive selected memories while the feeling is still fresh." },
];

export function ProcessSection() {
  return (
    <section className="section process" id="process" aria-labelledby="process-title">
      <div className="container">
        <div className="section-head"><div><p className="eyebrow">How it works</p><h2 className="section-title" id="process-title">Simple from hello to happily ever after</h2></div><p className="section-copy">A calm, collaborative process so the content feels natural and the planning feels effortless.</p></div>
        <div className="process-grid">{steps.map((step, index) => <article className="process-step" key={step.title}><span className="process-number">{index + 1}</span><h3>{step.title}</h3><p>{step.copy}</p></article>)}</div>
      </div>
    </section>
  );
}
