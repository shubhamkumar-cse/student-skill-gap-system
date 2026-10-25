// pages/admin/Students.jsx
import { useEffect, useState } from "react";
import { adminApi } from "../../services/api";
import Loading from "../../components/Loading";
import Message from "../../components/Message";
import SkillBadge from "../../components/SkillBadge";
import EmptyState from "../../components/EmptyState";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await adminApi.getStudents();
        setStudents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleView(student) {
    setSelected(student.id);
    try {
      const data = await adminApi.getStudentDetail(student.id);
      setDetail(data);
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <Loading />;

  return (
    <div>
      <h1>Student Management</h1>
      <Message type="error" text={error} />

      {students.length === 0 ? (
        <EmptyState message="No students have registered yet." />
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Joined</th><th></th></tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{new Date(s.created_at).toLocaleDateString()}</td>
                  <td>
                    <button className="btn secondary small" onClick={() => handleView(s)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && detail && (
        <div className="card">
          <h3>{detail.user.name}</h3>
          <p>{detail.user.email}</p>
          <p>
            College: {detail.profile?.college_name || "-"} | Branch:{" "}
            {detail.profile?.branch || "-"} | Semester: {detail.profile?.semester || "-"}
          </p>
          <p>Selected career: {detail.profile?.selected_career_title || "Not selected yet"}</p>

          <h4>Skills</h4>
          {detail.skills.length === 0 ? (
            <p>No skills added yet.</p>
          ) : (
            detail.skills.map((sk) => (
              <span key={sk.id} style={{ marginRight: 8, marginBottom: 8, display: "inline-block" }}>
                {sk.name} <SkillBadge status={sk.status} />
              </span>
            ))
          )}
        </div>
      )}
    </div>
  );
}
