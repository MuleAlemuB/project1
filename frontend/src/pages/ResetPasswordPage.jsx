import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance from "../utils/axiosInstance";
import { useSettings } from "../contexts/SettingsContext";

const ResetPasswordPage = () => {
  const { darkMode, language } = useSettings();
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const texts = {
    en: {
      title: "Reset Password",
      newPassword: "New Password",
      confirmPassword: "Confirm Password",
      button: "Update Password",
      success: "Password reset successful! You can now log in.",
      mismatch: "Passwords do not match",
      back: "Back to Login",
    },
    am: {
      title: "የይለፍ ቃል ዳግም ያቀናብሩ",
      newPassword: "አዲስ የይለፍ ቃል",
      confirmPassword: "የይለፍ ቃል ያረጋግጡ",
      button: "ይዘምኑ",
      success: "የይለፍ ቃል ተሳክቶ ተቀይሯል! አሁን መግባት ትችላለህ።",
      mismatch: "የይለፍ ቃሎች አይመሳሰሉም",
      back: "ወደ መግቢያ ተመለስ",
    },
  };

  const t = texts[language];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError(t.mismatch);
      return;
    }

    try {
      const res = await axiosInstance.post(`/auth/reset-password/${token}`, {
        password: newPassword,
      });

      setMessage(t.success);

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen transition-all duration-500 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`p-8 w-96 rounded-2xl shadow-xl border ${
          darkMode
            ? "bg-gray-800/80 border-gray-700"
            : "bg-white/80 border-gray-200"
        }`}
      >
        <h1 className="text-2xl font-bold mb-6 text-center">{t.title}</h1>

        {error && (
          <p className="text-red-500 text-center mb-4 font-semibold">{error}</p>
        )}
        {message && (
          <p className="text-green-500 text-center mb-4 font-semibold">
            {message}
          </p>
        )}

        <input
          type="password"
          placeholder={t.newPassword}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className={`w-full p-3 mb-4 rounded-lg border ${
            darkMode
              ? "bg-gray-700 border-gray-600 text-gray-100"
              : "bg-gray-50 border-gray-300 text-gray-900"
          }`}
        />

        <input
          type="password"
          placeholder={t.confirmPassword}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className={`w-full p-3 mb-6 rounded-lg border ${
            darkMode
              ? "bg-gray-700 border-gray-600 text-gray-100"
              : "bg-gray-50 border-gray-300 text-gray-900"
          }`}
        />

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          className="w-full py-3 rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
        >
          {t.button}
        </motion.button>

        <button
          onClick={() => navigate("/login")}
          className="w-full mt-4 text-sm text-indigo-500 hover:text-indigo-700"
        >
          {t.back}
        </button>
      </motion.form>
    </div>
  );
};

export default ResetPasswordPage;
