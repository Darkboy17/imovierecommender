"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FaFilm, FaLock, FaUserPlus } from "react-icons/fa";

import { useAuth } from "@/app/contexts/auth-context";
import logo from "../../../public/logo/imovie-logo-pro-nav.png";

type Mode = "login" | "register";

export default function AuthPage() {
  const router = useRouter();
  const { user, loading, login, register } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [loading, router, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-background text-foreground">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(240,180,41,0.22),transparent_40%),linear-gradient(20deg,rgba(31,122,140,0.2),transparent_45%)]" />
      <div className="relative mx-auto grid min-h-dvh w-full max-w-6xl items-center gap-8 px-4 py-8 sm:gap-10 sm:py-10 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,26rem)]">
        <section className="min-w-0 max-w-2xl">
          <Image
            src={logo}
            alt="IMovie Recommender"
            width={280}
            height={64}
            className="h-auto w-48 max-w-full sm:w-[280px]"
            priority
          />
          <div className="mt-8 inline-flex max-w-full items-center gap-2 rounded-md border border-black/10 bg-white/70 px-3 py-2 text-sm font-semibold text-copper shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-ember sm:mt-10">
            <FaFilm />
            Private recommendations
          </div>
          <h1 className="mt-5 text-4xl font-black leading-tight text-zinc-950 dark:text-white sm:text-5xl md:text-7xl">
            Your movie taste, remembered.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-zinc-700 dark:text-zinc-300 sm:text-lg sm:leading-8">
            Rate movies you already know, explore the library, and get a personalized watchlist shaped around your taste.
          </p>
        </section>

        <section className="min-w-0 rounded-lg border border-black/10 bg-white/85 p-4 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/85 sm:p-6">
          <div className="mb-6 grid grid-cols-2 rounded-md bg-zinc-100 p-1 dark:bg-white/10">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition sm:px-4 ${
                mode === "login" ? "bg-ember text-ink shadow" : "text-zinc-600 dark:text-zinc-300"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition sm:px-4 ${
                mode === "register" ? "bg-ember text-ink shadow" : "text-zinc-600 dark:text-zinc-300"
              }`}
            >
              Register
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === "register" && (
              <label className="block">
                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">Name</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-2 h-12 w-full rounded-md border border-black/10 bg-white px-3 text-zinc-950 outline-none focus:border-ember focus:ring-4 focus:ring-ember/20 dark:border-white/10 dark:bg-zinc-900 dark:text-white"
                  placeholder="Your name"
                  required
                />
              </label>
            )}

            <label className="block">
              <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 h-12 w-full rounded-md border border-black/10 bg-white px-3 text-zinc-950 outline-none focus:border-ember focus:ring-4 focus:ring-ember/20 dark:border-white/10 dark:bg-zinc-900 dark:text-white"
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 h-12 w-full rounded-md border border-black/10 bg-white px-3 text-zinc-950 outline-none focus:border-ember focus:ring-4 focus:ring-ember/20 dark:border-white/10 dark:bg-zinc-900 dark:text-white"
                placeholder="Minimum 8 characters"
                minLength={8}
                required
              />
            </label>

            {error && (
              <div className="rounded-md border border-copper/30 bg-copper/10 p-3 text-sm text-copper dark:text-ember">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-ink px-4 font-bold text-white transition hover:bg-copper disabled:cursor-not-allowed disabled:opacity-60 dark:bg-ember dark:text-ink dark:hover:bg-copper dark:hover:text-white"
            >
              {mode === "login" ? <FaLock /> : <FaUserPlus />}
              {submitting ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
