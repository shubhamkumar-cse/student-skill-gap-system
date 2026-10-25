// pages/student/Progress.jsx
import { useEffect, useState } from "react";
import { roadmapApi, progressApi } from "../../services/api";
import Loading from "../../components/Loading";
import Message from "../../components/Message";
import ProgressBar from "../../components/ProgressBar";
import StatusBadge from "../../components/StatusBadge";
import EmptyState from "../../components/EmptyState";

const STEPS = [0, 25, 50, 75, 100];

export default function Progress() {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);

  async function load() {
    try {
      const data = await roadmapApi.get();
      setRoadmap(data);
    } catch {
      setRoadmap(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleUpdate(itemId, percentage) {
    setSavingId(itemId);
    setError("");
    try {
      await progressApi.update(itemId, percentage);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  }

  if (loading) return <Loading />;

  if (!roadmap || roadmap.items.length === 0) {
    return <EmptyState message="No roadmap items to track yet." />;
  }

  return (
    <div>
      <h1>Track Progress</h1>
      <Message type="error" text={error} />

      <div className="card">
        <h3>Overall Roadmap Progress</h3>
        <ProgressBar percentage={roadmap.overallProgress} />
      </div>

      {roadmap.items.map((item) => (
        <div className="card" key={item.id}>
          <div className="flex-between">
            <h3>{item.skill_name}</h3>
            <StatusBadge status={item.status} />
          </div>
          <ProgressBar percentage={item.progress_percentage} />
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            {STEPS.map((step) => (
              <button
                key={step}
                className={`btn small ${item.progress_percentage === step ? "" : "secondary"}`}
                disabled={savingId === item.id}
                onClick={() => handleUpdate(item.id, step)}
              >
                {step}%
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
