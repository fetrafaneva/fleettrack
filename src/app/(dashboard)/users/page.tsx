"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRole } from "@/hooks/useRole";
import { Shield, User, Briefcase } from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "manager" | "driver";
  created_at: string;
}

const roleConfig = {
  admin: {
    label: "Admin",
    className: "bg-red-100 text-red-700",
    icon: Shield,
  },
  manager: {
    label: "Manager",
    className: "bg-blue-100 text-blue-700",
    icon: Briefcase,
  },
  driver: {
    label: "Conducteur",
    className: "bg-green-100 text-green-700",
    icon: User,
  },
};

export default function UsersPage() {
  const { isAdmin, loading: roleLoading } = useRole();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    if (data.success) setUsers(data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, role: string) => {
    setUpdating(userId);
    const res = await fetch("/api/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role }),
    });
    const data = await res.json();
    if (data.success) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, role: role as UserProfile["role"] } : u
        )
      );
    }
    setUpdating(null);
  };

  if (roleLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Shield className="h-12 w-12 text-muted-foreground opacity-30" />
        <p className="text-muted-foreground">
          Accès réservé aux administrateurs
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Gestion des utilisateurs</h2>
        <p className="text-muted-foreground">Gérer les rôles et permissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(roleConfig).map(([key, val]) => {
          const Icon = val.icon;
          return (
            <Card key={key}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${val.className}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {users.filter((u) => u.role === key).length}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {val.label}s
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Liste utilisateurs */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Chargement...
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => {
            const config = roleConfig[user.role];
            const Icon = config.icon;
            return (
              <Card key={user.id}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                        {user.full_name?.[0] || user.email[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {user.full_name || "Sans nom"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 ${config.className}`}
                      >
                        <Icon className="h-3 w-3" />
                        {config.label}
                      </span>
                      <select
                        className="border rounded-md px-2 py-1 text-sm"
                        value={user.role}
                        disabled={updating === user.id}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value)
                        }
                      >
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="driver">Conducteur</option>
                      </select>
                      {updating === user.id && (
                        <span className="text-xs text-muted-foreground">
                          Mise à jour...
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
