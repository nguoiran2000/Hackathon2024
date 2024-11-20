"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignIn() {
  const [email, setEmail] = useState<string>('');
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('email')) {
      router.push("/");
    }
  }, []);
  return (
    <>
      <>
        <div className="mb-10">
          <h1 className="text-4xl font-bold">Sign in to your account</h1>
        </div>
        {/* Form */}
        <form onSubmit={() => localStorage.setItem('email', email)}>
          <div className="space-y-4">
            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input w-full py-2"
                type="email"
                placeholder="corybarker@email.com"
                required
              />
            </div>
            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                className="form-input w-full py-2"
                type="password"
                autoComplete="on"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          <div className="mt-6">
            <button className="btn w-full bg-gradient-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow hover:bg-[length:100%_150%]">
              Sign In
            </button>
          </div>
        </form>
        {/* Bottom link */}
        <div className="mt-6 text-center">
          <Link
            className="text-sm text-gray-700 underline hover:no-underline"
            href="/reset-password"
          >
            Forgot password
          </Link>
        </div>
      </>
    </>
  );
}
