// pages/student/Roadmap.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { roadmapApi } from "../../services/api";
import Loading from "../../components/Loading";
import Message from "../../components/Message";
import PriorityBadge from "../../components/PriorityBadge";
import StatusBadge from "../../components/StatusBadge";
import ProgressBar from "../../components/ProgressBar";
import EmptyState from "../../components/EmptyState";

export default function Roadmap() {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function load() {
    try {
      const data = await roadmapApi.get();
      setRoadmap(data);
    } catch (err) {
      setRoadmap(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <Loading />;

  if (!roadmap) {
    return (
      <EmptyState
        message="No roadmap yet. Run a skill-gap analysis and generate one."
        action={
          <button className="btn" onClick={() => navigate("/student/skill-gap")}>
            Go to Skill Gap Analysis
          </button>
        }
      />
    );
  }

  return (
    <div>
      <h1>My Roadmap</h1>
      <p>Career role: <strong>{roadmap.career_title}</strong></p>
      <Message type="error" text={error} />

      <div className="card">
        <h3>Overall Progress</h3>
        <ProgressBar percentage={roadmap.overallProgress} />
      </div>

      {roadmap.items.length === 0 ? (
        <EmptyState message="No gaps found — your roadmap is empty because you matched every required skill!" />
      ) : (
        roadmap.items.map((item, index) => (
          <div className="card" key={item.id}>
            <div className="flex-between">
              <h3>
                Step {index + 1}: {item.skill_name}
              </h3>
              <div>
                <PriorityBadge priority={item.priority} />{" "}
                <StatusBadge status={item.status} />
              </div>
            </div>
            <p>{item.description}</p>
            {item.resource_title && (
              <p>
                Resource:{" "}
                <a href={item.resource_url} target="_blank" rel="noreferrer">
                  {item.resource_title}
                </a>
              </p>
            )}
            <ProgressBar percentage={item.progress_percentage} />
            <button
              className="btn secondary small"
              style={{ marginTop: 10 }}
              onClick={() => navigate("/student/progress")}
            >
              Update Progress
            </button>
          </div>
        ))
      )}
    </div>
  );
}
