// pages/admin/Skills.jsx
import { useEffect, useState } from "react";
import { adminApi, skillApi } from "../../services/api";
import Loading from "../../components/Loading";
import Message from "../../components/Message";
import ConfirmModal from "../../components/ConfirmModal";

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({ name: "", category: "" });
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function loadSkills() {
    try {
      const data = await skillApi.getAll();
      setSkills(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSkills();
  }, []);

  function resetForm() {
    setForm({ name: "", category: "" });
    setEditingId(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (editingId) {
        await adminApi.updateSkill(editingId, form);
        setSuccess("Skill updated.");
      } else {
        await adminApi.createSkill(form);
        setSuccess("Skill created.");
      }
      resetForm();
      loadSkills();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEdit(skill) {
    setEditingId(skill.id);
    setForm({ name: skill.name, category: skill.category || "" });
  }

  async function confirmDelete() {
    try {
      await adminApi.deleteSkill(deleteTarget.id);
      setDeleteTarget(null);
      loadSkills();
    } catch (err) {
      setError(err.message);
      setDeleteTarget(null);
    }
  }

  if (loading) return <Loading />;

  return (
    <div>
      <h1>Skill Management</h1>
      <Message type="error" text={error} />
      <Message type="success" text={success} />

      <div className="card" style={{ maxWidth: 480 }}>
        <h3>{editingId ? "Edit Skill" : "Add Skill"}</h3>
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <label>Category</label>
          <input
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            placeholder="e.g. Programming Language, Framework, Tools"
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

      <div className="card">
        <table>
          <thead>
            <tr><th>Name</th><th>Category</th><th></th></tr>
          </thead>
          <tbody>
            {skills.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.category}</td>
                <td style={{ display: "flex", gap: 8 }}>
                  <button className="btn secondary small" onClick={() => handleEdit(s)}>
                    Edit
                  </button>
                  <button className="btn danger small" onClick={() => setDeleteTarget(s)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete skill?"
        message={`Delete "${deleteTarget?.name}"? This removes it from all careers and student skill lists.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
