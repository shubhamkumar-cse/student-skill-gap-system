// pages/student/Dashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { studentApi, skillGapApi, roadmapApi } from "../../services/api";
import Loading from "../../components/Loading";
import Message from "../../components/Message";
import ProgressBar from "../../components/ProgressBar";

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
            const roadmapData = await roadmapApi.get();
            setRoadmap(roadmapData);
          } catch {
            setRoadmap(null); // no roadmap generated yet — that's fine
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <h1>Student Dashboard</h1>
      <Message type="error" text={error} />

      {!profile?.selected_career_id && (
        <div className="card">
          <p>You haven't selected a career role yet.</p>
          <Link className="btn" to="/student/career">
            Select a Career Role
          </Link>
        </div>
      )}

      {profile?.selected_career_id && (
        <>
          <div className="card-grid">
            <div className="card stat-card">
              <div className="stat-label">Selected Career</div>
              <div className="stat-value" style={{ fontSize: 18 }}>
                {profile.selected_career_title}
              </div>
            </div>
            <div className="card stat-card">
              <div className="stat-label">Skill Match</div>
              <div className="stat-value">{gap ? `${gap.matchPercentage}%` : "-"}</div>
            </div>
            <div className="card stat-card">
              <div className="stat-label">Available Skills</div>
              <div className="stat-value">{gap?.available.length ?? 0}</div>
            </div>
            <div className="card stat-card">
              <div className="stat-label">Missing Skills</div>
              <div className="stat-value">{gap?.missing.length ?? 0}</div>
            </div>
          </div>

          <div className="card">
            <h3>Roadmap Progress</h3>
            {roadmap ? (
              <>
                <ProgressBar percentage={roadmap.overallProgress} />
                <Link className="btn secondary" style={{ marginTop: 10 }} to="/student/roadmap">
                  View Roadmap
                </Link>
              </>
            ) : (
              <>
                <p>No roadmap generated yet.</p>
                <Link className="btn" to="/student/skill-gap">
                  Run Skill-Gap Analysis
                </Link>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
