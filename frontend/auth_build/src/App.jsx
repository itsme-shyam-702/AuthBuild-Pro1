import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages — create these as simple components in src/pages/
import RegisterPage  from "./pages/RegisterPage";
import LoginPage     from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AdminPage     from "./pages/AdminPage";

// ── PROTECTED ROUTE WRAPPER ───────────────────────────────────
// Redirects to /login if user isn't authenticated
function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user)   return <Navigate to="/login" replace />;

  // Role check — if requiredRole prop is passed, verify it
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// ── APP ───────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>     {/* wraps everything so useAuth() works anywhere */}
        <Routes>

          {/* Public routes */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login"    element={<LoginPage    />} />

          {/* Protected — any logged-in user */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Protected — admin only */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all — redirect to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}