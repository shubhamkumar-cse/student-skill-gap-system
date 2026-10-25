// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

import StudentLayout from "./layouts/StudentLayout";
import StudentDashboard from "./pages/student/Dashboard";
import StudentProfile from "./pages/student/Profile";
import MySkills from "./pages/student/MySkills";
import CareerSelection from "./pages/student/CareerSelection";
import SkillGap from "./pages/student/SkillGap";
import Roadmap from "./pages/student/Roadmap";
import Progress from "./pages/student/Progress";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminCareers from "./pages/admin/Careers";
import AdminSkills from "./pages/admin/Skills";
import AdminResources from "./pages/admin/Resources";
import AdminStudents from "./pages/admin/Students";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="skills" element={<MySkills />} />
          <Route path="career" element={<CareerSelection />} />
          <Route path="skill-gap" element={<SkillGap />} />
          <Route path="roadmap" element={<Roadmap />} />
          <Route path="progress" element={<Progress />} />
        </Route>

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="careers" element={<AdminCareers />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="resources" element={<AdminResources />} />
          <Route path="students" element={<AdminStudents />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
