"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import api from "@/utils/api";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [changingEmail, setChangingEmail] = useState(false);

  const [adminEmail, setAdminEmail] = useState("");

  // ---------------------------------------------
  // 🔹 Fetch current email when settings open
  // ---------------------------------------------
  useEffect(() => {
    async function loadEmail() {
      try {
        const res = await api.get("/owner/get");
        setAdminEmail(res.data.email);
      } catch (err) {
        console.log("No email found yet");
      }
    }
    loadEmail();
  }, []);

  // ---------------------------------------------
  // 🔐 Change Password Handler
  // ---------------------------------------------
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setChangingPassword(true);

    try {
      await api.post("/owner/change-password", {
        email: adminEmail,
        currentPassword,
        newPassword,
      });

      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  // ---------------------------------------------
  // 🔐 Change Email Handler
  // ---------------------------------------------
  const handleEmailChange = async (e) => {
    e.preventDefault();
    setChangingEmail(true);

    try {
      await api.post("/owner/change-email", {
        currentEmail,
        newEmail,
      });

      toast.success("Email changed successfully!");
      setCurrentEmail("");
      setNewEmail("");
      setAdminEmail(newEmail);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to change email");
    } finally {
      setChangingEmail(false);
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-md">

      {/* ------------------- Password Section ------------------- */}
      <div className="bg-white p-4 rounded shadow space-y-3">
        <h2 className="text-lg font-semibold">Change Password</h2>

        <form onSubmit={handlePasswordChange} className="space-y-3">
          {/* Current Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full p-2 border rounded pr-10"
            />
          </div>

          {/* New Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full p-2 border rounded pr-10"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={changingPassword}
            className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            {changingPassword ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>

      {/* ------------------- Email Section ------------------- */}
      <div className="bg-white p-4 rounded shadow space-y-3">
        <h2 className="text-lg font-semibold">Change Email</h2>

        <form onSubmit={handleEmailChange} className="space-y-3">
          <input
            type="email"
            placeholder="Current Email"
            value={currentEmail}
            onChange={(e) => setCurrentEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />

          <input
            type="email"
            placeholder="New Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />

          <button
            type="submit"
            disabled={changingEmail}
            className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            {changingEmail ? "Changing..." : "Change Email"}
          </button>
        </form>
      </div>

    </div>
  );
}
