"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  Users,
  MapPin,
  ClipboardList,
  BarChart3,
  Truck,
  LogOut,
  Shield,
  ChevronRight,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { supabase } from "@/lib/supabase";
import { useRole } from "@/hooks/useRole";
import { motion } from "framer-motion";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "manager", "driver"],
  },
  {
    title: "Véhicules",
    href: "/fleet",
    icon: Car,
    roles: ["admin", "manager", "driver"],
  },
  {
    title: "Conducteurs",
    href: "/drivers",
    icon: Users,
    roles: ["admin", "manager"],
  },
  {
    title: "Carte",
    href: "/map",
    icon: MapPin,
    roles: ["admin", "manager", "driver"],
  },
  {
    title: "Missions",
    href: "/missions",
    icon: ClipboardList,
    roles: ["admin", "manager", "driver"],
  },
  {
    title: "Rapports",
    href: "/reports",
    icon: BarChart3,
    roles: ["admin", "manager"],
  },
  {
    title: "Mes Missions",
    href: "/my-missions",
    icon: ClipboardList,
    roles: ["driver"],
  },
  { title: "Utilisateurs", href: "/users", icon: Shield, roles: ["admin"] },
];

const roleConfig = {
  admin: {
    label: "Administrateur",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.08)",
  },
  manager: { label: "Manager", color: "#3b82f6", bg: "rgba(59,130,246,0.08)" },
  driver: { label: "Conducteur", color: "#16a34a", bg: "rgba(22,163,74,0.08)" },
};

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, loading } = useRole();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const filteredNavItems = navItems.filter((item) =>
    loading
      ? true
      : profile
      ? item.roles.includes(profile.role)
      : item.roles.includes("driver")
  );

  const role = profile?.role as keyof typeof roleConfig | undefined;
  const roleInfo = role ? roleConfig[role] : null;

  return (
    <Sidebar className="border-r border-gray-100">
      <div className="flex flex-col h-full" style={{ background: "#f8f9fa" }}>
        {/* Header */}
        <SidebarHeader className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #f97316, #f59e0b)",
              }}
            >
              <Truck className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-black text-base tracking-tight text-gray-800">
                FleetTrack
              </span>
              <p className="text-gray-400 text-xs">Fleet Management</p>
            </div>
          </div>
        </SidebarHeader>

        {/* Profile */}
        {profile && (
          <div className="px-4 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                style={{
                  background: roleInfo?.bg || "#f1f5f9",
                  color: roleInfo?.color || "#64748b",
                  border: `1px solid ${roleInfo?.color}20`,
                }}
              >
                {(profile.full_name || profile.email)[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-gray-700 text-xs font-semibold truncate">
                  {profile.full_name || profile.email}
                </p>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{
                    background: roleInfo?.bg,
                    color: roleInfo?.color,
                  }}
                >
                  {roleInfo?.label}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <SidebarContent className="flex-1 px-3 py-4 overflow-y-auto">
          <SidebarGroup>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest px-3 mb-3">
              Menu
            </p>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {loading ? (
                  <div className="space-y-2 px-3">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="h-9 rounded-xl bg-gray-200 animate-pulse"
                      />
                    ))}
                  </div>
                ) : (
                  filteredNavItems.map((item, index) => {
                    const isActive = pathname === item.href;
                    return (
                      <SidebarMenuItem key={item.href}>
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200"
                            style={{
                              background: isActive ? "white" : "transparent",
                              boxShadow: isActive
                                ? "0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(249,115,22,0.12)"
                                : "none",
                            }}
                          >
                            {/* Icône */}
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
                              style={{
                                background: isActive
                                  ? "linear-gradient(135deg, #f97316, #f59e0b)"
                                  : "#efefef",
                              }}
                            >
                              <item.icon
                                className="h-3.5 w-3.5"
                                style={{
                                  color: isActive ? "white" : "#9ca3af",
                                }}
                              />
                            </div>

                            {/* Label */}
                            <span
                              className="text-sm font-medium flex-1"
                              style={{
                                color: isActive ? "#1f2937" : "#6b7280",
                              }}
                            >
                              {item.title}
                            </span>

                            {/* Flèche */}
                            {isActive && (
                              <ChevronRight className="h-3.5 w-3.5 text-orange-400" />
                            )}
                          </Link>
                        </motion.div>
                      </SidebarMenuItem>
                    );
                  })
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-red-50"
            style={{
              border: "1px solid #fee2e2",
              background: "rgba(239,68,68,0.04)",
            }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50">
              <LogOut className="h-3.5 w-3.5 text-red-400" />
            </div>
            <span className="text-sm font-medium text-red-400">
              Déconnexion
            </span>
          </button>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
