// pages/student/Profile.jsx
import { useEffect, useState } from "react";
import { studentApi } from "../../services/api";
import Loading from "../../components/Loading";
import Message from "../../components/Message";

export default function Profile() {
  const [form, setForm] = useState({ collegeName: "", branch: "", semester: "", bio: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const profile = await studentApi.getProfile();
        setForm({
          collegeName: profile?.college_name || "",
          branch: profile?.branch || "",
          semester: profile?.semester || "",
          bio: profile?.bio || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      await studentApi.updateProfile(form);
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <div>
      <h1>My Profile</h1>
      <div className="card" style={{ maxWidth: 480 }}>
        <Message type="error" text={error} />
        <Message type="success" text={success} />
        <form onSubmit={handleSubmit}>
          <label>College Name</label>
          <input name="collegeName" value={form.collegeName} onChange={handleChange} />

          <div className="form-row">
            <div>
              <label>Branch</label>
              <input name="branch" value={form.branch} onChange={handleChange} />
            </div>
            <div>
              <label>Semester</label>
              <input
                name="semester"
                type="number"
                min="1"
                max="8"
                value={form.semester}
                onChange={handleChange}
              />
            </div>
          </div>

          <label>Short Bio</label>
          <textarea name="bio" rows={4} value={form.bio} onChange={handleChange} />

          <button className="btn" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
