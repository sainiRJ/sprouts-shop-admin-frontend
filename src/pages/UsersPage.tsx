import { motion } from "framer-motion";
import { mockUsers } from "@/data/mockData";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/PaginationControls";

const UsersPage = () => {
  const { page, totalPages, paginatedItems, next, prev, goTo } = usePagination(mockUsers, 5);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground mt-1">Customer accounts and activity</p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Orders</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Spent</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {paginatedItems.map((u) => (
                <tr key={u.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                        {u.avatar}
                      </div>
                      <div>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${u.status === "active" ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{u.totalOrders}</td>
                  <td className="px-4 py-3 font-medium">₹{u.totalSpent.toLocaleString()}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.joinedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PaginationControls page={page} totalPages={totalPages} onPrev={prev} onNext={next} onGoTo={goTo} />
      </div>
    </motion.div>
  );
};

export default UsersPage;
