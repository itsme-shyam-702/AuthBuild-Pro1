import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
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
            <h1 style={styles.title}>Dashboard</h1>
            <p style={styles.subtitle}>You're logged in</p>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Log out
          </button>
        </div>

        <div style={styles.infoBox}>
          <Row label="Email"  value={user?.email} />
          <Row label="Role"   value={user?.role} />
          <Row label="ID"     value={user?.id} mono />
        </div>

        {user?.role === "admin" && (
          <button onClick={() => navigate("/admin")} style={styles.adminBtn}>
            Go to Admin Panel →
          </button>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, mono }) {
  return (
    <div style={styles.row}>
      <span style={styles.rowLabel}>{label}</span>
      <span style={{ ...styles.rowValue, fontFamily: mono ? "monospace" : "inherit", fontSize: mono ? "12px" : "14px" }}>
        {value || "—"}
      </span>
    </div>
  );
}

const styles = {
  page:      { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5" },
  card:      { background: "#fff", padding: "40px", borderRadius: "12px", boxShadow: "0 2px 16px rgba(0,0,0,0.1)", width: "100%", maxWidth: "480px" },
  header:    { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" },
  title:     { margin: "0 0 4px", fontSize: "24px", fontWeight: "600" },
  subtitle:  { margin: 0, fontSize: "14px", color: "#666" },
  logoutBtn: { padding: "8px 16px", borderRadius: "8px", background: "#f3f4f6", border: "1px solid #e5e7eb", fontSize: "14px", cursor: "pointer", color: "#374151" },
  infoBox:   { background: "#f9fafb", borderRadius: "8px", overflow: "hidden", border: "1px solid #e5e7eb" },
  row:       { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #e5e7eb" },
  rowLabel:  { fontSize: "13px", fontWeight: "500", color: "#6b7280" },
  rowValue:  { fontSize: "14px", color: "#111827" },
  adminBtn:  { marginTop: "16px", width: "100%", padding: "12px", borderRadius: "8px", background: "#4f46e5", color: "#fff", border: "none", fontSize: "14px", fontWeight: "600", cursor: "pointer" },
};
