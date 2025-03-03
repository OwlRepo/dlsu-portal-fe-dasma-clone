"use client";
import React, { useEffect, useState } from "react";
import { Logo } from "../logo";
import { useAuth } from "@/lib/auth-context";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

interface LoginProps {
  role: string;
}

const LoginForm = ({ role }: LoginProps) => {
  const pathname = usePathname();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<string>("");

  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if username, password, and role are provided
    if (!username || !password || !role) {
      setError("Please enter username, password, and select a role.");
      return;
    }

    setLoading(true);

    try {
      const res = await login(username, password, role);
      if (res) {
        setLoading(false);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
        duration: 3000,
      });
      setLoading(false);
    }

    setError("");
  };

  useEffect(() => {
    setUserType(pathname === "/login" ? "admin" : "employee");
  }, [pathname]);

  const isButtonDisabled = !username || !password || !role;

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-col justify-between items-center w-[50%] p-8">
        {" "}
        {/* Use justify-between to push footer down */}
        <div className="my-auto">
          <h1 className="text-xl font-bold text-[#00bc65] mb-2">
            Sign-in to your {userType} account
          </h1>
          <p className="text-sm text-gray-500">
            Ready to dive in? Just sign in to continue where you left off.
          </p>
          {error && <p className="text-red-500">{error}</p>}
          <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#00bc65] text-white py-2 rounded-md flex items-center justify-center"
              disabled={isButtonDisabled}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Sign in"
              )}
            </button>
            <div className="flex justify-center">
              <Link href={pathname === "/login" ? "/login/employee" : "/login"}>
                <p className="text-[#00bc65] text-sm">
                  Login as {pathname === "/login" ? "employee" : "admin"}?
                </p>
              </Link>
            </div>
          </form>
        </div>
        {/* Footer Section */}
        <footer className="mt-4 text-center text-xs text-gray-500">
          <p>Powered by ELID Technology Intl., Inc.</p>
          <p>Version 1.0.1</p>
        </footer>
      </div>
      {/* Right Side: Background Image */}
      <div className="relative w-[50%] h-[95vh] bg-[#02a65b] rounded-xl my-auto mr-6">
        <div
          style={{
            backgroundImage: "url(/image-pattern.png)", // Adjust the path as needed
            // backgroundSize: 'cover',
            // backgroundPosition: 'center',
            opacity: 0.05, // Adjust opacity to make the image less noticeable
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
          }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          <Logo />
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
