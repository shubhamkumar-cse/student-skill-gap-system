import { Link } from "react-router-dom";

const features = [
  {
    number: "01",
    icon: "◎",
    title: "Know your skill gap",
    description: "Compare your current skills with the skills employers expect for your target role.",
  },
  {
    number: "02",
    icon: "↗",
    title: "Build your roadmap",
    description: "Turn missing skills into a clear, step-by-step learning plan you can follow.",
  },
  {
    number: "03",
    icon: "✦",
    title: "Track your growth",
    description: "Keep your progress visible and stay focused on the next milestone.",
  },
];

export default function Landing() {
  return (
    <div className="landing-page">
      <header className="landing-nav">
        <Link to="/" className="brand-lockup" aria-label="SkillPath home">
          <span className="brand-mark">S</span>
          <span className="brand-name">Skill<span>Path</span></span>
        </Link>
        <nav className="landing-nav-actions" aria-label="Main navigation">
          <a className="nav-text-link" href="#how-it-works">How it works</a>
          <Link to="/login" className="nav-login">Log in</Link>
          <Link to="/register" className="btn landing-nav-cta">Get started <span aria-hidden="true">↗</span></Link>
        </nav>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> YOUR CAREER, WITH A CLEAR DIRECTION</div>
            <h1>Turn the skills you have into the <span>career you want.</span></h1>
            <p className="hero-description">
              Discover what your dream role requires, find the skills you’re missing,
              and follow a personalized roadmap to get career-ready.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn hero-primary">Create your free account <span aria-hidden="true">→</span></Link>
              <Link to="/login" className="hero-secondary">I already have an account <span aria-hidden="true">↗</span></Link>
            </div>
            <div className="hero-proof">
              <div className="proof-avatars" aria-hidden="true"><span>S</span><span>J</span><span>A</span></div>
              <div><strong>Small steps. Real progress.</strong><span>One focused plan for your next move.</span></div>
            </div>
          </div>

          <div className="hero-visual" aria-label="Illustration of a career skills dashboard">
            <div className="visual-orbit orbit-one" />
            <div className="visual-orbit orbit-two" />
            <div className="floating-tag tag-top"><span className="tag-icon">✦</span><span><strong>Career clarity</strong><small>Your next step, simplified</small></span></div>
            <div className="preview-window">
              <div className="preview-topbar"><div className="preview-dots"><i /><i /><i /></div><span>YOUR SKILL SNAPSHOT</span><span className="preview-live"><i /> LIVE PLAN</span></div>
              <div className="preview-content">
                <div className="preview-greeting"><div><span className="preview-kicker">YOUR CAREER JOURNEY</span><h3>Java Developer</h3><p>A little progress every day adds up.</p></div><div className="preview-avatar">JD</div></div>
                <div className="match-panel"><div><span>SKILL MATCH</span><strong>72<small>%</small></strong><em>Great start — keep going</em></div><div className="match-ring"><div className="match-ring-inner"><strong>72%</strong><small>matched</small></div></div></div>
                <div className="preview-skills-title"><strong>Your learning focus</strong><span>2 skills to explore</span></div>
                <div className="preview-skill"><span className="skill-icon skill-icon-purple">⌘</span><div className="preview-skill-name"><strong>Spring Boot</strong><small>Backend development</small></div><span className="skill-status">In progress</span></div>
                <div className="preview-skill"><span className="skill-icon skill-icon-mint">◈</span><div className="preview-skill-name"><strong>REST API design</strong><small>System integration</small></div><span className="skill-status status-next">Up next</span></div>
                <div className="preview-progress"><div><span>Weekly momentum</span><strong>4 of 5 days</strong></div><div className="mini-progress"><i /></div></div>
              </div>
            </div>
            <div className="floating-tag tag-bottom"><span className="check-bubble">✓</span><span><strong>Progress feels good.</strong><small>Keep your momentum going</small></span></div>
          </div>
          <div className="hero-glow" />
        </section>

        <section className="trust-strip">
          <span>MADE FOR YOUR NEXT CHAPTER</span>
          <div><span>⌘ &nbsp; LEARN WITH PURPOSE</span><span>↗ &nbsp; GROW WITH CONFIDENCE</span><span>✦ &nbsp; OWN YOUR JOURNEY</span></div>
        </section>

        <section className="features-section" id="how-it-works">
          <div className="section-heading">
            <div className="eyebrow"><span className="eyebrow-dot" /> A SMARTER WAY TO GROW</div>
            <h2>Less guessing. <span>More growing.</span></h2>
            <p>Your career goals deserve more than a random list of tutorials. Start with a plan built around you.</p>
          </div>
          <div className="feature-grid">
            {features.map((feature) => (
              <article className="feature-card" key={feature.number}>
                <div className="feature-card-top"><span className="feature-icon">{feature.icon}</span><span className="feature-number">{feature.number}</span></div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <span className="feature-arrow" aria-hidden="true">↗</span>
              </article>
            ))}
          </div>
        </section>

        <section className="closing-cta">
          <div><span className="cta-spark">✦</span><h2>Your next opportunity starts with one step.</h2><p>Make today the day you get clear about what comes next.</p></div>
          <Link to="/register" className="btn hero-primary">Start your journey <span aria-hidden="true">→</span></Link>
        </section>
      </main>

      <footer className="landing-footer"><Link to="/" className="brand-lockup"><span className="brand-mark">S</span><span className="brand-name">Skill<span>Path</span></span></Link><span>Built to help students move forward with confidence.</span><span>Student Skill Gap System</span></footer>
    </div>
  );
}
