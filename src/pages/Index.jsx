import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useGetDashboardStatsQuery } from "@/store/api";

const STATUS_COLORS = {
  delivered: "hsl(142, 60%, 40%)",
  shipped: "hsl(200, 70%, 50%)",
  processing: "hsl(38, 92%, 50%)",
  pending: "hsl(262, 60%, 55%)",
  cancelled: "hsl(0, 72%, 50%)",
};

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const Dashboard = () => {
  const { data, isLoading, isError } = useGetDashboardStatsQuery();

  const statsData = data?.stats;
  const ordersByStatus = data?.ordersByStatus || [];
  const recentOrders = data?.recentOrders || [];
  const lowStockProducts = data?.lowStockProducts || [];
  const revenueByMonth = data?.revenueByMonth || [];

  const revenueData = revenueByMonth.map((entry) => {
    const monthIndex = (entry._id?.month || 1) - 1;
    return {
      month: monthNames[monthIndex] || "",
      revenue: entry.revenue || 0,
      profit: Math.round((entry.revenue || 0) * 0.3),
    };
  });

  const orderStatusData = ordersByStatus.map((entry) => ({
    name: entry._id,
    value: entry.count,
    fill: STATUS_COLORS[entry._id] || "hsl(215, 20%, 70%)",
  }));

  const statCards = statsData
    ? [
        {
          label: "Total Revenue",
          value: `₹${statsData.totalRevenue?.toLocaleString("en-IN") || 0}`,
          change: "",
          up: true,
          icon: DollarSign,
        },
        {
          label: "Total Orders",
          value: statsData.totalOrders?.toString() || "0",
          change: "",
          up: true,
          icon: ShoppingCart,
        },
        {
          label: "Users",
          value: statsData.totalUsers?.toString() || "0",
          change: "",
          up: true,
          icon: Users,
        },
        {
          label: "Products",
          value: statsData.totalProducts?.toString() || "0",
          change: "",
          up: true,
          icon: Package,
        },
      ]
    : [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-40 bg-muted rounded-md" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card h-24 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-destructive">
          Failed to load dashboard data. Please try again.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Overview of your store performance
        </p>
      </motion.div>

      <motion.div
        variants={item}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {statCards.map((s) => (
          <div key={s.label} className="glass-card stat-glow p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-2 text-2xl font-bold">{s.value}</p>
            {s.change && (
              <div className="mt-1 flex items-center gap-1 text-xs">
                {s.up ? (
                  <TrendingUp className="h-3 w-3 text-success" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
                <span className={s.up ? "text-success" : "text-destructive"}>
                  {s.change}
                </span>
                <span className="text-muted-foreground">vs last month</span>
              </div>
            )}
          </div>
        ))}
      </motion.div>

      <motion.div variants={item} className="grid gap-4 lg:grid-cols-3">
        <div className="glass-card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold mb-4">Revenue & Profit</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(24,90%,50%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(24,90%,50%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(262,60%,55%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(262,60%,55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,90%)" />
              <XAxis dataKey="month" stroke="hsl(215,12%,50%)" fontSize={12} />
              <YAxis stroke="hsl(215,12%,50%)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0,0%,100%)",
                  border: "1px solid hsl(220,14%,90%)",
                  borderRadius: "8px",
                  color: "hsl(220,20%,14%)",
                }}
              />
              <Area type="monotone" dataKey="revenue" stroke="hsl(24,90%,50%)" fill="url(#revGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="profit" stroke="hsl(262,60%,55%)" fill="url(#profGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold mb-4">Order Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                paddingAngle={3}
              >
                {orderStatusData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0,0%,100%)",
                  border: "1px solid hsl(220,14%,90%)",
                  borderRadius: "8px",
                  color: "hsl(220,20%,14%)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1.5">
            {orderStatusData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.fill }} />
                  <span className="text-muted-foreground">{d.name}</span>
                </div>
                <span className="font-medium">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid gap-4 lg:grid-cols-2">
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {recentOrders.map((o) => (
              <div key={o._id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">
                    {o.orderNumber || o._id?.slice(-8)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {o.user?.fullName} ({o.user?.email})
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{o.totalAmount}</p>
                  <OrderBadge status={o.orderStatus} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold mb-4">Low Stock Alert</h3>
          <div className="space-y-3">
            {lowStockProducts.map((p) => (
              <div key={p._id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">Product</p>
                  </div>
                </div>
                <span
                  className={`text-xs font-semibold ${
                    p.stock === 0 ? "text-destructive" : "text-warning"
                  }`}
                >
                  {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

function OrderBadge({ status }) {
  const colors = {
    pending: "bg-chart-2/20 text-chart-2",
    processing: "bg-warning/20 text-warning",
    shipped: "bg-chart-5/20 text-chart-5",
    delivered: "bg-success/20 text-success",
    cancelled: "bg-destructive/20 text-destructive",
  };
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${
        colors[status] || ""
      }`}
    >
      {status}
    </span>
  );
}

export default Dashboard;

