"use client";

import { servicePackages } from "@/content/services";

export function ServicesSection() {
  const selectPackage = (packageName: string) => {
    window.dispatchEvent(new CustomEvent<string>("select-package", { detail: packageName }));
  };

  return (
    <section className="section services" id="services" aria-labelledby="services-title">
      <div className="container">
        <div className="section-head"><div><p className="eyebrow">Ways to tell your story</p><h2 className="section-title" id="services-title">Coverage shaped around your day</h2></div><p className="section-copy">From an intimate elopement to a full destination celebration, choose the starting point that feels closest to your plans.</p></div>
        <div className="service-list">
          {servicePackages.map((service, index) => (
            <article className="service" key={service.id}>
              <span className="service-index">0{index + 1}</span>
              <div><h3>{service.name}</h3>{service.featured ? <span className="service-badge">Most requested</span> : null}</div>
              <ul>{service.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
              <a className="text-link service-action" href="#contact" onClick={() => selectPackage(service.name)}>Ask About This Package</a>
            </article>
          ))}
        </div>
        <p className="services-note">Every celebration is different. Package details can be tailored around your timeline and priorities.</p>
      </div>
    </section>
  );
}
