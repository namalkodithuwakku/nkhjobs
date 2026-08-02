"use client";

import { useState } from "react";

const jobs = [
  { title: "Front Office Executive", hotel: "Queens Beach Hotel", place: "Tangalle", type: "Full-time", salary: "LKR 55,000–70,000", match: 94, tag: "Front Office" },
  { title: "Reservations Executive", hotel: "Ocean Pearl Resort", place: "Galle", type: "Full-time", salary: "LKR 65,000–80,000", match: 89, tag: "Reservations" },
  { title: "Commis I – Hot Kitchen", hotel: "The Cinnamon Cove", place: "Colombo", type: "Full-time", salary: "LKR 48,000–60,000", match: 86, tag: "Kitchen" },
];

export default function Home() {
  const [role, setRole] = useState<"seeker" | "hotelier">("seeker");
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="N K Hospitality Jobs home">
          <span className="brand-mark">NK</span>
          <span><strong>N K Hospitality</strong><small>JOBS</small></span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#jobs">Find jobs</a><a href="#talent">Find talent</a><a href="#how">How it works</a><a href="#pricing">Pricing</a>
        </nav>
        <div className="header-actions"><a className="text-button" href="/portal">Sign in</a><a className="button small" href="/portal">Join free</a></div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span>AI-powered</span> Hospitality careers, better matched</div>
          <h1>The right hospitality opportunity, <em>without the guesswork.</em></h1>
          <p className="hero-text">Sri Lanka’s focused hospitality job platform. Every job and candidate profile is reviewed, then intelligently matched.</p>
          <div className="role-switch" aria-label="Choose your journey">
            <button onClick={() => setRole("seeker")} className={role === "seeker" ? "active" : ""}>I’m looking for a job</button>
            <button onClick={() => setRole("hotelier")} className={role === "hotelier" ? "active" : ""}>I’m hiring</button>
          </div>
          {role === "seeker" ? (
            <form className="hero-search" onSubmit={(e) => { e.preventDefault(); setSearched(true); document.querySelector("#jobs")?.scrollIntoView({ behavior: "smooth" }); }}>
              <label><span>Role or skill</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. Front Office, Chef" /></label>
              <label><span>Location</span><input placeholder="Any location" /></label>
              <button className="button" type="submit">Find my matches <span>→</span></button>
            </form>
          ) : (
            <div className="hire-cta"><div><strong>Post your first job free</strong><span>Then only LKR 1,000 per 30-day vacancy.</span></div><a className="button" href="/portal">Post a job <span>→</span></a></div>
          )}
          <div className="trust-row"><span><b>✓</b> Reviewed listings</span><span><b>✓</b> Private CVs</span><span><b>✓</b> Explainable AI matches</span></div>
        </div>

        <div className="hero-visual" aria-label="Example AI match">
          <div className="soft-shape"></div>
          <div className="candidate-card">
            <div className="card-top"><span className="avatar">AM</span><div><small>TOP CANDIDATE</small><strong>Assistant Front Office Manager</strong><span>5 years experience · Galle</span></div><b className="score">94%</b></div>
            <div className="match-line"><i style={{ width: "94%" }}></i></div>
            <div className="skills"><span>Opera PMS</span><span>Guest relations</span><span>English</span></div>
            <div className="ai-note"><span>✦</span><p><strong>Why this is a strong match</strong>Meets all mandatory requirements, including supervisory experience and PMS proficiency.</p></div>
            <button className="outline-button">View match details <span>→</span></button>
          </div>
          <div className="floating-pill"><span>✓</span><div><strong>Human reviewed</strong><small>Profile approved today</small></div></div>
          <div className="mini-stat"><strong>3×</strong><span>faster shortlisting</span></div>
        </div>
      </section>

      <section className="proof"><p>Built for Sri Lanka’s hospitality community</p><div><span>HOTELS</span><span>RESORTS</span><span>VILLAS</span><span>RESTAURANTS</span><span>TOURISM</span></div></section>

      <section className="section jobs-section" id="jobs">
        <div className="section-heading"><div><span className="section-kicker">SMART JOB DISCOVERY</span><h2>{searched && query ? `Best matches for “${query}”` : "Opportunities that fit you"}</h2><p>AI-ranked roles, reviewed by our team and explained in plain language.</p></div><button className="outline-button">Browse all jobs →</button></div>
        <div className="job-grid">
          {jobs.map((job) => <article className="job-card" key={job.title}>
            <div className="job-card-head"><span className="hotel-logo">{job.hotel.split(" ").slice(0,2).map(x => x[0]).join("")}</span><span className="match-badge">{job.match}% match</span></div>
            <span className="job-tag">{job.tag}</span><h3>{job.title}</h3><p className="company">{job.hotel}</p>
            <div className="job-meta"><span>⌖ {job.place}</span><span>◷ {job.type}</span><span>◈ {job.salary}</span></div>
            <div className="job-footer"><small>Reviewed · Posted 2 days ago</small><button aria-label={`Save ${job.title}`}>♡</button></div>
          </article>)}
        </div>
      </section>

      <section className="section split" id="talent">
          <div className="split-copy"><span className="section-kicker">FOR HOTELIERS</span><h2>Spend less time searching. Meet people who fit.</h2><p>Post a vacancy, define the essentials, and receive a ranked shortlist with clear reasons behind every recommendation.</p><ul><li><b>01</b><span><strong>First job post is free</strong>Every additional 30-day vacancy is only LKR 1,000.</span></li><li><b>02</b><span><strong>Applications are always included</strong>View the full profiles of candidates who apply to your vacancy.</span></li><li><b>03</b><span><strong>Quality before quantity</strong>Mandatory qualifications filter out unsuitable candidates.</span></li></ul><a className="button" href="/portal">Start hiring free →</a></div>
        <div className="dashboard-preview"><div className="preview-bar"><span></span><span></span><span></span><b>Candidate matches</b></div><div className="preview-body"><aside><i></i><i></i><i></i><i></i></aside><div className="preview-content"><small>FRONT OFFICE EXECUTIVE</small><h3>18 qualified candidates</h3>{[94,89,84].map((n,i)=><div className="person-row" key={n}><span className="avatar small">{["AM","DN","SK"][i]}</span><div><b>{["A. Mendis","D. Niroshan","S. Kumari"][i]}</b><small>{["5 years · Galle","4 years · Matara","3 years · Colombo"][i]}</small></div><strong>{n}%</strong></div>)}</div></div></div>
      </section>

      <section className="section how" id="how"><span className="section-kicker">SIMPLE BY DESIGN</span><h2>From profile to perfect match</h2><div className="steps"><article><b>1</b><h3>Create your profile</h3><p>Upload a CV or post a vacancy. AI structures the important details for you.</p></article><article><b>2</b><h3>We review it</h3><p>Every profile and job is checked before it becomes searchable or public.</p></article><article><b>3</b><h3>Meet better matches</h3><p>See ranked recommendations with transparent, practical matching reasons.</p></article></div></section>

      <section className="section pricing" id="pricing"><div><span className="section-kicker">CLEAR LAUNCH PRICING</span><h2>Start free. Pay only when you post again.</h2></div><div className="price-card"><span>FOR VERIFIED HOTELIERS</span><div className="price-row"><strong>First job</strong><b>FREE</b></div><div className="price-row"><strong>Every next job</strong><b>LKR 1,000<small>/ 30 days</small></b></div><p>Pay by bank transfer, send the receipt through WhatsApp, and we’ll verify your post.</p><a className="button" href="/portal">Create hotel profile →</a></div></section>

      <footer><a className="brand inverse" href="#top"><span className="brand-mark">NK</span><span><strong>N K Hospitality</strong><small>JOBS</small></span></a><p>The smarter way to hire and get hired in hospitality.</p><div><a href="#jobs">Jobs</a><a href="#talent">Employers</a><a href="#pricing">Pricing</a><a href="#">Privacy</a></div><small>© 2026 N K Hotels · Simplifying Life</small></footer>

      <nav className="mobile-nav" aria-label="Mobile navigation"><a className="active" href="#top"><span>⌂</span>Home</a><a href="#jobs"><span>⌕</span>Jobs</a><button><span>＋</span>Join</button><a href="#how"><span>♡</span>Saved</a><a href="#"><span>◎</span>Profile</a></nav>
    </main>
  );
}
