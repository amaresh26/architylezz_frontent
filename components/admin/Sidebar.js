"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Home, Package,Settings, Folder, FileText, Inbox, Menu, Layers ,CircleUserRound} from "lucide-react";
import { motion } from "framer-motion";
import { gsap } from "gsap";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const sidebarRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (sidebarRef.current) {
      gsap.fromTo(
        sidebarRef.current,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
      );
    }
  }, []);

  const items = [
    { icon: <Home size={20} />, label: "Dashboard", path: "/admin" },
    { icon: <Package size={20} />, label: "Products", path: "/admin/products" },
    { icon: <Folder size={20} />, label: "Catalogues", path: "/admin/catalogues" },
    { icon: <FileText size={20} />, label: "Blog", path: "/admin/blog" },
    { icon: <Inbox size={20} />, label: "Contact Forms", path: "/admin/contact-forms" },
    { icon: <Layers size={20} />, label: "Projects", path: "/admin/projects" },
    { icon: <Settings size={20} />, label: "Home Meta", path: "/admin/home-meta" },
    { icon: <CircleUserRound size={20} />, label: "Settings", path: "/admin/settings" },

    ];

  return (
    <motion.aside
      ref={sidebarRef}
      animate={{ width: isOpen ? 240 : 64 }}
      transition={{ duration: 0.3 }}
      className="bg-black text-white flex flex-col"
    >
      {/* Top Section */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {isOpen && <span className="font-bold text-lg">Admin</span>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-gray-800 rounded-lg"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-3">
        {items.map((item, idx) => {
          const isActive = pathname === item.path;

          return (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              onClick={() => router.push(item.path)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition ${
                isActive ? "bg-gray-800 text-blue-400" : "hover:bg-gray-800"
              }`}
            >
              {item.icon}
              {isOpen && <span>{item.label}</span>}
            </motion.div>
          );
        })}
      </nav>
    </motion.aside>
  );
}
