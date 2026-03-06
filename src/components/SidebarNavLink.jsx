import { NavLink as RouterNavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

export function SidebarNavLink({ to, icon: Icon, label, collapsed }) {
  return (
    <RouterNavLink
      to={to}
      end
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
        )
      }
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />
      {!collapsed && <span>{label}</span>}
    </RouterNavLink>
  );
}

