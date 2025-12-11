"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/utils/api";

export default function AdminLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dashboardRef = useRef(null);

  // ------------------------------------------
  // 🔐 CLEAN LOGIN (no firstTime)
  // ------------------------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    setLoading(true);

    try {
      await api.post("/owner/login", { email, password });

      toast.success("Welcome Admin!");
      setIsAuthenticated(true);
      sessionStorage.setItem("admin-auth", "true");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------
  // 🔄 Keep Session On Refresh
  // ------------------------------------------
  useEffect(() => {
    if (sessionStorage.getItem("admin-auth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // ------------------------------------------
  // ✨ Dashboard Fade Animation
  // ------------------------------------------
  useEffect(() => {
    if (isAuthenticated && dashboardRef.current) {
      gsap.fromTo(
        dashboardRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );
    }
  }, [isAuthenticated]);

  return (
    <>
      <AnimatePresence>
        {!isAuthenticated && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm"
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                Admin Login
              </h2>

              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email */}
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900 placeholder-gray-500"
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    required
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900 placeholder-gray-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition"
                >
                  {loading ? "Checking..." : "Login"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dashboard */}
      {isAuthenticated && (
        <div ref={dashboardRef} className="h-screen flex bg-white">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Topbar
              onLogout={() => {
                sessionStorage.removeItem("admin-auth");
                setIsAuthenticated(false);
              }}
            />
            <main className="flex-1 overflow-y-auto p-6 text-gray-900">
              {children}
            </main>
          </div>
        </div>
      )}
    </>
  );
}
