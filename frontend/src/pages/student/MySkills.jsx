// pages/student/MySkills.jsx
import { useEffect, useState } from "react";
import { studentApi, skillApi } from "../../services/api";
import Loading from "../../components/Loading";
import Message from "../../components/Message";
import ConfirmModal from "../../components/ConfirmModal";
import EmptyState from "../../components/EmptyState";

const STATUS_OPTIONS = ["AVAILABLE", "PARTIALLY_KNOWN", "MISSING"];

export default function MySkills() {
  const [mySkills, setMySkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("AVAILABLE");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function loadData() {
    try {
      const [mine, all] = await Promise.all([studentApi.getSkills(), skillApi.getAll()]);
      setMySkills(mine);
      setAllSkills(all);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const availableToAdd = allSkills.filter(
    (s) => !mySkills.some((m) => m.skill_id === s.id)
  );

  async function handleAdd(e) {
    e.preventDefault();
    if (!selectedSkillId) return;
    setError("");
    try {
      await studentApi.addSkill({ skillId: selectedSkillId, status: selectedStatus });
      setSelectedSkillId("");
      setSelectedStatus("AVAILABLE");
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleStatusChange(id, status) {
    try {
      await studentApi.updateSkill(id, status);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function confirmDelete() {
    try {
      await studentApi.deleteSkill(deleteTarget.id);
      setDeleteTarget(null);
      loadData();
    } catch (err) {
      setError(err.message);
      setDeleteTarget(null);
    }
  }

  if (loading) return <Loading />;

  return (
    <div>
      <h1>My Skills</h1>
      <Message type="error" text={error} />

      <div className="card">
        <h3>Add a Skill</h3>
        <form onSubmit={handleAdd} className="form-row" style={{ alignItems: "flex-end" }}>
          <div>
            <label>Skill</label>
            <select value={selectedSkillId} onChange={(e) => setSelectedSkillId(e.target.value)}>
              <option value="">Select a skill</option>
              {availableToAdd.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Status</label>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <div style={{ flex: "0 0 auto" }}>
            <button className="btn" type="submit" disabled={!selectedSkillId}>
              Add Skill
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h3>My Skills</h3>
        {mySkills.length === 0 ? (
          <EmptyState message="You haven't added any skills yet." />
        ) : (
          <table>
            <thead>
              <tr>
                <th>Skill</th>
                <th>Category</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {mySkills.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.category}</td>
                  <td>
                    <select
                      value={s.status}
                      onChange={(e) => handleStatusChange(s.id, e.target.value)}
                      style={{ marginBottom: 0, width: 170 }}
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button className="btn danger small" onClick={() => setDeleteTarget(s)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Remove skill?"
        message={`Remove "${deleteTarget?.name}" from your skills?`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
