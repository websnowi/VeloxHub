
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AuthModalProps {
  isOpen: boolean;
  onLogin: (credentials: any) => void;
}

export const AuthModal = ({ isOpen, onLogin }: AuthModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ email, password });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ email, password, name });
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">VH</span>
          </div>
          <DialogTitle className="text-2xl font-bold text-white">Welcome to VeloxHub</DialogTitle>
          <p className="text-slate-400">Your unified business command center</p>
        </DialogHeader>

        <Tabs defaultValue="login" className="mt-6">
          <TabsList className="grid w-full grid-cols-2 bg-slate-700">
            <TabsTrigger value="login" className="text-slate-300 data-[state=active]:text-white">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signup" className="text-slate-300 data-[state=active]:text-white">
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-slate-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Sign In
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="mt-6">
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-slate-300">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="signup-email" className="text-slate-300">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <Label htmlFor="signup-password" className="text-slate-300">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Create a password"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Create Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
