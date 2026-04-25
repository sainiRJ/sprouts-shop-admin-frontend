import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/store";
import { setCredentials, logout } from "@/store/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ShoppingBag, Eye, EyeOff } from "lucide-react";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import {
  useLoginMutation,
  useLazyGetProfileQuery,
} from "@/store/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();
  const [triggerProfile, { isLoading: isLoadingProfile }] =
    useLazyGetProfileQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginResponse = await loginMutation({ email, password }).unwrap();
      const payload = (loginResponse?.data ?? loginResponse) || {};

      const accessToken = payload.accessToken;
      if (!accessToken) {
        throw new Error("Invalid login response");
      }

      dispatch(
        setCredentials({
          fullName: payload.fullName,
          email: payload.email,
          accessToken,
        })
      );

      const profileResponse = await triggerProfile().unwrap();
      const profile = profileResponse?.data ?? profileResponse ?? {};

      if (profile.role !== "admin") {
        dispatch(logout());
        toast.error("You are not authorized to access the admin panel");
        return;
      }

      toast.success("Welcome back!");
      navigate("/");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Invalid credentials or unable to login"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">ShopAdmin</h1>
          <p className="text-sm text-muted-foreground">Sign in to your admin panel</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@shop.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoggingIn || isLoadingProfile}
          >
            {isLoggingIn || isLoadingProfile ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;

