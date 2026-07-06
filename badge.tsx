import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Siren, Users, LogOut, Shield, Menu, X, Map as MapIcon, AlertTriangle, Command } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const BASE_NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/sos", label: "Emergency SOS", icon: Siren },
  { to: "/map", label: "Safety Map", icon: MapIcon },
  { to: "/incidents", label: "Incidents", icon: AlertTriangle },
  { to: "/contacts", label: "Trusted Circle", icon: Users },
] as const;

const ADMIN_NAV = { to: "/admin", label: "Command Center", icon: Command } as const;

function useIsPrivileged() {
  const [is, setIs] = useState(false);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: userRes } = await supabase.auth.getUser();
      if (!userRes.user) return;
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", userRes.user.id);
      if (!cancelled) setIs((data ?? []).some((r) => r.role === "admin" || r.role === "police"));
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return is;
}

export function AppShell({ children, title }: { children: ReactNode; title?: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const isPrivileged = useIsPrivileged();

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar (desktop) */}
      <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-border/60 bg-sidebar p-4 md:flex">
        <SidebarInner pathname={pathname} onSignOut={signOut} showAdmin={isPrivileged} />
      </aside>


      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
          <aside
            className="absolute left-0 top-0 flex h-full w-72 flex-col border-r border-border/60 bg-sidebar p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex justify-end">
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <SidebarInner pathname={pathname} onSignOut={signOut} showAdmin={isPrivileged} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border/60 bg-background/70 px-4 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            {title && <h1 className="text-base font-semibold md:text-lg">{title}</h1>}
          </div>
          <Link to="/sos">
            <Button size="sm" className="gradient-primary text-primary-foreground shadow-glow">
              <Siren className="mr-1.5 h-4 w-4" /> SOS
            </Button>
          </Link>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}

function SidebarInner({
  pathname,
  onSignOut,
  onNavigate,
  showAdmin,
}: {
  pathname: string;
  onSignOut: () => void;
  onNavigate?: () => void;
  showAdmin?: boolean;
}) {
  const items = showAdmin ? [...BASE_NAV, ADMIN_NAV] : BASE_NAV;
  return (
    <>
      <Link to="/dashboard" onClick={onNavigate} className="mb-8 flex items-center gap-2 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary text-primary-foreground shadow-glow">
          <Shield className="h-5 w-5" />
        </div>
        <span className="text-lg font-bold tracking-tight">SafeHer</span>
      </Link>
      <nav className="flex-1 space-y-1">
        {items.map((item) => {
          const Active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                Active
                  ? "bg-primary/10 text-primary"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={onSignOut}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </>
  );
}
