"use client";

import { useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Info,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
const typeConfig = {
  info: {
    icon: Info,
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.15)",
    dot: "#3b82f6",
  },
  success: {
    icon: CheckCircle,
    color: "#16a34a",
    bg: "rgba(22,163,74,0.08)",
    border: "rgba(22,163,74,0.15)",
    dot: "#16a34a",
  },
  warning: {
    icon: AlertTriangle,
    color: "#d97706",
    bg: "rgba(217,119,6,0.08)",
    border: "rgba(217,119,6,0.15)",
    dot: "#d97706",
  },
  error: {
    icon: XCircle,
    color: "#ef4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.15)",
    dot: "#ef4444",
  },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours}h`;
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
      <SheetTrigger asChild>
        <motion.button
          whileTap={{ scale: 0.92 }}
          className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all"
          style={{
            background: open
              ? "linear-gradient(135deg, #f97316, #f59e0b)"
              : "#f8f9fa",
            border: "1px solid #e5e7eb",
          }}
        >
          <Bell
            className="h-4 w-4"
            style={{ color: open ? "white" : "#6b7280" }}
          />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center text-white text-[10px] font-black rounded-full px-1"
                style={{
                  background: "linear-gradient(135deg, #ef4444, #dc2626)",
                }}
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </SheetTrigger>

      <SheetContent
        className="w-[380px] p-0 border-l border-gray-100 overflow-hidden"
        style={{ background: "#f8f9fa" }}
      >
        <SheetTitle className="sr-only">Notifications</SheetTitle>

        {/* Header */}
        <div className="px-5 pt-6 pb-4 bg-white border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-black text-lg text-gray-800">
                Notifications
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {unreadCount > 0
                  ? `${unreadCount} non lue${unreadCount > 1 ? "s" : ""}`
                  : "Tout est à jour"}
              </p>
            </div>
            {unreadCount > 0 && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={markAllAsRead}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: "rgba(249,115,22,0.08)",
                  color: "#f97316",
                  border: "1px solid rgba(249,115,22,0.15)",
                }}
              >
                <CheckCheck className="h-3 w-3" />
                Tout lire
              </motion.button>
            )}
          </div>

          {/* Indicateur non lues */}
          {unreadCount > 0 && (
            <div
              className="flex items-center gap-2 mt-3 px-3 py-2 rounded-xl"
              style={{
                background: "rgba(249,115,22,0.06)",
                border: "1px solid rgba(249,115,22,0.12)",
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              <span className="text-xs text-orange-500 font-medium">
                {unreadCount} nouvelle{unreadCount > 1 ? "s" : ""} notification
                {unreadCount > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Liste */}
        <div className="overflow-y-auto h-[calc(100vh-140px)] px-4 py-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(249,115,22,0.08)" }}
              >
                <Sparkles className="h-7 w-7 text-orange-400" />
              </div>
              <p className="font-bold text-gray-600 text-sm">
                Tout est calme ici
              </p>
              <p className="text-xs text-gray-400 text-center max-w-[180px]">
                Vos notifications apparaîtront ici
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
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.04 }}
                    className="rounded-2xl overflow-hidden transition-all"
                    style={{
                      background: notif.read ? "white" : "white",
                      border: notif.read
                        ? "1px solid #f1f5f9"
                        : `1px solid ${config.border}`,
                      opacity: notif.read ? 0.6 : 1,
                      boxShadow: notif.read
                        ? "none"
                        : "0 2px 12px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Icône */}
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: config.bg }}
                        >
                          <Icon
                            className="h-4 w-4"
                            style={{ color: config.color }}
                          />
                        </div>

                        {/* Contenu */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-bold text-gray-800 leading-tight">
                              {notif.title}
                            </p>
                            {!notif.read && (
                              <div
                                className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                                style={{ background: config.dot }}
                              />
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            {notif.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-400">
                              {timeAgo(notif.created_at)}
                            </span>
                            {!notif.read && (
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => markAsRead(notif.id)}
                                className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg transition-all"
                                style={{
                                  background: config.bg,
                                  color: config.color,
                                }}
                              >
                                <Check className="h-2.5 w-2.5" />
                                Lu
                              </motion.button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
