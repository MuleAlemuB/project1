import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { motion } from "framer-motion";
import { useSettings } from "../contexts/SettingsContext";

const ForgotPasswordPage = () => {
  const { darkMode, language } = useSettings();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const texts = {
    en: {
      title: "Forgot Password",
      enterEmail: "Enter your email",
      send: "Send Reset Link",
      success: "Reset link sent to your email",
      backLogin: "Back to Login",
    },
    am: {
      title: "የይለፍ ቃል መመለሻ",
      enterEmail: "ኢሜልዎን ያስገቡ",
      send: "መመለሻ ሊንክ ላክ",
      success: "መመለሻ ሊንክ ወደ ኢሜልዎ ተልኳል",
      backLogin: "ወደ መግቢያ ተመለስ",
    },
  };

  const t = texts[language];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await axiosInstance.post("/auth/forgot-password", { email });
      setMessage(t.success);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={`p-8 w-96 rounded-2xl shadow-xl ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2 className="text-2xl font-bold mb-6">{t.title}</h2>

        {message && <p className="text-green-500 mb-4">{message}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="email"
          placeholder={t.enterEmail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={`w-full p-3 rounded-lg mb-4 border ${
            darkMode
              ? "bg-gray-700 border-gray-600"
              : "bg-gray-50 border-gray-300"
          }`}
        />

        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
        >
          {t.send}
        </button>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className={`mt-4 w-full text-center underline ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {t.backLogin}
        </button>
      </motion.form>
    </div>
  );
};

export default ForgotPasswordPage;
