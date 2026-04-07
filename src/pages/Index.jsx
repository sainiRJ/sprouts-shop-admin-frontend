import { useEffect, useMemo, useState } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { format, parseISO } from "date-fns";
import { Link } from "react-router-dom";
import {
    DollarSign,
    ShoppingCart,
    Users,
    Package,
    TrendingUp,
    TrendingDown,
    FolderTree,
    Star,
    Clock,
    AlertTriangle,
    PackageX,
    ArrowRight,
    BarChart3,
    Sun,
    Megaphone,
    Sparkles,
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
    Bar,
    ComposedChart,
    Legend,
} from "recharts";
import { useGetDashboardStatsQuery } from "@/store/api";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

/** Theme-aligned fills for SVG (match :root in index.css) */
const STATUS_FILLS = {
    delivered: "hsl(var(--success))",
    shipped: "hsl(var(--chart-5))",
    processing: "hsl(var(--chart-3))",
    pending: "hsl(var(--chart-2))",
    cancelled: "hsl(var(--destructive))",
};

const FULFILLMENT_FILLS = {
    Open: "hsl(var(--chart-3))",
    Shipped: "hsl(var(--chart-5))",
    Delivered: "hsl(var(--success))",
    Cancelled: "hsl(var(--destructive))",
};

const KPI_STYLES = [
    { wrap: "bg-primary/10 border-primary/25", icon: "text-primary" },
    { wrap: "bg-chart-2/10 border-chart-2/25", icon: "text-chart-2" },
    { wrap: "bg-chart-3/10 border-chart-3/25", icon: "text-chart-3" },
    { wrap: "bg-chart-4/10 border-chart-4/25", icon: "text-chart-4" },
    { wrap: "bg-chart-5/10 border-chart-5/25", icon: "text-chart-5" },
    { wrap: "bg-sidebar-accent/90 border-sidebar-border", icon: "text-sidebar-primary" },
    { wrap: "bg-primary/[0.07] border-primary/20", icon: "text-primary" },
    { wrap: "bg-chart-2/[0.08] border-chart-2/20", icon: "text-chart-2" },
    { wrap: "bg-warning/12 border-warning/30", icon: "text-warning" },
    { wrap: "bg-destructive/10 border-destructive/25", icon: "text-destructive" },
    { wrap: "bg-muted/90 border-border", icon: "text-muted-foreground" },
];

const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

const TABS = [
    { id: "overview", label: "Overview" },
    { id: "today", label: "Today" },
    { id: "week", label: "This week" },
    { id: "month", label: "This month" },
    { id: "custom", label: "Custom" },
];

const spring = { type: "spring", stiffness: 380, damping: 32 };
const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.06, delayChildren: 0.04 },
    },
};
const item = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: spring },
};

const kpiContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.045, delayChildren: 0.02 } },
};
const kpiItem = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: spring },
};

function formatChange(pct) {
    if (pct == null || Number.isNaN(pct)) return null;
    const sign = pct > 0 ? "+" : "";
    return `${sign}${pct}%`;
}

function useLiveClock() {
    const [now, setNow] = useState(() => new Date());
    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);
    return now;
}

function greetingKey(hour) {
    if (hour < 12) return "GOOD MORNING";
    if (hour < 17) return "GOOD AFTERNOON";
    return "GOOD EVENING";
}

const tooltipBox = {
    borderRadius: "12px",
    border: "1px solid hsl(var(--border))",
    backgroundColor: "hsl(var(--card))",
    color: "hsl(var(--card-foreground))",
    boxShadow: "0 12px 40px -12px hsl(var(--foreground) / 0.12)",
};

function DonutPanel({ title, subtitle, totalLabel, total, data, legendClassByName }) {
    const hasData = data.some((d) => d.value > 0);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={spring}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="dash-card rounded-3xl p-6"
        >
            <h3 className="text-base font-bold text-foreground">{title}</h3>
            {subtitle ? <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p> : null}
            <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-center">
                <div className="relative mx-auto h-[220px] w-full max-w-[240px] shrink-0">
                    {hasData ? (
                        <>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius="68%"
                                        outerRadius="92%"
                                        dataKey="value"
                                        paddingAngle={2}
                                        strokeWidth={0}
                                    >
                                        {data.map((entry, i) => (
                                            <Cell key={i} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={tooltipBox} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pt-1">
                                <motion.span
                                    key={total}
                                    initial={{ scale: 0.85, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={spring}
                                    className="text-3xl font-bold tabular-nums text-foreground"
                                >
                                    {total}
                                </motion.span>
                                <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                    {totalLabel}
                                </span>
                            </div>
                        </>
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                            No data yet
                        </div>
                    )}
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                    {data.map((d, i) => (
                        <motion.div
                            key={d.name}
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ ...spring, delay: i * 0.05 }}
                            className={cn(
                                "flex items-center justify-between rounded-xl border border-border px-3 py-2.5 text-sm",
                                legendClassByName?.[d.name] || "bg-muted/50",
                            )}
                        >
                            <div className="flex min-w-0 items-center gap-2">
                                <span
                                    className="h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-background"
                                    style={{ backgroundColor: d.fill }}
                                />
                                <span className="truncate font-medium capitalize text-foreground">{d.name}</span>
                            </div>
                            <span className="shrink-0 font-bold tabular-nums text-foreground">{d.value}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

const Dashboard = () => {
    const { user } = useAuth();
    const clock = useLiveClock();
    const [periodTab, setPeriodTab] = useState("overview");
    const { data, isLoading, isError } = useGetDashboardStatsQuery();

    const statsData = data?.stats;
    const ordersByStatus = data?.ordersByStatus || [];
    const recentOrders = data?.recentOrders || [];
    const lowStockProducts = data?.lowStockProducts || [];
    const revenueByMonth = data?.revenueByMonth || [];
    const ordersDaily = (data?.ordersDaily || []).map((row) => ({
        ...row,
        label: row.date ? format(parseISO(row.date), "EEE") : "",
    }));
    const topProductsByRevenue = data?.topProductsByRevenue || [];
    const recentReviews = data?.recentReviews || [];
    const reviewSummary = data?.reviewSummary || { avgRating: 0, totalReviews: 0 };

    const welcomeName = user?.fullName || user?.email?.split("@")[0] || "there";

    const revenueData = revenueByMonth.map((entry) => {
        const monthIndex = (entry._id?.month || 1) - 1;
        return {
            month: monthNames[monthIndex] || "",
            revenue: entry.revenue || 0,
        };
    });

    const orderStatusData = ordersByStatus.map((entry) => ({
        name: entry._id,
        value: entry.count,
        fill: STATUS_FILLS[entry._id] || "hsl(var(--muted-foreground) / 0.35)",
    }));

    const statusCount = useMemo(() => {
        const m = {};
        ordersByStatus.forEach((entry) => {
            m[entry._id] = entry.count;
        });
        return m;
    }, [ordersByStatus]);

    const fulfillmentData = useMemo(
        () => [
            {
                name: "Open",
                value: (statusCount.pending || 0) + (statusCount.processing || 0),
                fill: FULFILLMENT_FILLS.Open,
            },
            {
                name: "Shipped",
                value: statusCount.shipped || 0,
                fill: FULFILLMENT_FILLS.Shipped,
            },
            {
                name: "Delivered",
                value: statusCount.delivered || 0,
                fill: FULFILLMENT_FILLS.Delivered,
            },
            {
                name: "Cancelled",
                value: statusCount.cancelled || 0,
                fill: FULFILLMENT_FILLS.Cancelled,
            },
        ],
        [statusCount],
    );

    const fulfillmentLegend = {
        Open: "border-l-4 border-l-[hsl(var(--chart-3))] bg-chart-3/10",
        Shipped: "border-l-4 border-l-[hsl(var(--chart-5))] bg-chart-5/10",
        Delivered: "border-l-4 border-l-[hsl(var(--success))] bg-success/10",
        Cancelled: "border-l-4 border-l-[hsl(var(--destructive))] bg-destructive/10",
    };

    const orderStatusLegend = {
        pending: "border-l-4 border-l-[hsl(var(--chart-2))] bg-chart-2/10",
        processing: "border-l-4 border-l-[hsl(var(--chart-3))] bg-chart-3/10",
        shipped: "border-l-4 border-l-[hsl(var(--chart-5))] bg-chart-5/10",
        delivered: "border-l-4 border-l-[hsl(var(--success))] bg-success/10",
        cancelled: "border-l-4 border-l-[hsl(var(--destructive))] bg-destructive/10",
    };

    const statCards = statsData
        ? [
            {
                label: "Total revenue",
                value: `₹${statsData.totalRevenue?.toLocaleString("en-IN") || 0}`,
                sub: statsData.revenueThisMonth != null
                    ? `₹${(statsData.revenueThisMonth || 0).toLocaleString("en-IN")} this month`
                    : null,
                change: formatChange(statsData.revenueChangePct),
                up: (statsData.revenueChangePct ?? 0) >= 0,
                icon: DollarSign,
            },
            {
                label: "Orders",
                value: statsData.totalOrders?.toString() || "0",
                sub:
                    statsData.ordersThisMonth != null
                        ? `${statsData.ordersThisMonth} this month`
                        : null,
                change: formatChange(statsData.ordersChangePct),
                up: (statsData.ordersChangePct ?? 0) >= 0,
                icon: ShoppingCart,
            },
            {
                label: "Avg. order value",
                value:
                    statsData.averageOrderValue != null
                        ? `₹${Number(statsData.averageOrderValue).toLocaleString("en-IN")}`
                        : "—",
                sub: "All-time from paid revenue",
                change: null,
                up: true,
                icon: BarChart3,
            },
            {
                label: "Customers",
                value: statsData.totalUsers?.toString() || "0",
                sub:
                    statsData.newUsersLast30Days != null
                        ? `${statsData.newUsersLast30Days} new (30d)`
                        : null,
                change: null,
                up: true,
                icon: Users,
            },
            {
                label: "Products",
                value: statsData.totalProducts?.toString() || "0",
                sub:
                    statsData.inactiveProductCount > 0
                        ? `${statsData.inactiveProductCount} inactive`
                        : "Active catalog",
                change: null,
                up: true,
                icon: Package,
            },
            {
                label: "Categories",
                value: statsData.totalCategories?.toString() || "0",
                sub: "Active categories",
                change: null,
                up: true,
                icon: FolderTree,
            },
            {
                label: "Pending orders",
                value: statsData.pendingOrders?.toString() || "0",
                sub: "Awaiting action",
                change: null,
                up: true,
                icon: Clock,
            },
            {
                label: "Processing",
                value: statsData.processingOrders?.toString() || "0",
                sub: "Being fulfilled",
                change: null,
                up: true,
                icon: ShoppingCart,
            },
            {
                label: "Low stock (1–10)",
                value: statsData.lowStockCount?.toString() || "0",
                sub: "SKUs need restock",
                change: null,
                up: true,
                icon: AlertTriangle,
            },
            {
                label: "Out of stock",
                value: statsData.outOfStockCount?.toString() || "0",
                sub: "Active products at 0",
                change: null,
                up: (statsData.outOfStockCount ?? 0) === 0,
                icon: PackageX,
            },
            {
                label: "Reviews",
                value: reviewSummary.totalReviews?.toString() || "0",
                sub:
                    reviewSummary.avgRating > 0
                        ? `Avg. ${reviewSummary.avgRating} / 5`
                        : "No ratings yet",
                change: null,
                up: true,
                icon: Star,
            },
        ]
        : [];

    const totalOrders = statsData?.totalOrders ?? 0;

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid gap-4 lg:grid-cols-5">
                    <div className="lg:col-span-3 h-44 animate-pulse rounded-3xl bg-muted" />
                    <div className="lg:col-span-2 h-44 animate-pulse rounded-3xl bg-muted/80" />
                </div>
                <div className="h-11 animate-pulse rounded-2xl bg-muted" />
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted/90" />
                    ))}
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="dash-card rounded-3xl p-8">
                <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
                <p className="mt-2 text-sm text-destructive">
                    Failed to load dashboard data. Please try again.
                </p>
            </div>
        );
    }

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
            {/* Hero */}
            <motion.div variants={item} className="grid gap-4 lg:grid-cols-5 lg:gap-5">
                <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary via-[hsl(28_90%_52%)] to-[hsl(16_76%_42%)] p-7 text-primary-foreground shadow-lg lg:col-span-3 lg:min-h-[200px]">
                    <div className="pointer-events-none absolute inset-0 dash-hero-glow animate-dash-glow opacity-90" />
                    <div className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-primary-foreground/15 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-chart-4/30 blur-3xl" />

                    <div className="relative z-10 max-w-lg">
                        <p className="text-sm font-medium text-primary-foreground/85">ShopAdmin</p>
                        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                            Welcome, {welcomeName}
                        </h1>
                        <p className="mt-2 text-sm leading-relaxed text-primary-foreground/90">
                            Monitor revenue, orders, inventory, and customer feedback in one place.
                        </p>
                        <div className="mt-5 flex flex-wrap items-center gap-3">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-primary-foreground/75">
                                Role : Admin
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm ring-1 ring-primary-foreground/20">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[hsl(var(--success))]" />
                                Operational
                            </span>
                        </div>
                    </div>
                    <motion.div
                        className="pointer-events-none absolute -right-4 bottom-0 opacity-30 sm:right-4 sm:opacity-40"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Megaphone className="h-36 w-36 text-primary-foreground sm:h-44 sm:w-44" strokeWidth={1.15} />
                        <Sparkles className="absolute -left-8 top-4 h-10 w-10 text-primary-foreground/80" />
                    </motion.div>
                </div>

                <div className="dash-card relative overflow-hidden rounded-3xl border-sidebar-border/60 bg-gradient-to-br from-sidebar-accent/70 via-card to-muted/40 p-6 lg:col-span-2">
                    <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                                {greetingKey(clock.getHours())}
                            </p>
                            <motion.p
                                key={format(clock, "ss")}
                                initial={{ opacity: 0.5, y: 2 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25 }}
                                className="mt-2 font-mono text-2xl font-bold tabular-nums text-foreground sm:text-3xl"
                            >
                                {format(clock, "hh:mm:ss a")}
                            </motion.p>
                            <p className="mt-1 text-sm font-semibold capitalize text-muted-foreground">
                                {format(clock, "EEEE")}
                            </p>
                            <p className="text-xs text-muted-foreground">{format(clock, "MMMM d, yyyy")}</p>
                        </div>
                        <motion.div
                            animate={{ rotate: [0, 8, -8, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-card shadow-sm"
                        >
                            <Sun className="h-6 w-6 text-primary" />
                        </motion.div>
                    </div>
                    <div className="mt-6 flex items-center gap-2 rounded-2xl border border-border/80 bg-card/80 px-3 py-2 text-xs font-medium text-muted-foreground backdrop-blur-sm">
                        <ShoppingCart className="h-4 w-4 text-primary" />
                        {(statsData?.pendingOrders || 0) + (statsData?.processingOrders || 0)} orders need
                        attention
                    </div>
                </div>
            </motion.div>

            {/* Period tabs + quick links */}
            <motion.div
                variants={item}
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
                <LayoutGroup id="dash-period">
                    <div className="flex flex-wrap gap-1 rounded-2xl border border-border bg-muted/50 p-1 shadow-sm">
                        {TABS.map((t) => (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => setPeriodTab(t.id)}
                                className="relative rounded-xl px-4 py-2 text-xs font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                {periodTab === t.id && (
                                    <motion.span
                                        layoutId="dash-period-pill"
                                        className="absolute inset-0 rounded-xl bg-primary shadow-md shadow-primary/25"
                                        transition={spring}
                                    />
                                )}
                                <span
                                    className={cn(
                                        "relative z-10",
                                        periodTab === t.id ? "text-primary-foreground" : "text-muted-foreground",
                                    )}
                                >
                                    {t.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </LayoutGroup>
                <div className="flex flex-wrap gap-2">
                    {[
                        { to: "/orders", label: "Orders" },
                        { to: "/products", label: "Products" },
                        { to: "/categories", label: "Categories" },
                        { to: "/reviews", label: "Reviews" },
                        { to: "/users", label: "Users" },
                    ].map((q, i) => (
                        <motion.div key={q.to} initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                            <Link
                                to={q.to}
                                className="inline-flex items-center gap-1 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm transition hover:border-primary/35 hover:bg-primary/5 hover:text-primary"
                            >
                                {q.label}
                                <ArrowRight className="h-3 w-3 opacity-50" />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* KPI grid */}
            <motion.div
                variants={kpiContainer}
                className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
            >
                {statCards.map((s, idx) => {
                    const kpi = KPI_STYLES[idx % KPI_STYLES.length];
                    return (
                        <motion.div
                            key={s.label}
                            variants={kpiItem}
                            whileHover={{
                                y: -4,
                                transition: { type: "spring", stiffness: 400, damping: 22 },
                            }}
                            className={cn(
                                "rounded-2xl border p-4 shadow-sm transition-shadow hover:shadow-md hover:shadow-primary/10",
                                kpi.wrap,
                            )}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <span className="text-[11px] font-bold uppercase tracking-wide text-foreground/90">
                                    {s.label}
                                </span>
                                <s.icon className={cn("h-4 w-4 shrink-0", kpi.icon)} />
                            </div>
                            <p className="mt-2 text-xl font-bold tabular-nums text-foreground">{s.value}</p>
                            {s.sub ? (
                                <p className="mt-0.5 line-clamp-2 text-[10px] font-medium text-muted-foreground">
                                    {s.sub}
                                </p>
                            ) : null}
                            {s.change != null ? (
                                <div className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold">
                                    {s.up ? (
                                        <TrendingUp className="h-3 w-3 text-success" />
                                    ) : (
                                        <TrendingDown className="h-3 w-3 text-destructive" />
                                    )}
                                    <span className={s.up ? "text-success" : "text-destructive"}>{s.change}</span>
                                    <span className="font-normal text-muted-foreground">vs last month</span>
                                </div>
                            ) : null}
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Donuts */}
            <motion.div variants={item} className="grid gap-5 lg:grid-cols-2">
                <DonutPanel
                    title="Order status"
                    subtitle="All-time breakdown by state"
                    totalLabel="Orders"
                    total={totalOrders}
                    data={orderStatusData}
                    legendClassByName={orderStatusLegend}
                />
                <DonutPanel
                    title="Fulfillment overview"
                    subtitle="Same orders, grouped for pipeline view"
                    totalLabel="Orders"
                    total={totalOrders}
                    data={fulfillmentData}
                    legendClassByName={fulfillmentLegend}
                />
            </motion.div>

            {/* Charts */}
            <motion.div variants={item} className="grid gap-5 xl:grid-cols-3">
                <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                    className="dash-card rounded-3xl p-6 xl:col-span-2"
                >
                    <h3 className="text-base font-bold text-foreground">Revenue trend</h3>
                    <p className="text-xs text-muted-foreground">Last 6 months (successful payments)</p>
                    <div className="mt-4 h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="revGradThemed" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    stroke="hsl(var(--muted-foreground))"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="hsl(var(--muted-foreground))"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={tooltipBox}
                                    formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Revenue"]}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="hsl(var(--primary))"
                                    fill="url(#revGradThemed)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                    className="dash-card rounded-3xl p-6"
                >
                    <h3 className="text-base font-bold text-foreground">Last 7 days</h3>
                    <p className="text-xs text-muted-foreground">Orders & revenue per day</p>
                    <div className="mt-4 h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={ordersDaily}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                <XAxis
                                    dataKey="label"
                                    stroke="hsl(var(--muted-foreground))"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    yAxisId="left"
                                    stroke="hsl(var(--muted-foreground))"
                                    fontSize={11}
                                    allowDecimals={false}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    stroke="hsl(var(--muted-foreground))"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={tooltipBox}
                                    formatter={(value, name) => {
                                        if (name === "revenue") return [`₹${Number(value).toLocaleString("en-IN")}`, "Revenue"];
                                        return [value, "Orders"];
                                    }}
                                />
                                <Legend />
                                <Bar
                                    yAxisId="left"
                                    dataKey="orders"
                                    name="Orders"
                                    fill="hsl(var(--chart-2))"
                                    radius={[6, 6, 0, 0]}
                                />
                                <Area
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="revenue"
                                    name="Revenue"
                                    stroke="hsl(var(--primary))"
                                    fill="hsl(var(--primary))"
                                    fillOpacity={0.12}
                                    strokeWidth={2}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </motion.div>

            {/* Top products */}
            <motion.div variants={item}>
                <motion.div
                    whileHover={{ y: -2 }}
                    className="dash-card rounded-3xl p-6"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-bold text-foreground">Top products</h3>
                            <p className="text-xs text-muted-foreground">By line revenue (all orders)</p>
                        </div>
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                        >
                            Manage
                            <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {topProductsByRevenue.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No order line data yet.</p>
                        ) : (
                            topProductsByRevenue.map((p, idx) => (
                                <motion.div
                                    key={p._id?.toString?.() ?? idx}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ ...spring, delay: idx * 0.04 }}
                                    whileHover={{ scale: 1.01 }}
                                    className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-muted/30 px-4 py-3 transition-colors hover:border-primary/20 hover:bg-primary/[0.04]"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-semibold text-foreground">{p.name || "Removed product"}</p>
                                        <p className="text-xs text-muted-foreground">{p.unitsSold ?? 0} units sold</p>
                                    </div>
                                    <span className="shrink-0 text-sm font-bold tabular-nums text-foreground">
                                        ₹{Number(p.revenue || 0).toLocaleString("en-IN")}
                                    </span>
                                </motion.div>
                            ))
                        )}
                    </div>
                </motion.div>
            </motion.div>

            {/* Lists */}
            <motion.div variants={item} className="grid gap-5 lg:grid-cols-3">
                {[
                    {
                        title: "Recent orders",
                        link: "/orders",
                        linkLabel: "View all",
                        body:
                            recentOrders.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No orders yet.</p>
                            ) : (
                                recentOrders.map((o) => (
                                    <div
                                        key={o._id}
                                        className="flex items-start justify-between gap-2 border-b border-border py-3 text-sm last:border-0"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate font-semibold text-foreground">
                                                {o.orderNumber || o._id?.slice?.(-8) || "—"}
                                            </p>
                                            <p className="truncate text-xs text-muted-foreground">
                                                {o.user?.fullName || "—"} · {o.user?.email || ""}
                                            </p>
                                        </div>
                                        <div className="shrink-0 text-right">
                                            <p className="font-bold text-foreground">₹{o.totalAmount}</p>
                                            <OrderBadge status={o.orderStatus} />
                                        </div>
                                    </div>
                                ))
                            ),
                    },
                    {
                        title: "Low stock",
                        link: "/products",
                        linkLabel: "Inventory",
                        body:
                            lowStockProducts.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No low-stock SKUs.</p>
                            ) : (
                                lowStockProducts.map((p) => (
                                    <div
                                        key={p._id}
                                        className="flex items-center justify-between gap-2 border-b border-border py-3 text-sm last:border-0"
                                    >
                                        <p className="min-w-0 truncate font-medium text-foreground">{p.name}</p>
                                        <span
                                            className={cn(
                                                "shrink-0 text-xs font-bold",
                                                p.stock === 0 ? "text-destructive" : "text-warning",
                                            )}
                                        >
                                            {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                                        </span>
                                    </div>
                                ))
                            ),
                    },
                    {
                        title: "Recent reviews",
                        link: "/reviews",
                        linkLabel: "Moderate",
                        body:
                            recentReviews.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No reviews yet.</p>
                            ) : (
                                recentReviews.map((r) => (
                                    <div key={r._id} className="border-b border-border py-3 text-sm last:border-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="truncate text-xs text-muted-foreground">
                                                {r.user?.fullName || "User"} · {r.product?.name || "Product"}
                                            </span>
                                            <span className="shrink-0 text-xs font-bold text-primary">{r.rating}★</span>
                                        </div>
                                        {r.comment ? (
                                            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{r.comment}</p>
                                        ) : null}
                                    </div>
                                ))
                            ),
                    },
                ].map((section) => (
                    <motion.div
                        key={section.title}
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                        className="dash-card rounded-3xl p-6"
                    >
                        <div className="mb-2 flex items-center justify-between">
                            <h3 className="text-base font-bold text-foreground">{section.title}</h3>
                            <Link to={section.link} className="text-xs font-bold text-primary hover:underline">
                                {section.linkLabel}
                            </Link>
                        </div>
                        <div className="max-h-[300px] space-y-0 overflow-y-auto pr-1">{section.body}</div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
};

function OrderBadge({ status }) {
    const colors = {
        pending: "bg-chart-2/15 text-chart-2",
        processing: "bg-chart-3/15 text-chart-3",
        shipped: "bg-chart-5/15 text-chart-5",
        delivered: "bg-success/15 text-success",
        cancelled: "bg-destructive/15 text-destructive",
    };
    return (
        <span
            className={cn(
                "mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold capitalize",
                colors[status] || "bg-muted text-muted-foreground",
            )}
        >
            {status}
        </span>
    );
}

export default Dashboard;
