"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const data = {
      firstName: form.get("firstName") as string,
      lastName: form.get("lastName") as string,
      email: form.get("email") as string,
      password: form.get("password") as string,
      organizationName: form.get("organizationName") as string,
    };

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Registration failed");
      } else {
        router.push("/login");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-black px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
            F
          </div>
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Set up your finance platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name" name="firstName" placeholder="John" required />
            <Input label="Last Name" name="lastName" placeholder="Doe" required />
          </div>
          <Input
            label="Organization"
            name="organizationName"
            placeholder="Company Inc."
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="you@company.com"
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Min. 8 characters"
            required
          />

          {error && (
            <div className="text-sm text-danger bg-red-50 dark:bg-red-950 rounded-lg p-3">
              {error}
            </div>
          )}

          <Button type="submit" loading={loading} className="w-full">
            Create Account
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <a href="/login" className="text-brand-600 hover:text-brand-700">
              Sign In
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
