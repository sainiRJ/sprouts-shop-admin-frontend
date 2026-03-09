import { useState } from "react";
import {
  LayoutDashboard,
  FolderTree,
  Package,
  Users,
  ShoppingCart,
  Star,
  PanelLeftClose,
  PanelLeft,
  ShoppingBag,
  LogOut,
} from "lucide-react";
import { SidebarNavLink } from "./SidebarNavLink";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/categories", icon: FolderTree, label: "Categories" },
  { to: "/products", icon: Package, label: "Products" },
  { to: "/users", icon: Users, label: "Users" },
  { to: "/orders", icon: ShoppingCart, label: "Orders" },
  { to: "/reviews", icon: Star, label: "Reviews" },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside
      className={cn(
        "sticky top-0 h-screen flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-60",
      )}
    >
      <div className="flex items-center gap-2 px-4 py-5 border-b border-sidebar-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <ShoppingBag className="h-4 w-4" />
        </div>
        {!collapsed && (
          <span className="text-base font-bold text-foreground tracking-tight">
            ShopAdmin
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <SidebarNavLink key={item.to} {...item} collapsed={collapsed} />
        ))}
      </nav>

      <div className="px-3 pb-2">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 w-full rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors",
            collapsed && "justify-center px-0",
          )}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center border-t border-sidebar-border py-3 text-muted-foreground hover:text-foreground transition-colors"
      >
        {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
      </button>
    </aside>
  );
}

