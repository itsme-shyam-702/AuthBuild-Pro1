/ npm install @react-oauth/google
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function GoogleLoginButton() {
  const { setUser } = useAuth();  // if you expose setUser from context
  const navigate    = useNavigate();

  const handleSuccess = async ({ credential: idToken }) => {
    try {
      // Send Google's id_token to our backend for verification
      const { data } = await api.post("/auth/google", { idToken });
      localStorage.setItem("accessToken",  data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      setUser(data.user);
      navigate("/dashboard");
    } catch (err) {
      console.error("Google login failed", err);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.error("Google popup failed")}
    />
  );
}

// Wrap your app in GoogleOAuthProvider in main.jsx:
// <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
//   <App />
// </GoogleOAuthProvider>