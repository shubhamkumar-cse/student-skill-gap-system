// services/api.js
// One place that knows how to talk to the backend.
// Every page/component calls these functions instead of using
// fetch() directly, so the base URL and auth header are never
// duplicated across the app.

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // some responses (like 204) may not have a JSON body
  }

  if (!res.ok) {
    const message = (data && data.message) || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

// ---------- Auth ----------
export const authApi = {
  register: (payload) => request("/auth/register", { method: "POST", body: payload, auth: false }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload, auth: false }),
};

// ---------- Student ----------
export const studentApi = {
  getProfile: () => request("/students/profile"),
  updateProfile: (payload) => request("/students/profile", { method: "PUT", body: payload }),
  selectCareer: (careerId) => request("/students/career", { method: "PUT", body: { careerId } }),
  getSkills: () => request("/students/skills"),
  addSkill: (payload) => request("/students/skills", { method: "POST", body: payload }),
  updateSkill: (id, status) => request(`/students/skills/${id}`, { method: "PUT", body: { status } }),
  deleteSkill: (id) => request(`/students/skills/${id}`, { method: "DELETE" }),
};

// ---------- Careers ----------
export const careerApi = {
  getAll: () => request("/careers"),
  getById: (id) => request(`/careers/${id}`),
};

// ---------- Skills (shared, read-only master list) ----------
export const skillApi = {
  getAll: () => request("/skills"),
};

// ---------- Skill gap ----------
export const skillGapApi = {
  analyze: (careerId) => request(`/skill-gap/${careerId}`),
};

// ---------- Roadmap ----------
export const roadmapApi = {
  get: () => request("/roadmap"),
  generate: (careerId) => request("/roadmap/generate", { method: "POST", body: { careerId } }),
  updateItemStatus: (itemId, status) =>
    request(`/roadmap/items/${itemId}`, { method: "PUT", body: { status } }),
};

// ---------- Progress ----------
export const progressApi = {
  update: (roadmapItemId, percentage) =>
    request(`/progress/${roadmapItemId}`, { method: "PUT", body: { percentage } }),
};

// ---------- Admin ----------
export const adminApi = {
  getStats: () => request("/admin/stats"),

  getCareers: () => request("/careers"),
  createCareer: (payload) => request("/admin/careers", { method: "POST", body: payload }),
  updateCareer: (id, payload) => request(`/admin/careers/${id}`, { method: "PUT", body: payload }),
  deleteCareer: (id) => request(`/admin/careers/${id}`, { method: "DELETE" }),

  createSkill: (payload) => request("/admin/skills", { method: "POST", body: payload }),
  updateSkill: (id, payload) => request(`/admin/skills/${id}`, { method: "PUT", body: payload }),
  deleteSkill: (id) => request(`/admin/skills/${id}`, { method: "DELETE" }),

  assignSkillToCareer: (payload) => request("/admin/career-skills", { method: "POST", body: payload }),
  removeSkillFromCareer: (payload) => request("/admin/career-skills", { method: "DELETE", body: payload }),

  getResources: () => request("/admin/resources"),
  createResource: (payload) => request("/admin/resources", { method: "POST", body: payload }),
  updateResource: (id, payload) => request(`/admin/resources/${id}`, { method: "PUT", body: payload }),
  deleteResource: (id) => request(`/admin/resources/${id}`, { method: "DELETE" }),

  getStudents: () => request("/admin/students"),
  getStudentDetail: (id) => request(`/admin/students/${id}`),
};

export default request;
