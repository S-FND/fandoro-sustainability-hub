
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast({
        title: "Login successful",
        description: "Welcome to Fandoro Sustainability Hub",
      });
      
      // Redirect based on email domain for demo purposes
      if (email.includes('fandoro.com')) {
        navigate('/admin/dashboard');
      } else if (email.includes('enterprise')) {
        navigate('/onboarding');
      } else if (email.includes('employee')) {
        navigate('/employee/profile');
      } else if (email.includes('supplier')) {
        navigate('/supplier/profile');
      } else {
        navigate('/dashboard/general');
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-fandoro-green">Fandoro</h1>
          <p className="text-muted-foreground">Sustainability Hub</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-fandoro-blue hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-fandoro-blue hover:underline">
                Register
              </Link>
            </div>
            
            <div className="mt-6 p-3 bg-muted rounded-md">
              <p className="text-xs text-center text-muted-foreground mb-2">
                For demo purposes, use these emails:
              </p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>admin@fandoro.com - Fandoro Admin</li>
                <li>user@enterprise.com - Enterprise User</li>
                <li>user@employee.com - Employee User</li>
                <li>user@supplier.com - Supplier User</li>
              </ul>
              <p className="text-xs text-center text-muted-foreground mt-2">
                Any password will work
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
