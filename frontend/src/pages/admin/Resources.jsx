// pages/admin/Resources.jsx
import { useEffect, useState } from "react";
import { adminApi, skillApi } from "../../services/api";
import Loading from "../../components/Loading";
import Message from "../../components/Message";
import ConfirmModal from "../../components/ConfirmModal";

const TYPES = ["ARTICLE", "VIDEO", "COURSE", "DOCS", "BOOK", "OTHER"];

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({ skillId: "", title: "", url: "", type: "ARTICLE" });
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function loadAll() {
    try {
      const [resourceList, skillList] = await Promise.all([
        adminApi.getResources(),
        skillApi.getAll(),
      ]);
      setResources(resourceList);
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
    setForm({ skillId: "", title: "", url: "", type: "ARTICLE" });
    setEditingId(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (editingId) {
        await adminApi.updateResource(editingId, form);
        setSuccess("Resource updated.");
      } else {
        await adminApi.createResource(form);
        setSuccess("Resource created.");
      }
      resetForm();
      loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEdit(resource) {
    setEditingId(resource.id);
    setForm({
      skillId: resource.skill_id,
      title: resource.title,
      url: resource.url || "",
      type: resource.type,
    });
  }

  async function confirmDelete() {
    try {
      await adminApi.deleteResource(deleteTarget.id);
      setDeleteTarget(null);
      loadAll();
    } catch (err) {
      setError(err.message);
      setDeleteTarget(null);
    }
  }

  if (loading) return <Loading />;

  return (
    <div>
      <h1>Learning Resource Management</h1>
      <Message type="error" text={error} />
      <Message type="success" text={success} />

      <div className="card" style={{ maxWidth: 480 }}>
        <h3>{editingId ? "Edit Resource" : "Add Resource"}</h3>
        <form onSubmit={handleSubmit}>
          <label>Skill</label>
          <select
            value={form.skillId}
            onChange={(e) => setForm({ ...form, skillId: e.target.value })}
            required
          >
            <option value="">Select a skill</option>
            {skills.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <label>Title</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />

          <label>URL</label>
          <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />

          <label>Type</label>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            {TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

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
            <tr><th>Title</th><th>Skill</th><th>Type</th><th></th></tr>
          </thead>
          <tbody>
            {resources.map((r) => (
              <tr key={r.id}>
                <td>
                  <a href={r.url} target="_blank" rel="noreferrer">{r.title}</a>
                </td>
                <td>{r.skill_name}</td>
                <td>{r.type}</td>
                <td style={{ display: "flex", gap: 8 }}>
                  <button className="btn secondary small" onClick={() => handleEdit(r)}>
                    Edit
                  </button>
                  <button className="btn danger small" onClick={() => setDeleteTarget(r)}>
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
        title="Delete resource?"
        message={`Delete "${deleteTarget?.title}"?`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
