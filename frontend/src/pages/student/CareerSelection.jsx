// pages/student/CareerSelection.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { careerApi, studentApi } from "../../services/api";
import Loading from "../../components/Loading";
import Message from "../../components/Message";

export default function CareerSelection() {
  const [careers, setCareers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const [careerList, profile] = await Promise.all([
          careerApi.getAll(),
          studentApi.getProfile(),
        ]);
        setCareers(careerList);
        setSelectedId(profile?.selected_career_id || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSelect(id) {
    setError("");
    setSuccess("");
    try {
      await studentApi.selectCareer(id);
      setSelectedId(id);
      setSuccess("Career role selected. You can now run a skill-gap analysis.");
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <Loading />;

  return (
    <div>
      <h1>Career Selection</h1>
      <Message type="error" text={error} />
      <Message type="success" text={success} />

      <div className="card-grid">
        {careers.map((career) => (
          <div key={career.id} className="card">
            <h3>{career.title}</h3>
            <p>{career.description}</p>
            {selectedId === career.id ? (
              <span className="badge available">Selected</span>
            ) : (
              <button className="btn" onClick={() => handleSelect(career.id)}>
                Select this Role
              </button>
            )}
          </div>
        ))}
      </div>

      {selectedId && (
        <button className="btn secondary" onClick={() => navigate("/student/skill-gap")}>
          Go to Skill Gap Analysis
        </button>
      )}
    </div>
  );
}
