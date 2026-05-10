"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Truck, User, Mail, Lock, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.fullName },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex">
      {/* Panneau gauche — formulaire */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Header mobile */}
          <div className="flex items-center gap-2 lg:hidden">
            <div
              className="p-2 rounded-xl"
              style={{
                background: "linear-gradient(135deg, #f97316, #f59e0b)",
              }}
            >
              <Truck className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl">FleetTrack</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">
              Créer un compte
            </h2>
            <p className="text-muted-foreground">
              Rejoignez FleetTrack et gérez votre flotte
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nom complet */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Nom complet
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  className="w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-background transition-all"
                  placeholder="Rakoto Jean"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  className="w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-background transition-all"
                  placeholder="votre@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  className="w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-background transition-all"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Confirmer mot de passe */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  className="w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-background transition-all"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Erreur */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-white font-medium text-sm flex items-center justify-center gap-2 transition-opacity disabled:opacity-70"
              style={{
                background: loading
                  ? "#f97316"
                  : "linear-gradient(135deg, #f97316 0%, #f59e0b 100%)",
              }}
            >
              {loading ? (
                "Création en cours..."
              ) : (
                <>
                  Créer mon compte
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <p className="text-center text-sm text-muted-foreground">
              Déjà un compte ?{" "}
              <Link
                href="/login"
                className="font-medium hover:underline"
                style={{ color: "#f97316" }}
              >
                Se connecter
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Panneau droit — dégradé */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #f97316 0%, #f59e0b 50%, #ef4444 100%)",
        }}
      >
        {/* Cercles décoratifs */}
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20"
          style={{ background: "rgba(255,255,255,0.4)" }}
        />
        <div
          className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full opacity-20"
          style={{ background: "rgba(255,255,255,0.4)" }}
        />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-11 h-11 bg-white/20 rounded-2xl border border-white/30 flex items-center justify-center">
            <Truck className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-white font-black text-xl tracking-tight">
            FleetTrack
          </span>
        </div>

        {/* Centre */}
        <div className="relative z-10 space-y-6">
          <h1 className="text-5xl font-black text-white leading-tight">
            Rejoignez
            <br />
            <span className="text-white/60">l'aventure.</span>
          </h1>
          <p className="text-white/70 text-base max-w-xs leading-relaxed">
            Créez votre compte et prenez le contrôle de votre flotte dès
            aujourd'hui.
          </p>
        </div>

        {/* Footer */}
        <p className="text-white/40 text-xs relative z-10">
          © 2025 FleetTrack · Made in Madagascar 🇲🇬
        </p>
      </div>
    </div>
  );
}
