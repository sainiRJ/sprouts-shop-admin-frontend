import { useState } from "react";
import { motion } from "framer-motion";
import { mockOrders, Order } from "@/data/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/PaginationControls";

const statusColors: Record<string, string> = {
  pending: "bg-chart-2/20 text-chart-2",
  processing: "bg-warning/20 text-warning",
  shipped: "bg-chart-5/20 text-chart-5",
  delivered: "bg-success/20 text-success",
  cancelled: "bg-destructive/20 text-destructive",
};

const allStatuses: Order["status"][] = ["pending", "processing", "shipped", "delivered", "cancelled"];

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const { page, totalPages, paginatedItems, next, prev, goTo } = usePagination(orders, 5);

  const updateStatus = (id: string, status: Order["status"]) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    toast.success(`Order ${id} → ${status}`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">Track and manage customer orders</p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Items</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {paginatedItems.map((o) => (
                <tr key={o.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-mono font-medium text-primary">{o.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{o.customerName}</p>
                    <p className="text-xs text-muted-foreground">{o.customerEmail}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{o.items}</td>
                  <td className="px-4 py-3 font-medium">₹{o.total}</td>
                  <td className="px-4 py-3">
                    <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v as Order["status"])}>
                      <SelectTrigger className={`w-[130px] h-7 text-[11px] font-semibold border-0 ${statusColors[o.status]}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {allStatuses.map((s) => (
                          <SelectItem key={s} value={s} className="capitalize text-xs">{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{o.createdAt}</td>
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

export default Orders;
