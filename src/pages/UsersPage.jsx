import { useState } from "react";
import { motion } from "framer-motion";
import { useGetAdminUsersQuery } from "@/store/api";
import { PaginationControls } from "@/components/PaginationControls";

const UsersPage = () => {
  const [page, setPage] = useState(1);
  const limit = 5;
  const { data, isLoading, isError } = useGetAdminUsersQuery({ page, limit });

  const users = data?.users || [];
  const totalPages = data?.pagination?.pages || 1;

  const next = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  const prev = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const goTo = (p) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Customer accounts and activity
        </p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-6 text-sm text-muted-foreground">
              Loading users...
            </div>
          ) : isError ? (
            <div className="p-6 text-sm text-destructive">
              Failed to load users.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                          {u.fullName?.[0] ?? "U"}
                        </div>
                        <div>
                          <p className="font-medium">{u.fullName}</p>
                          <p className="text-xs text-muted-foreground">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize bg-muted text-muted-foreground">
                        {u.role || "customer"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <PaginationControls
          page={page}
          totalPages={totalPages}
          onPrev={prev}
          onNext={next}
          onGoTo={goTo}
        />
      </div>
    </motion.div>
  );
};

export default UsersPage;

