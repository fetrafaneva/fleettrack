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
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useRole } from "@/hooks/useRole";

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
  { title: "Utilisateurs", href: "/users", icon: Shield, roles: ["admin"] },
];

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

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Truck className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">FleetTrack</span>
        </div>
        {profile && (
          <div className="mt-2">
            <p className="text-xs font-medium">
              {profile.full_name || profile.email}
            </p>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                profile.role === "admin"
                  ? "bg-red-100 text-red-700"
                  : profile.role === "manager"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {profile.role === "admin"
                ? "Admin"
                : profile.role === "manager"
                ? "Manager"
                : "Conducteur"}
            </span>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {loading ? (
                <div className="px-3 py-2 text-xs text-muted-foreground">
                  Chargement...
                </div>
              ) : (
                filteredNavItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Button variant="outline" className="w-full" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Déconnexion
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
