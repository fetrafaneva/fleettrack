"use client";

import { useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Info,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Sparkles,
  MoreHorizontal,
} from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";

const typeConfig = {
  info: {
    icon: Info,
    label: "Info",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.12)",
    soft: "#eff6ff",
  },
  success: {
    icon: CheckCircle2,
    label: "Succès",
    color: "#16a34a",
    bg: "rgba(22,163,74,0.08)",
    border: "rgba(22,163,74,0.12)",
    soft: "#f0fdf4",
  },
  warning: {
    icon: AlertTriangle,
    label: "Attention",
    color: "#d97706",
    bg: "rgba(217,119,6,0.08)",
    border: "rgba(217,119,6,0.12)",
    soft: "#fffbeb",
  },
  error: {
    icon: XCircle,
    label: "Erreur",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.12)",
    soft: "#fef2f2",
  },
};

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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <SheetTrigger asChild>
        <motion.button
          whileTap={{ scale: 0.94 }}
          className="relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300"
          style={{
            background: open ? "white" : "#f8fafc",
            border: open
              ? "1px solid rgba(249,115,22,0.18)"
              : "1px solid #e5e7eb",
            boxShadow: open ? "0 4px 14px rgba(249,115,22,0.12)" : "none",
          }}
        >
          <Bell
            className="h-4.5 w-4.5"
            style={{
              color: open ? "#f97316" : "#6b7280",
            }}
          />

          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1"
                style={{
                  background: "linear-gradient(135deg,#ef4444 0%,#dc2626 100%)",
                }}
              >
                <span className="text-[10px] font-black text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </SheetTrigger>

      {/* Content */}
      <SheetContent
        side="right"
        className="
    !top-6
    !right-6
    !h-[760px]
    !w-[420px]
    !rounded-[32px]
    !border
    !border-gray-200
    !p-0
    overflow-hidden
    shadow-[0_20px_60px_rgba(0,0,0,0.12)]
  "
        style={{
          background: "#fcfcfd",
        }}
      >
        <SheetTitle className="sr-only">Notifications</SheetTitle>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b border-gray-100 px-5 pt-6 pb-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "rgba(249,115,22,0.08)",
                  }}
                >
                  <Bell className="h-5 w-5 text-orange-500" />
                </div>

                <div>
                  <h2 className="text-lg font-black text-gray-800">
                    Notifications
                  </h2>

                  <p className="text-sm text-gray-400 mt-0.5">
                    {unreadCount > 0
                      ? `${unreadCount} non lue${unreadCount > 1 ? "s" : ""}`
                      : "Tout est à jour"}
                  </p>
                </div>
              </div>

              {unreadCount > 0 && (
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={markAllAsRead}
                  className="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
                  style={{
                    background: "rgba(249,115,22,0.08)",
                    color: "#f97316",
                    border: "1px solid rgba(249,115,22,0.14)",
                  }}
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Tout lire
                </motion.button>
              )}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mt-5 overflow-x-auto scrollbar-hide">
              {["Tout", "Non lues", "Info", "Succès"].map((tab, i) => (
                <button
                  key={tab}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    i === 0
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {" "}
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div
                  className="w-16 h-16 rounded-3xl flex items-center justify-center"
                  style={{
                    background: "rgba(249,115,22,0.08)",
                  }}
                >
                  <Sparkles className="h-7 w-7 text-orange-400" />
                </div>

                <h3 className="mt-4 text-sm font-bold text-gray-700">
                  Tout est calme ici
                </h3>

                <p className="text-xs text-gray-400 mt-1 max-w-[200px] leading-relaxed">
                  Les nouvelles notifications apparaîtront ici automatiquement.
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {notifications.map((notif, index) => {
                  const config = typeConfig[notif.type];
                  const Icon = config.icon;

                  return (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.04 }}
                      className="group rounded-3xl border bg-white p-4 transition-all duration-300 hover:shadow-md"
                      style={{
                        borderColor: notif.read ? "#f1f5f9" : config.border,
                        background: notif.read ? "white" : config.soft,
                        opacity: notif.read ? 0.72 : 1,
                      }}
                    >
                      <div className="flex gap-4">
                        {/* Icon */}
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                          style={{
                            background: config.bg,
                          }}
                        >
                          <Icon
                            className="h-5 w-5"
                            style={{
                              color: config.color,
                            }}
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className="text-xs font-bold"
                                  style={{
                                    color: config.color,
                                  }}
                                >
                                  {config.label}
                                </span>

                                <span className="text-xs text-gray-400">
                                  {timeAgo(notif.created_at)}
                                </span>
                              </div>

                              <h3 className="text-[15px] font-bold text-gray-800 mt-1 leading-tight">
                                {notif.title}
                              </h3>
                            </div>

                            {!notif.read && (
                              <div
                                className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0"
                                style={{
                                  background: config.color,
                                }}
                              />
                            )}
                          </div>

                          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                            {notif.message}
                          </p>

                          <div className="flex items-center justify-between mt-4">
                            {!notif.read ? (
                              <motion.button
                                whileTap={{ scale: 0.94 }}
                                onClick={() => markAsRead(notif.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                                style={{
                                  background: config.bg,
                                  color: config.color,
                                }}
                              >
                                <Check className="h-3 w-3" />
                                Marquer comme lu
                              </motion.button>
                            ) : (
                              <div className="text-xs text-gray-300 font-medium">
                                Déjà lu
                              </div>
                            )}

                            <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="h-4 w-4 text-gray-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
