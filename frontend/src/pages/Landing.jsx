// pages/Landing.jsx
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="landing">
      <h1>Student Skill Gap Analysis & Personalized Career Roadmap</h1>
      <p>
        Pick a career role, compare it against your current skills, see exactly what's
        missing, and follow a step-by-step roadmap to close the gap.
      </p>
      <div className="actions">
        <Link to="/login" className="btn">
          Login
        </Link>
        <Link to="/register" className="btn secondary">
          Register
        </Link>
      </div>
    </div>
  );
}
