import React, { useEffect, useState } from "react";
import EmployeeSidebar from "../../components/employee/EmployeeSidebar";
import axiosInstance from "../../utils/axiosInstance";
import { useSettings } from "../../contexts/SettingsContext";
import { toast } from "react-toastify";

const EmployeeNotifications = () => {
  const { language, darkMode } = useSettings();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null); // for details modal

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await axiosInstance.get("/notifications/my");
        console.log("Notifications:", data);
        setNotifications(data);
      } catch (error) {
        console.error(error);
        toast.error(language === "am" ? "ማሳወቂያዎችን ማግኘት አልቻልኩም።" : "Failed to fetch notifications.");
      }
    };

    fetchNotifications();
  }, [language]);

  // Delete notification
  const handleDelete = async (id) => {
    if (!window.confirm(language === "am" ? "እርግጠኛ ነህ?" : "Are you sure?")) return;
    try {
      await axiosInstance.delete(`/notifications/${id}`);
      setNotifications(notifications.filter(n => n._id !== id));
      toast.success(language === "am" ? "ማሳወቂያ ተሰርዟል።" : "Notification deleted.");
    } catch (error) {
      console.error(error);
      toast.error(language === "am" ? "አልተሰረዘም።" : "Failed to delete notification.");
    }
  };

  // Theme colors
  const cardBg = darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800";
  const borderColor = darkMode ? "border-gray-700" : "border-gray-300";

  return (
    <div className="flex min-h-screen">
      <EmployeeSidebar />

      <main className={`flex-1 p-6 transition-all duration-500 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900`}>
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-3xl font-bold mb-6 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
            {language === "am" ? "ማሳወቂያዎች" : "Notifications"}
          </h1>

          {loading ? (
            <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
              {language === "am" ? "በመጫን ላይ..." : "Loading..."}
            </p>
          ) : notifications.length === 0 ? (
            <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
              {language === "am" ? "ምንም ማሳወቂያ የለም።" : "No notifications yet."}
            </p>
          ) : (
            <ul className="space-y-4">
              {notifications.map((note) => (
                <li
                  key={note._id}
                  className={`${cardBg} border ${borderColor} p-4 rounded-xl shadow-md flex justify-between items-start`}
                >
                  <div>
                    <p className="font-medium">
                      {note.type === "Leave" ? (
                        note.status === "approved" ? (
                          language === "am"
                            ? `✅ የእረፍት ጥያቄዎ ተፈቅዷል።`
                            : "✅ Your leave request has been approved."
                        ) : note.status === "rejected" ? (
                          language === "am"
                            ? `❌ የእረፍት ጥያቄዎ ተቀብሏል።`
                            : "❌ Your leave request has been rejected."
                        ) : (
                          language === "am"
                            ? "⏳ የእረፍት ጥያቄዎ በሂደት ላይ ነው።"
                            : "⏳ Your leave request is pending."
                        )
                      ) : (
                        note.message
                      )}
                    </p>
                    <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                      {new Date(note.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                      onClick={() => setSelectedNote(note)}
                    >
                      {language === "am" ? "ዝርዝር" : "Detail"}
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                      onClick={() => handleDelete(note._id)}
                    >
                      {language === "am" ? "ሰርዝ" : "Delete"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Detail Modal */}
          {selectedNote && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl max-w-lg w-full`}>
                <h2 className="text-xl font-bold mb-4">{language === "am" ? "ዝርዝር ማሳወቂያ" : "Notification Details"}</h2>
                <p className="mb-2"><strong>{language === "am" ? "መልእክት:" : "Message:"}</strong> {selectedNote.message}</p>
                {selectedNote.leaveRequestId && (
                  <p className="mb-2"><strong>{language === "am" ? "የእረፍት ጥያቄ መረጃ:" : "Leave Request Info:"}</strong> {selectedNote.leaveRequestId.startDate} - {selectedNote.leaveRequestId.endDate}</p>
                )}
                <p className="mb-4"><strong>{language === "am" ? "ደረሰኝ:" : "Recipient:"}</strong> {selectedNote.recipientRole}</p>
                <button
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
                  onClick={() => setSelectedNote(null)}
                >
                  {language === "am" ? "ዝጋ" : "Close"}
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default EmployeeNotifications;
