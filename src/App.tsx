import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminLayout } from "./components/AdminLayout";
import Index from "./pages/Index";
import Categories from "./pages/Categories";
import Products from "./pages/Products";
import UsersPage from "./pages/UsersPage";
import Orders from "./pages/Orders";
import Reviews from "./pages/Reviews";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route path="/" element={<Index />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/products" element={<Products />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/reviews" element={<Reviews />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
