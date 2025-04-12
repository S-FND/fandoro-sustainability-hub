
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real app, this would be an API call to initiate password reset
      // For demo purposes, we'll simulate a successful reset request
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast({
        title: "Reset link sent",
        description: "Check your email for password reset instructions",
      });
      
      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
      toast({
        title: "Request failed",
        description: "There was an error processing your request",
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
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              {!isSubmitted
                ? "Enter your email to receive a password reset link"
                : "Check your email for further instructions"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSubmitted ? (
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
                    disabled={isLoading}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Processing..." : "Send Reset Link"}
                </Button>
                
                <div className="text-center">
                  <Link to="/login" className="text-sm text-fandoro-blue hover:underline">
                    Back to login
                  </Link>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <p className="text-center text-muted-foreground">
                  If an account exists with this email, you will receive 
                  a password reset link shortly.
                </p>
                
                <Button
                  asChild
                  variant="outline"
                  className="w-full"
                >
                  <Link to="/login">Back to Login</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
