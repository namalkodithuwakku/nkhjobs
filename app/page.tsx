"use client";

import { useEffect, useState } from "react";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

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
        <div className="header-actions"><a className="text-button" href="/auth">Sign in</a><a className="button small" href="/auth">Join free</a></div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow">AI-powered hospitality matching</div>
          <h1>Find hospitality jobs and talent with clarity.</h1>
          <p className="hero-text">Reviewed profiles. Relevant matches. Less searching.</p>
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
            <div className="hire-cta"><div><strong>Post your first job free</strong><span>Then only LKR 1,000 per 30-day vacancy.</span></div><a className="button" href="/auth">Post a job <span>→</span></a></div>
          )}
          <div className="trust-row"><span><b>✓</b> Reviewed listings</span><span><b>✓</b> Private CVs</span><span><b>✓</b> Explainable AI matches</span></div>
        </div>

        <div className="hero-visual" aria-label="Hospitality job platform summary">
          <div className="hero-summary">
            <h2>Built for faster, clearer hospitality hiring.</h2>
            <p>Hotels find qualified people. Job seekers discover roles that fit.</p>
            <div className="summary-grid">
              <article><strong>94%</strong><span>Top profile match</span></article>
              <article><strong>12</strong><span>Relevant job matches</span></article>
              <article><strong>100%</strong><span>Human reviewed</span></article>
              <article><strong>Private</strong><span>Candidate CV access</span></article>
            </div>
          </div>
        </div>
      </section>

      <section className="section jobs-section" id="jobs">
        <div className="section-heading"><div><span className="section-kicker">SMART JOB DISCOVERY</span><h2>{searched && query ? `Best matches for “${query}”` : "Opportunities that fit you"}</h2><p>Reviewed and ranked for your profile.</p></div><button className="outline-button">Browse all jobs →</button></div>
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
          <div className="split-copy"><span className="section-kicker">FOR HOTELIERS</span><h2>Meet people who fit.</h2><p>Post once. Receive a ranked, qualified shortlist.</p><ul><li><b>01</b><span><strong>First post free</strong>Then LKR 1,000 per 30 days.</span></li><li><b>02</b><span><strong>Applications included</strong>View every applicant profile.</span></li><li><b>03</b><span><strong>Qualified candidates</strong>Essential criteria filter the list.</span></li></ul><a className="button" href="/auth">Start hiring free →</a></div>
        <div className="dashboard-preview"><div className="preview-bar"><span></span><span></span><span></span><b>Candidate matches</b></div><div className="preview-body"><aside><i></i><i></i><i></i><i></i></aside><div className="preview-content"><small>FRONT OFFICE EXECUTIVE</small><h3>18 qualified candidates</h3>{[94,89,84].map((n,i)=><div className="person-row" key={n}><span className="avatar small">{["AM","DN","SK"][i]}</span><div><b>{["A. Mendis","D. Niroshan","S. Kumari"][i]}</b><small>{["5 years · Galle","4 years · Matara","3 years · Colombo"][i]}</small></div><strong>{n}%</strong></div>)}</div></div></div>
      </section>

      <section className="section how" id="how"><span className="section-kicker">SIMPLE BY DESIGN</span><h2>Three steps to a better match</h2><div className="steps"><article><b>1</b><h3>Create</h3><p>Upload a CV or post a job.</p></article><article><b>2</b><h3>Get reviewed</h3><p>Our team checks every profile.</p></article><article><b>3</b><h3>Match</h3><p>See qualified, AI-ranked results.</p></article></div></section>

      <section className="proof"><p>Built for Sri Lanka’s hospitality community</p><div><span>HOTELS</span><span>RESORTS</span><span>VILLAS</span><span>RESTAURANTS</span><span>TOURISM</span></div></section>

      <section className="section pricing" id="pricing"><div><span className="section-kicker">CLEAR PRICING</span><h2>First post free. Then pay per post.</h2></div><div className="price-card"><span>VERIFIED HOTELIERS</span><div className="price-row"><strong>First job</strong><b>FREE</b></div><div className="price-row"><strong>Next jobs</strong><b>LKR 1,000<small>/ 30 days</small></b></div><p>Bank transfer · WhatsApp verification</p><a className="button" href="/auth">Create hotel profile →</a></div></section>

      <footer><a className="brand inverse" href="#top"><span className="brand-mark">NK</span><span><strong>N K Hospitality</strong><small>JOBS</small></span></a><p>The smarter way to hire and get hired in hospitality.</p><div><a href="#jobs">Jobs</a><a href="#talent">Employers</a><a href="#pricing">Pricing</a><a href="#">Privacy</a></div><small>© 2026 N K Hotels · Simplifying Life</small></footer>

      <MobileInstallPrompt />
      <nav className="mobile-nav" aria-label="Mobile navigation"><a className="active" href="#top"><span>⌂</span>Home</a><a href="#jobs"><span>⌕</span>Jobs</a><button><span>＋</span>Join</button><a href="#how"><span>♡</span>Saved</a><a href="#"><span>◎</span>Profile</a></nav>
    </main>
  );
}

function MobileInstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    const mobile = window.matchMedia("(max-width: 720px)").matches;
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone;
    const dismissed = sessionStorage.getItem("nkh-install-dismissed");
    if (!mobile || standalone || dismissed) return;

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIsIOS(ios);
    const timer = window.setTimeout(() => { if (ios) setShow(true); }, 1800);
    const capture = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as InstallPromptEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", capture);
    return () => { window.clearTimeout(timer); window.removeEventListener("beforeinstallprompt", capture); };
  }, []);

  const close = () => { sessionStorage.setItem("nkh-install-dismissed", "1"); setShow(false); };
  const install = async () => {
    if (!promptEvent) return;
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    if (choice.outcome === "accepted") setShow(false);
    setPromptEvent(null);
  };

  if (!show) return null;
  return <aside className="install-prompt" aria-label="Install N K Hospitality Jobs">
    <button className="install-close" onClick={close} aria-label="Close install prompt">×</button>
    <span className="install-icon">NK</span>
    <div><strong>Install N K Hospitality Jobs</strong><p>{isIOS ? "Tap Share, then Add to Home Screen." : "Faster access from your home screen."}</p></div>
    {isIOS ? <button className="install-later" onClick={close}>Got it</button> : <button className="install-action" onClick={install}>Install</button>}
  </aside>;
}
