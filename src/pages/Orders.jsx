import { useState } from "react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  useGetAdminOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/store/api";
import { PaginationControls } from "@/components/PaginationControls";

const statusColors = {
  pending: "bg-chart-2/20 text-chart-2",
  processing: "bg-warning/20 text-warning",
  shipped: "bg-chart-5/20 text-chart-5",
  delivered: "bg-success/20 text-success",
  cancelled: "bg-destructive/20 text-destructive",
};

const allStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

const Orders = () => {
  const [page, setPage] = useState(1);
  const limit = 5;
  const { data, isLoading, isError } = useGetAdminOrdersQuery({ page, limit });
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const orders = data?.orders || [];
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

  const updateStatus = async (id, status, label) => {
    try {
      await updateOrderStatus({ id, status }).unwrap();
      toast.success(`Order ${label} → ${status}`);
    } catch (error) {
      const message =
        error?.data?.error || "Failed to update order status. Please try again.";
      toast.error(message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track and manage customer orders
        </p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-6 text-sm text-muted-foreground">
              Loading orders...
            </div>
          ) : isError ? (
            <div className="p-6 text-sm text-destructive">
              Failed to load orders.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {orders.map((o) => {
                  const idLabel = o.orderNumber || o._id?.slice(-8);
                  return (
                    <tr
                      key={o._id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono font-medium text-primary">
                        {idLabel}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{o.user?.fullName}</p>
                        <p className="text-xs text-muted-foreground">
                          {o.user?.email}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {o.orderItems?.length ?? 0}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        ₹{o.totalAmount}
                      </td>
                      <td className="px-4 py-3">
                        <Select
                          value={o.orderStatus}
                          onValueChange={(v) =>
                            updateStatus(o._id, v, idLabel)
                          }
                        >
                          <SelectTrigger
                            className={`w-[130px] h-7 text-[11px] font-semibold border-0 ${
                              statusColors[o.orderStatus]
                            }`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {allStatuses.map((s) => (
                              <SelectItem
                                key={s}
                                value={s}
                                className="capitalize text-xs"
                              >
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {o.createdAt
                          ? new Date(o.createdAt).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  );
                })}
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

export default Orders;

