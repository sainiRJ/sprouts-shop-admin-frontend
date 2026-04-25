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
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";

const statusColors = {
  pending: "bg-chart-2/20 text-chart-2",
  processing: "bg-warning/20 text-warning",
  shipped: "bg-chart-5/20 text-chart-5",
  delivered: "bg-success/20 text-success",
  cancelled: "bg-destructive/20 text-destructive",
};

const allStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

const openInvoice = (order) => {
  const rows = (order.orderItems || [])
    .map(
      (item) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #eee">${item.name ?? "-"}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity ?? 0}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">₹${Number(item.price ?? 0).toFixed(2)}</td>
      </tr>
    `,
    )
    .join("");

  const win = window.open("", "_blank");
  if (!win) return false;
  win.document.write(`
    <html><head><title>Invoice</title></head>
    <body style="font-family:system-ui,sans-serif;max-width:700px;margin:24px auto;padding:0 16px;">
      <h2>Invoice</h2>
      <p>Order #${order.orderNumber || order._id}</p>
      <p>Customer: ${order.user?.fullName || "-"} (${order.user?.email || "-"})</p>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr>
            <th style="text-align:left;border-bottom:2px solid #111;padding:8px;">Item</th>
            <th style="text-align:center;border-bottom:2px solid #111;padding:8px;">Qty</th>
            <th style="text-align:right;border-bottom:2px solid #111;padding:8px;">Price</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="font-weight:700;margin-top:16px;">Total: ₹${Number(order.totalAmount || 0).toFixed(2)}</p>
    </body></html>
  `);
  win.document.close();
  win.focus();
  win.onload = () => win.print();
  return true;
};

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
      toast.error(getApiErrorMessage(error, "Failed to update order status. Please try again."));
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
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Invoice
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
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            const ok = openInvoice(o);
                            if (!ok) toast.error("Unable to open invoice window.");
                          }}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          Download
                        </button>
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

