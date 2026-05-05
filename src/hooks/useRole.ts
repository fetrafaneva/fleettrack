"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type UserRole = "admin" | "manager" | "driver";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
}

export function useRole() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("user_roles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) setProfile(data);
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const isAdmin = profile?.role === "admin";
  const isManager = profile?.role === "manager" || isAdmin;
  const isDriver = profile?.role === "driver";

  return { profile, loading, isAdmin, isManager, isDriver };
}
