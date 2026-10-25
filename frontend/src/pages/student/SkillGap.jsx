// pages/student/SkillGap.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { studentApi, skillGapApi, roadmapApi } from "../../services/api";
import Loading from "../../components/Loading";
import Message from "../../components/Message";
import PriorityBadge from "../../components/PriorityBadge";
import EmptyState from "../../components/EmptyState";

export default function SkillGap() {
  const [profile, setProfile] = useState(null);
  const [gap, setGap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const profileData = await studentApi.getProfile();
        setProfile(profileData);
        if (profileData?.selected_career_id) {
          const gapData = await skillGapApi.analyze(profileData.selected_career_id);
          setGap(gapData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleGenerateRoadmap() {
    setGenerating(true);
    setError("");
    try {
      await roadmapApi.generate(profile.selected_career_id);
      navigate("/student/roadmap");
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  if (loading) return <Loading />;

  if (!profile?.selected_career_id) {
    return (
      <EmptyState
        message="Select a career role first to run a skill-gap analysis."
        action={
          <button className="btn" onClick={() => navigate("/student/career")}>
            Select Career Role
          </button>
        }
      />
    );
  }

  return (
    <div>
      <h1>Skill Gap Analysis</h1>
      <p>Career role: <strong>{profile.selected_career_title}</strong></p>
      <Message type="error" text={error} />

      {gap && (
        <>
          <div className="card-grid">
            <div className="card stat-card">
              <div className="stat-label">Skill Match</div>
              <div className="stat-value">{gap.matchPercentage}%</div>
            </div>
            <div className="card stat-card">
              <div className="stat-label">Required Skills</div>
              <div className="stat-value">{gap.totalRequired}</div>
            </div>
            <div className="card stat-card">
              <div className="stat-label">Matched</div>
              <div className="stat-value">{gap.matchedCount}</div>
            </div>
          </div>

          <div className="card">
            <h3>Available Skills ({gap.available.length})</h3>
            {gap.available.length === 0 ? (
              <p>None yet.</p>
            ) : (
              gap.available.map((s) => (
                <span key={s.skill_id} className="badge available" style={{ marginRight: 8, marginBottom: 8, display: "inline-block" }}>
                  {s.name}
                </span>
              ))
            )}
          </div>

          <div className="card">
            <h3>Partially Known Skills ({gap.partiallyKnown.length})</h3>
            {gap.partiallyKnown.length === 0 ? (
              <p>None.</p>
            ) : (
              <table>
                <thead>
                  <tr><th>Skill</th><th>Priority</th></tr>
                </thead>
                <tbody>
                  {gap.partiallyKnown.map((s) => (
                    <tr key={s.skill_id}>
                      <td>{s.name}</td>
                      <td><PriorityBadge priority={s.priority} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="card">
            <h3>Missing Skills ({gap.missing.length})</h3>
            {gap.missing.length === 0 ? (
              <p>No missing skills — great job!</p>
            ) : (
              <table>
                <thead>
                  <tr><th>Skill</th><th>Priority</th></tr>
                </thead>
                <tbody>
                  {gap.missing.map((s) => (
                    <tr key={s.skill_id}>
                      <td>{s.name}</td>
                      <td><PriorityBadge priority={s.priority} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {(gap.missing.length > 0 || gap.partiallyKnown.length > 0) && (
            <button className="btn" onClick={handleGenerateRoadmap} disabled={generating}>
              {generating ? "Generating..." : "Generate Personalized Roadmap"}
            </button>
          )}
        </>
      )}
    </div>
  );
}
