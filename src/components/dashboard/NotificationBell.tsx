"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Info,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { motion, AnimatePresence } from "framer-motion";

const typeConfig = {
  info: {
    icon: Info,
    label: "Info",
    color: "#3b82f6",
    cardBg: "#f0f4ff",
    iconBg: "#dbeafe",
    dot: "#3b82f6",
  },
  success: {
    icon: CheckCircle2,
    label: "Succès",
    color: "#16a34a",
    cardBg: "#f0fdf4",
    iconBg: "#dcfce7",
    dot: "#22c55e",
  },
  warning: {
    icon: AlertTriangle,
    label: "Attention",
    color: "#d97706",
    cardBg: "#fefce8",
    iconBg: "#fef9c3",
    dot: "#d97706",
  },
  error: {
    icon: XCircle,
    label: "Erreur",
    color: "#dc2626",
    cardBg: "#fff5f5",
    iconBg: "#fee2e2",
    dot: "#ef4444",
  },
};

const filters = [
  { key: "all", label: "Tout" },
  { key: "unread", label: "Non lues" },
  { key: "info", label: "Info" },
  { key: "success", label: "Succès" },
  { key: "warning", label: "Alertes" },
  { key: "error", label: "Erreurs" },
];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  });
}

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const [open, setOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const filtered =
    activeFilter === "all"
      ? notifications
      : activeFilter === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications.filter((n) => n.type === activeFilter);

  return (
    <div className="relative" ref={ref}>
      {/* Bouton */}
      <motion.button
        whileTap={{ scale: 0.93 }}
        onClick={() => setOpen(!open)}
        className="relative w-9 h-9 rounded-xl flex items-center justify-center"
        style={{
          background: open ? "#fff7ed" : "white",
          border: open ? "1px solid #fed7aa" : "1px solid #e5e7eb",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        <Bell
          className="h-4 w-4"
          style={{ color: open ? "#f97316" : "#9ca3af" }}
        />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 text-[10px] font-black text-white"
              style={{ background: "#ef4444" }}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Popup flottante */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40 md:hidden"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="z-50 flex flex-col overflow-hidden fixed left-3 right-3 top-16 md:absolute md:left-auto md:right-0 md:top-12 md:w-[400px]"
              style={{
                maxHeight: "calc(100vh - 80px)",
                background: "white",
                borderRadius: 24,
                border: "1px solid #e5e7eb",
                boxShadow:
                  "0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)",
              }}
            >
              {/* Header */}
              <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center"
                      style={{ background: "#fff7ed" }}
                    >
                      <Bell className="h-4 w-4 text-orange-400" />
                    </div>
                    <div>
                      <h2 className="text-base font-black text-gray-900">
                        Notifications
                      </h2>
                      <p className="text-xs text-gray-400">
                        {unreadCount > 0
                          ? `${unreadCount} non lue${
                              unreadCount > 1 ? "s" : ""
                            }`
                          : "Tout est à jour"}
                      </p>
                    </div>
                  </div>
                  {unreadCount > 0 && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={markAllAsRead}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border"
                      style={{
                        background: "white",
                        color: "#374151",
                        borderColor: "#e5e7eb",
                      }}
                    >
                      <CheckCheck className="h-3.5 w-3.5" />
                      Tout lire
                    </motion.button>
                  )}
                </div>

                {/* Filtres */}
                <div className="flex gap-1.5 overflow-x-auto pb-0.5">
                  {filters.map((f) => {
                    const isActive = activeFilter === f.key;
                    return (
                      <button
                        key={f.key}
                        onClick={() => setActiveFilter(f.key)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 border"
                        style={{
                          background: isActive ? "#111827" : "white",
                          color: isActive ? "white" : "#6b7280",
                          borderColor: isActive ? "#111827" : "#e5e7eb",
                        }}
                      >
                        {f.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Liste */}
              <div
                className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
                style={{ background: "#f9fafb", maxHeight: 380 }}
              >
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-orange-400" />
                    </div>
                    <p className="font-bold text-gray-600 text-sm">
                      {activeFilter === "unread"
                        ? "Tout a été lu !"
                        : "Aucune notification"}
                    </p>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {filtered.map((notif, index) => {
                      const config = typeConfig[notif.type];
                      const Icon = config.icon;
                      return (
                        <motion.div
                          key={notif.id}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: index * 0.03 }}
                          className="rounded-2xl p-4"
                          style={{
                            background: notif.read ? "white" : config.cardBg,
                            border: "1px solid",
                            borderColor: notif.read ? "#f1f5f9" : "transparent",
                            opacity: notif.read ? 0.65 : 1,
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{ background: config.iconBg }}
                            >
                              <Icon
                                className="h-4 w-4"
                                style={{ color: config.color }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-0.5">
                                <div className="flex items-center gap-2">
                                  <span
                                    className="text-xs font-bold"
                                    style={{ color: config.color }}
                                  >
                                    {config.label}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    {timeAgo(notif.created_at)}
                                  </span>
                                </div>
                                <div
                                  className="w-2 h-2 rounded-full flex-shrink-0"
                                  style={{
                                    background: notif.read
                                      ? "#e5e7eb"
                                      : config.dot,
                                  }}
                                />
                              </div>
                              <p className="text-sm font-bold text-gray-800 leading-snug">
                                {notif.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                                {notif.message}
                              </p>
                              {!notif.read && (
                                <motion.button
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => markAsRead(notif.id)}
                                  className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-gray-600 hover:border-gray-300 transition-all"
                                >
                                  <Check className="h-3 w-3" />
                                  Marquer comme lu
                                </motion.button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="flex-shrink-0 px-5 py-3 bg-white border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {notifications.length} notification
                    {notifications.length > 1 ? "s" : ""} au total
                  </span>
                  {unreadCount === 0 && (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-green-500">
                      <Check className="h-3 w-3" />
                      Tout lu
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
