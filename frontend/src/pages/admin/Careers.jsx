// pages/admin/Careers.jsx
import { useEffect, useState } from "react";
import { adminApi, careerApi, skillApi } from "../../services/api";
import Loading from "../../components/Loading";
import Message from "../../components/Message";
import PriorityBadge from "../../components/PriorityBadge";
import ConfirmModal from "../../components/ConfirmModal";

export default function Careers() {
  const [careers, setCareers] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [expandedCareer, setExpandedCareer] = useState(null);
  const [careerDetail, setCareerDetail] = useState(null);
  const [newSkillId, setNewSkillId] = useState("");
  const [newPriority, setNewPriority] = useState("MEDIUM");

  async function loadAll() {
    try {
      const [careerList, skillList] = await Promise.all([careerApi.getAll(), skillApi.getAll()]);
      setCareers(careerList);
      setSkills(skillList);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  function resetForm() {
    setForm({ title: "", description: "" });
    setEditingId(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (editingId) {
        await adminApi.updateCareer(editingId, form);
        setSuccess("Career updated.");
      } else {
        await adminApi.createCareer(form);
        setSuccess("Career created.");
      }
      resetForm();
      loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEdit(career) {
    setEditingId(career.id);
    setForm({ title: career.title, description: career.description || "" });
  }

  async function confirmDelete() {
    try {
      await adminApi.deleteCareer(deleteTarget.id);
      setDeleteTarget(null);
      loadAll();
    } catch (err) {
      setError(err.message);
      setDeleteTarget(null);
    }
  }

  async function toggleExpand(career) {
    if (expandedCareer === career.id) {
      setExpandedCareer(null);
      setCareerDetail(null);
      return;
    }
    setExpandedCareer(career.id);
    try {
      const detail = await careerApi.getById(career.id);
      setCareerDetail(detail);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleAssignSkill(careerId) {
    if (!newSkillId) return;
    try {
      await adminApi.assignSkillToCareer({ careerId, skillId: newSkillId, priority: newPriority });
      const detail = await careerApi.getById(careerId);
      setCareerDetail(detail);
      setNewSkillId("");
      setNewPriority("MEDIUM");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRemoveSkill(careerId, skillId) {
    try {
      await adminApi.removeSkillFromCareer({ careerId, skillId });
      const detail = await careerApi.getById(careerId);
      setCareerDetail(detail);
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <Loading />;

  return (
    <div>
      <h1>Career Management</h1>
      <Message type="error" text={error} />
      <Message type="success" text={success} />

      <div className="card" style={{ maxWidth: 480 }}>
        <h3>{editingId ? "Edit Career" : "Add Career"}</h3>
        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <label>Description</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn" type="submit">
              {editingId ? "Update" : "Add"}
            </button>
            {editingId && (
              <button className="btn secondary" type="button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {careers.map((career) => (
        <div className="card" key={career.id}>
          <div className="flex-between">
            <div>
              <h3>{career.title}</h3>
              <p>{career.description}</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn secondary small" onClick={() => handleEdit(career)}>
                Edit
              </button>
              <button className="btn danger small" onClick={() => setDeleteTarget(career)}>
                Delete
              </button>
              <button className="btn small" onClick={() => toggleExpand(career)}>
                {expandedCareer === career.id ? "Hide Skills" : "Manage Skills"}
              </button>
            </div>
          </div>

          {expandedCareer === career.id && careerDetail && (
            <div style={{ marginTop: 14, borderTop: "1px solid var(--color-border)", paddingTop: 14 }}>
              <h4>Required Skills</h4>
              {careerDetail.requiredSkills.length === 0 ? (
                <p>No skills assigned yet.</p>
              ) : (
                <table>
                  <thead>
                    <tr><th>Skill</th><th>Priority</th><th></th></tr>
                  </thead>
                  <tbody>
                    {careerDetail.requiredSkills.map((s) => (
                      <tr key={s.skill_id}>
                        <td>{s.name}</td>
                        <td><PriorityBadge priority={s.priority} /></td>
                        <td>
                          <button
                            className="btn danger small"
                            onClick={() => handleRemoveSkill(career.id, s.skill_id)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <div className="form-row" style={{ marginTop: 10, alignItems: "flex-end" }}>
                <div>
                  <label>Add skill</label>
                  <select value={newSkillId} onChange={(e) => setNewSkillId(e.target.value)}>
                    <option value="">Select a skill</option>
                    {skills.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Priority</label>
                  <select value={newPriority} onChange={(e) => setNewPriority(e.target.value)}>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
                <div style={{ flex: "0 0 auto" }}>
                  <button className="btn" onClick={() => handleAssignSkill(career.id)}>
                    Assign
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete career?"
        message={`Delete "${deleteTarget?.title}"? This also removes its required-skill mappings and student roadmaps for it.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
