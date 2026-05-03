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
} from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const typeConfig = {
  info: { icon: Info, className: "text-blue-500", bg: "bg-blue-50" },
  success: {
    icon: CheckCircle,
    className: "text-green-500",
    bg: "bg-green-50",
  },
  warning: {
    icon: AlertTriangle,
    className: "text-orange-500",
    bg: "bg-orange-50",
  },
  error: { icon: XCircle, className: "text-red-500", bg: "bg-red-50" },
};

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px]">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle>Notifications</SheetTitle>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Tout marquer lu
            </Button>
          )}
        </SheetHeader>

        <div className="mt-4 space-y-2 overflow-y-auto max-h-[calc(100vh-100px)]">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Aucune notification</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const config = typeConfig[notif.type];
              const Icon = config.icon;
              return (
                <div
                  key={notif.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    notif.read
                      ? "bg-background opacity-60"
                      : "bg-muted/50 border-primary/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-1.5 rounded-md ${config.bg} mt-0.5`}>
                      <Icon className={`h-3.5 w-3.5 ${config.className}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{notif.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {notif.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notif.created_at).toLocaleString("fr-FR", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {!notif.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0"
                        onClick={() => markAsRead(notif.id)}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
