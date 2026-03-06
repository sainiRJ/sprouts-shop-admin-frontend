export interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice: number;
  weight: string;
  rating: number;
  reviews: number;
  image: string;
  images: string[];
  features: string[];
  inStock: boolean;
  stock: number;
  status: "active" | "draft" | "out_of_stock";
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  totalOrders: number;
  totalSpent: number;
  joinedAt: string;
  status: "active" | "inactive";
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export interface Review {
  id: string;
  customerName: string;
  productName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const mockCategories: Category[] = [
  { id: "1", name: "Classic", description: "Traditional roasted chickpeas", productCount: 5, createdAt: "2025-12-01" },
  { id: "2", name: "Masala", description: "Spiced flavored variants", productCount: 8, createdAt: "2025-12-05" },
  { id: "3", name: "Pudina", description: "Mint-flavored snacks", productCount: 4, createdAt: "2025-12-10" },
  { id: "4", name: "Chatpata", description: "Tangy and zesty mixes", productCount: 6, createdAt: "2025-12-15" },
  { id: "5", name: "Hing Jeera", description: "Asafoetida & cumin blend", productCount: 3, createdAt: "2025-12-20" },
  { id: "6", name: "Premium", description: "Gourmet selections", productCount: 7, createdAt: "2026-01-01" },
];

export const mockProducts: Product[] = [
  {
    id: "1", name: "Classic Roasted Chana", category: "Classic",
    description: "Traditional slow-roasted chickpeas with a perfect golden crunch. Pure & natural.",
    longDescription: "Our Classic Roasted Chana is crafted using time-tested traditional methods. Each chickpea is slow-roasted in small batches to achieve that perfect golden crunch. No artificial flavors, no preservatives — just pure, authentic taste.",
    price: 99, originalPrice: 149, weight: "250g", rating: 4.8, reviews: 2847,
    image: "🫘", images: ["🫘", "🌾", "🥜", "📦", "✨"],
    features: ["100% Natural", "High Protein", "No Preservatives", "Gluten Free"],
    inStock: true, stock: 120, status: "active", createdAt: "2026-01-10"
  },
  {
    id: "2", name: "Masala Roasted Chana", category: "Masala",
    description: "Bold Indian spices meet crunchy roasted chickpeas.",
    longDescription: "A perfect blend of aromatic Indian spices roasted into every chickpea. Experience the bold flavors of cumin, coriander, and red chili in every bite.",
    price: 119, originalPrice: 169, weight: "250g", rating: 4.6, reviews: 1923,
    image: "🌶️", images: ["🌶️", "🫘", "🧂", "📦", "✨"],
    features: ["Spicy Flavor", "High Protein", "No MSG", "Vegan"],
    inStock: true, stock: 85, status: "active", createdAt: "2026-01-12"
  },
  {
    id: "3", name: "Pudina Chana", category: "Pudina",
    description: "Cool mint-flavored roasted chickpeas for a refreshing snack.",
    longDescription: "Fresh mint leaves infused into perfectly roasted chickpeas. A unique and refreshing twist on the classic snack that keeps you coming back.",
    price: 109, originalPrice: 159, weight: "200g", rating: 4.5, reviews: 1456,
    image: "🍃", images: ["🍃", "🫘", "🌿", "📦", "✨"],
    features: ["Mint Infused", "Cooling Effect", "No Preservatives", "Light Snack"],
    inStock: true, stock: 60, status: "active", createdAt: "2026-01-15"
  },
  {
    id: "4", name: "Chatpata Mix", category: "Chatpata",
    description: "Tangy and spicy mix with a perfect balance of flavors.",
    longDescription: "An explosion of tangy, spicy, and sweet flavors. Our Chatpata Mix combines roasted chickpeas with select spices for an unforgettable taste experience.",
    price: 129, originalPrice: 179, weight: "300g", rating: 4.7, reviews: 2100,
    image: "🧂", images: ["🧂", "🫘", "🌶️", "📦", "✨"],
    features: ["Tangy Flavor", "Mixed Spices", "No Artificial Colors", "Party Snack"],
    inStock: true, stock: 45, status: "active", createdAt: "2026-01-18"
  },
  {
    id: "5", name: "Hing Jeera Chana", category: "Hing Jeera",
    description: "Aromatic asafoetida and cumin roasted chickpeas.",
    longDescription: "The classic Indian combination of hing (asafoetida) and jeera (cumin) brings an earthy, aromatic depth to our premium roasted chickpeas.",
    price: 109, originalPrice: 149, weight: "250g", rating: 4.4, reviews: 987,
    image: "🫚", images: ["🫚", "🫘", "🧂", "📦", "✨"],
    features: ["Aromatic Spices", "Digestive Friendly", "Traditional Recipe", "No Preservatives"],
    inStock: false, stock: 0, status: "out_of_stock", createdAt: "2026-01-20"
  },
  {
    id: "6", name: "Premium Gold Chana", category: "Premium",
    description: "Hand-selected premium chickpeas with gold-standard roasting.",
    longDescription: "Our finest offering — hand-selected chickpeas roasted to perfection using our gold-standard process. Each batch is quality-tested for consistency.",
    price: 199, originalPrice: 249, weight: "500g", rating: 4.9, reviews: 3200,
    image: "✨", images: ["✨", "🫘", "🏆", "📦", "🎁"],
    features: ["Premium Quality", "Extra Crunchy", "Gift Pack", "ISO Certified"],
    inStock: true, stock: 30, status: "active", createdAt: "2026-01-22"
  },
  {
    id: "7", name: "Spicy Masala Crunch", category: "Masala",
    description: "Extra spicy variant for heat lovers.",
    longDescription: "For those who love the heat! Our Spicy Masala Crunch takes the traditional masala chana to the next level with fiery spices.",
    price: 129, originalPrice: 179, weight: "250g", rating: 4.3, reviews: 756,
    image: "🔥", images: ["🔥", "🌶️", "🫘", "📦", "✨"],
    features: ["Extra Spicy", "High Protein", "Bold Flavor", "No Trans Fat"],
    inStock: true, stock: 15, status: "active", createdAt: "2026-02-01"
  },
  {
    id: "8", name: "Classic Mini Pack", category: "Classic",
    description: "Convenient travel-size pack of classic roasted chana.",
    longDescription: "The same beloved classic taste in a convenient mini pack. Perfect for on-the-go snacking, office breaks, or kids' lunchboxes.",
    price: 29, originalPrice: 39, weight: "50g", rating: 4.6, reviews: 4500,
    image: "📦", images: ["📦", "🫘", "✈️", "🎒", "✨"],
    features: ["Travel Size", "Single Serve", "Pocket Friendly", "Fresh Sealed"],
    inStock: true, stock: 500, status: "active", createdAt: "2026-02-05"
  },
  {
    id: "9", name: "Diet Roasted Chana", category: "Classic",
    description: "Low-salt, low-oil variant for health-conscious snackers.",
    longDescription: "Specially crafted for the health-conscious. Less salt, less oil but no compromise on the crunch and flavor you love.",
    price: 119, originalPrice: 169, weight: "250g", rating: 4.2, reviews: 620,
    image: "💪", images: ["💪", "🫘", "🥗", "📦", "✨"],
    features: ["Low Salt", "Low Oil", "Diet Friendly", "High Fiber"],
    inStock: true, stock: 8, status: "draft", createdAt: "2026-02-10"
  },
  {
    id: "10", name: "Festive Gift Box", category: "Premium",
    description: "Assorted flavors gift box for celebrations.",
    longDescription: "A beautifully packaged gift box containing an assortment of our best-selling flavors. Perfect for festivals, weddings, and special occasions.",
    price: 499, originalPrice: 699, weight: "1kg", rating: 4.9, reviews: 1850,
    image: "🎁", images: ["🎁", "✨", "🫘", "🌶️", "🍃"],
    features: ["Gift Packaging", "5 Flavors", "Premium Box", "Festival Special"],
    inStock: true, stock: 25, status: "active", createdAt: "2026-02-15"
  },
];

export const mockUsers: User[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", avatar: "AJ", totalOrders: 12, totalSpent: 2340, joinedAt: "2025-06-15", status: "active" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", avatar: "BS", totalOrders: 8, totalSpent: 1560, joinedAt: "2025-07-20", status: "active" },
  { id: "3", name: "Carol Davis", email: "carol@example.com", avatar: "CD", totalOrders: 3, totalSpent: 450, joinedAt: "2025-09-10", status: "inactive" },
  { id: "4", name: "David Wilson", email: "david@example.com", avatar: "DW", totalOrders: 25, totalSpent: 5680, joinedAt: "2025-04-01", status: "active" },
  { id: "5", name: "Eva Martinez", email: "eva@example.com", avatar: "EM", totalOrders: 15, totalSpent: 3200, joinedAt: "2025-08-22", status: "active" },
  { id: "6", name: "Frank Lee", email: "frank@example.com", avatar: "FL", totalOrders: 1, totalSpent: 89, joinedAt: "2026-01-05", status: "active" },
  { id: "7", name: "Grace Kim", email: "grace@example.com", avatar: "GK", totalOrders: 9, totalSpent: 1780, joinedAt: "2025-05-12", status: "active" },
  { id: "8", name: "Henry Patel", email: "henry@example.com", avatar: "HP", totalOrders: 18, totalSpent: 4200, joinedAt: "2025-03-08", status: "active" },
  { id: "9", name: "Irene Costa", email: "irene@example.com", avatar: "IC", totalOrders: 2, totalSpent: 238, joinedAt: "2026-01-20", status: "inactive" },
  { id: "10", name: "Jack Chen", email: "jack@example.com", avatar: "JC", totalOrders: 7, totalSpent: 1120, joinedAt: "2025-10-15", status: "active" },
  { id: "11", name: "Kavya Sharma", email: "kavya@example.com", avatar: "KS", totalOrders: 22, totalSpent: 4850, joinedAt: "2025-02-10", status: "active" },
  { id: "12", name: "Liam Brown", email: "liam@example.com", avatar: "LB", totalOrders: 4, totalSpent: 560, joinedAt: "2025-11-30", status: "active" },
];

export const mockOrders: Order[] = [
  { id: "ORD-001", customerName: "Alice Johnson", customerEmail: "alice@example.com", items: 3, total: 1547, status: "delivered", createdAt: "2026-02-20" },
  { id: "ORD-002", customerName: "Bob Smith", customerEmail: "bob@example.com", items: 1, total: 1199, status: "shipped", createdAt: "2026-02-21" },
  { id: "ORD-003", customerName: "David Wilson", customerEmail: "david@example.com", items: 5, total: 2340, status: "processing", createdAt: "2026-02-22" },
  { id: "ORD-004", customerName: "Eva Martinez", customerEmail: "eva@example.com", items: 2, total: 238, status: "pending", createdAt: "2026-02-23" },
  { id: "ORD-005", customerName: "Frank Lee", customerEmail: "frank@example.com", items: 1, total: 89, status: "cancelled", createdAt: "2026-02-18" },
  { id: "ORD-006", customerName: "Alice Johnson", customerEmail: "alice@example.com", items: 2, total: 848, status: "pending", createdAt: "2026-02-23" },
  { id: "ORD-007", customerName: "Grace Kim", customerEmail: "grace@example.com", items: 4, total: 1890, status: "delivered", createdAt: "2026-02-19" },
  { id: "ORD-008", customerName: "Henry Patel", customerEmail: "henry@example.com", items: 3, total: 1450, status: "shipped", createdAt: "2026-02-22" },
  { id: "ORD-009", customerName: "Jack Chen", customerEmail: "jack@example.com", items: 1, total: 199, status: "processing", createdAt: "2026-02-24" },
  { id: "ORD-010", customerName: "Kavya Sharma", customerEmail: "kavya@example.com", items: 6, total: 3200, status: "delivered", createdAt: "2026-02-17" },
  { id: "ORD-011", customerName: "Liam Brown", customerEmail: "liam@example.com", items: 2, total: 560, status: "pending", createdAt: "2026-02-24" },
  { id: "ORD-012", customerName: "Carol Davis", customerEmail: "carol@example.com", items: 1, total: 129, status: "cancelled", createdAt: "2026-02-16" },
];

export const mockReviews: Review[] = [
  { id: "1", customerName: "Alice Johnson", productName: "Classic Roasted Chana", rating: 5, comment: "Absolutely delicious! The crunch is perfect and tastes just like homemade.", createdAt: "2026-02-15" },
  { id: "2", customerName: "Bob Smith", productName: "Masala Roasted Chana", rating: 4, comment: "Great spice level, but wish the pack was bigger.", createdAt: "2026-02-16" },
  { id: "3", customerName: "David Wilson", productName: "Premium Gold Chana", rating: 5, comment: "Best quality chana I've ever had. Worth every penny!", createdAt: "2026-02-17" },
  { id: "4", customerName: "Eva Martinez", productName: "Pudina Chana", rating: 3, comment: "Mint flavor is subtle. Expected stronger taste.", createdAt: "2026-02-19" },
  { id: "5", customerName: "Carol Davis", productName: "Chatpata Mix", rating: 4, comment: "Perfect for evening snacking with chai!", createdAt: "2026-02-20" },
  { id: "6", customerName: "Frank Lee", productName: "Classic Roasted Chana", rating: 5, comment: "Perfect fit! Love the quality and freshness.", createdAt: "2026-02-22" },
  { id: "7", customerName: "Grace Kim", productName: "Hing Jeera Chana", rating: 4, comment: "Unique flavor combination. Very addictive!", createdAt: "2026-02-21" },
  { id: "8", customerName: "Henry Patel", productName: "Spicy Masala Crunch", rating: 5, comment: "Finally a chana with real heat! Amazing.", createdAt: "2026-02-23" },
  { id: "9", customerName: "Jack Chen", productName: "Classic Mini Pack", rating: 4, comment: "Convenient size for carrying everywhere.", createdAt: "2026-02-22" },
  { id: "10", customerName: "Kavya Sharma", productName: "Festive Gift Box", rating: 5, comment: "Gifted to family during Diwali. Everyone loved it!", createdAt: "2026-02-20" },
  { id: "11", customerName: "Liam Brown", productName: "Diet Roasted Chana", rating: 3, comment: "Healthy option but could use more seasoning.", createdAt: "2026-02-24" },
  { id: "12", customerName: "Irene Costa", productName: "Masala Roasted Chana", rating: 4, comment: "Good flavor, nice packaging.", createdAt: "2026-02-23" },
];

export const revenueData = [
  { month: "Sep", revenue: 18500, profit: 5200 },
  { month: "Oct", revenue: 22300, profit: 6800 },
  { month: "Nov", revenue: 31200, profit: 9400 },
  { month: "Dec", revenue: 45600, profit: 14200 },
  { month: "Jan", revenue: 38900, profit: 11700 },
  { month: "Feb", revenue: 42100, profit: 13500 },
];

export const orderStatusData = [
  { name: "Delivered", value: 145, fill: "hsl(142, 60%, 40%)" },
  { name: "Shipped", value: 38, fill: "hsl(200, 70%, 50%)" },
  { name: "Processing", value: 22, fill: "hsl(38, 92%, 50%)" },
  { name: "Pending", value: 15, fill: "hsl(262, 60%, 55%)" },
  { name: "Cancelled", value: 8, fill: "hsl(0, 72%, 50%)" },
];
