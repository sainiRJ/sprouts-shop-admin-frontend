import { motion } from "framer-motion";
import { Bell, Coins } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export function AdminTopBar() {
  const { user } = useAuth();
  const displayName = user?.fullName || user?.email?.split("@")[0] || "Admin";
  const initial = (displayName[0] || "A").toUpperCase();

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-end gap-3 border-b border-border bg-card/90 px-6 backdrop-blur-md supports-[backdrop-filter]:bg-card/75 lg:px-8"
    >
      <button
        type="button"
        className="hidden sm:inline-flex items-center gap-2 rounded-full border border-border bg-secondary/80 px-4 py-1.5 text-xs font-semibold text-secondary-foreground shadow-sm transition hover:bg-secondary hover:shadow-md"
      >
        <Coins className="h-3.5 w-3.5 text-primary" />
        Credits
      </button>
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition hover:border-primary/25 hover:text-foreground"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />
      </motion.button>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3 shadow-sm"
      >
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-primary-foreground shadow-md",
            "bg-gradient-to-br from-primary to-[hsl(28_92%_48%)]",
          )}
        >
          {initial}
        </div>
        <span className="text-sm font-semibold text-foreground">{displayName}</span>
      </motion.div>
    </motion.header>
  );
}
