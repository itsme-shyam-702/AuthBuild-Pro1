import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div>
            <span style={styles.badge}>admin</span>
            <h1 style={styles.title}>Admin Panel</h1>
            <p style={styles.subtitle}>Logged in as {user?.email}</p>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Log out
          </button>
        </div>

        <p style={styles.note}>
          This route is protected by <code>roleGuard("admin")</code> on the backend
          and <code>requiredRole="admin"</code> on the frontend. Only users with
          role = admin can reach this page.
        </p>

        <button onClick={() => navigate("/")} style={styles.backBtn}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}

const styles = {
  page:      { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5" },
  card:      { background: "#fff", padding: "40px", borderRadius: "12px", boxShadow: "0 2px 16px rgba(0,0,0,0.1)", width: "100%", maxWidth: "480px" },
  header:    { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" },
  badge:     { display: "inline-block", background: "#fef3c7", color: "#92400e", fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", padding: "2px 8px", borderRadius: "4px", marginBottom: "8px" },
  title:     { margin: "0 0 4px", fontSize: "24px", fontWeight: "600" },
  subtitle:  { margin: 0, fontSize: "14px", color: "#666" },
  logoutBtn: { padding: "8px 16px", borderRadius: "8px", background: "#f3f4f6", border: "1px solid #e5e7eb", fontSize: "14px", cursor: "pointer", color: "#374151" },
  note:      { background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "16px", fontSize: "14px", color: "#166534", lineHeight: "1.6", marginBottom: "20px" },
  backBtn:   { padding: "10px 20px", borderRadius: "8px", background: "#f3f4f6", border: "1px solid #e5e7eb", fontSize: "14px", cursor: "pointer", color: "#374151" },
};
