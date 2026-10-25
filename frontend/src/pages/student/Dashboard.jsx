import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { studentApi, skillGapApi, roadmapApi } from "../../services/api";
import Loading from "../../components/Loading";
import Message from "../../components/Message";

const safeList = (value) => Array.isArray(value) ? value : [];

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [gap, setGap] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const profileData = await studentApi.getProfile();
        setProfile(profileData);
        if (profileData?.selected_career_id) {
          const gapData = await skillGapApi.analyze(profileData.selected_career_id);
          setGap(gapData);
          try {
            setRoadmap(await roadmapApi.get());
          } catch {
            setRoadmap(null);
          }
        }
      } catch (err) {
        setError(err.message || "We couldn't load your dashboard.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Loading />;

  const available = safeList(gap?.available);
  const missing = safeList(gap?.missing);
  const match = Math.max(0, Math.min(100, Number(gap?.matchPercentage) || 0));
  const progress = Math.max(0, Math.min(100, Number(roadmap?.overallProgress) || 0));
  const displayName = profile?.name || profile?.full_name || "there";

  return (
    <div className="student-dashboard">
      <div className="dashboard-heading">
        <div>
          <div className="dashboard-eyebrow">YOUR CAREER WORKSPACE</div>
          <h1>Welcome back, {displayName.split(" ")[0]} <span className="wave">✦</span></h1>
          <p>Small steps today can bring your dream career closer.</p>
        </div>
        <Link className="btn dashboard-heading-cta" to="/student/skill-gap">Analyze my skills <span>↗</span></Link>
      </div>

      <Message type="error" text={error} />

      {!profile?.selected_career_id ? (
        <section className="career-empty-panel">
          <div className="empty-illustration">✦</div>
          <div>
            <span className="dashboard-eyebrow">LET'S GET STARTED</span>
            <h2>Choose a career to build your path</h2>
            <p>Select your target role to see your skill match, identify gaps, and create a learning roadmap tailored to your goal.</p>
            <Link className="btn" to="/student/career">Choose my career <span>→</span></Link>
          </div>
        </section>
      ) : (
        <>
          <section className="dashboard-metrics">
            <article className="metric-card metric-career">
              <div className="metric-top"><span>YOUR TARGET ROLE</span><span className="metric-icon">⌘</span></div>
              <h2>{profile.selected_career_title || "Selected career"}</h2>
              <Link to="/student/career" className="metric-link">Manage career <span>↗</span></Link>
            </article>
            <article className="metric-card">
              <div className="metric-top"><span>SKILL MATCH</span><span className="metric-icon purple">◎</span></div>
              <div className="metric-number">{gap ? `${match}%` : "—"}</div>
              <div className="metric-foot"><span className="metric-dot purple-dot" /> Match with your target role</div>
            </article>
            <article className="metric-card">
              <div className="metric-top"><span>SKILLS YOU HAVE</span><span className="metric-icon green">✓</span></div>
              <div className="metric-number">{available.length}</div>
              <div className="metric-foot"><span className="metric-dot green-dot" /> Skills matching your goal</div>
            </article>
            <article className="metric-card">
              <div className="metric-top"><span>SKILLS TO LEARN</span><span className="metric-icon amber">↗</span></div>
              <div className="metric-number">{missing.length}</div>
              <div className="metric-foot"><span className="metric-dot amber-dot" /> Opportunities to grow</div>
            </article>
          </section>

          <section className="dashboard-main-grid">
            <article className="dashboard-panel skill-match-panel">
              <div className="panel-heading">
                <div><span className="dashboard-eyebrow">YOUR SKILL PROFILE</span><h2>Skill match overview</h2></div>
                <Link to="/student/skill-gap" className="panel-text-link">Full analysis ↗</Link>
              </div>
              <div className="match-overview">
                <div className="match-circle" style={{ "--match-value": `${match}%` }}>
                  <div><strong>{gap ? `${match}%` : "—"}</strong><span>matched</span></div>
                </div>
                <div className="match-summary">
                  <h3>{match >= 75 ? "You're building momentum!" : "Your next step starts here"}</h3>
                  <p>{missing.length ? `Focus on ${missing.length} skill${missing.length === 1 ? "" : "s"} to strengthen your profile for this role.` : "Keep practicing and updating your skills to stay on track."}</p>
                  <div className="skill-legend"><span><i className="legend-dot have-dot" /> Skills you have <b>{available.length}</b></span><span><i className="legend-dot need-dot" /> To learn <b>{missing.length}</b></span></div>
                </div>
              </div>
              <div className="skill-preview-list">
                {available.slice(0, 3).map((skill, index) => (
                  <div className="skill-preview-row" key={skill.id || skill.skill_id || skill.name || skill.skill_name || index}>
                    <span className="skill-preview-icon have-icon">✓</span>
                    <div className="skill-preview-copy"><strong>{skill.name || skill.skill_name || skill.title || String(skill)}</strong><span>Already in your toolkit</span></div>
                    <span className="skill-state state-have">Matched</span>
                  </div>
                ))}
                {missing.slice(0, 3).map((skill, index) => (
                  <div className="skill-preview-row" key={skill.id || skill.skill_id || skill.name || skill.skill_name || index}>
                    <span className="skill-preview-icon need-icon">＋</span>
                    <div className="skill-preview-copy"><strong>{skill.name || skill.skill_name || skill.title || String(skill)}</strong><span>Recommended for your target role</span></div>
                    <span className="skill-state state-need">To learn</span>
                  </div>
                ))}
                {!available.length && !missing.length && <p className="dashboard-muted">Run a skill-gap analysis to see your personalized skill list.</p>}
              </div>
            </article>

            <article className="dashboard-panel roadmap-panel">
              <div className="panel-heading">
                <div><span className="dashboard-eyebrow">YOUR LEARNING JOURNEY</span><h2>Roadmap progress</h2></div>
                <span className="roadmap-spark">✧</span>
              </div>
              <div className="roadmap-progress-summary">
                <div><strong>{roadmap ? `${progress}%` : "—"}</strong><span>overall progress</span></div>
                <div className="roadmap-mini-ring" style={{ "--roadmap-value": `${progress}%` }}><span>{roadmap ? "↗" : "✦"}</span></div>
              </div>
              <div className="roadmap-track"><span style={{ width: `${roadmap ? progress : 0}%` }} /></div>
              <p className="roadmap-description">{roadmap ? "Keep going—consistent learning turns your goals into progress." : "Your personalized learning plan will appear here after you generate a roadmap."}</p>
              <Link className="btn roadmap-button" to={roadmap ? "/student/roadmap" : "/student/skill-gap"}>{roadmap ? "Continue learning" : "Create my roadmap"} <span>→</span></Link>
              <div className="roadmap-tip"><span>✦</span><div><strong>Quick tip</strong><p>Focus on one skill at a time and track your progress as you learn.</p></div></div>
            </article>
          </section>

          <section className="dashboard-bottom-cta">
            <div className="bottom-cta-icon">↗</div>
            <div><h3>Ready for your next step?</h3><p>Review your skills and turn the gaps into a practical learning plan.</p></div>
            <Link to="/student/skills" className="bottom-cta-link">Update my skills <span>→</span></Link>
          </section>
        </>
      )}
    </div>
  );
}
