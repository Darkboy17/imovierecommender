"use client";

import Image from "next/image";
import { useState } from "react";
import { FaMapSigns, FaMoon, FaPowerOff, FaSlidersH, FaSun } from "react-icons/fa";

import { useAuth } from "@/app/contexts/auth-context";
import { useTheme } from "@/app/contexts/theme-context";
import logo from "../../../public/logo/imovie-logo-pro-nav.png";
import ConfirmDialog from "./ConfirmDialog";

type TopBarProps = {
  onSettingsClick: () => void;
  onTourClick: () => void;
};

export default function TopBar({ onSettingsClick, onTourClick }: TopBarProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleLogout = async () => {
    setConfirmOpen(false);
    await logout();
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-background/85 px-2 backdrop-blur-xl dark:border-white/10 sm:px-4">
        <div className="flex min-h-16 w-full items-center justify-between gap-2 py-2 sm:gap-4 sm:py-0">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Image
              src={logo}
              alt="IMovie Recommender"
              width={220}
              height={51}
              className="h-auto w-24 shrink-0 min-[380px]:w-32 sm:w-40 lg:w-[220px]"
              priority
            />
            <div className="hidden text-sm text-zinc-600 dark:text-zinc-300 lg:block">
              Personal picks from your ratings
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5 sm:flex-nowrap sm:gap-2">
            {user && (
              <button
                type="button"
                onClick={onTourClick}
                className="grid h-9 w-9 place-items-center rounded-md border border-black/10 bg-white/70 text-sm font-semibold text-zinc-800 transition hover:border-ember hover:text-copper dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 sm:flex sm:h-10 sm:w-auto sm:gap-2 sm:px-3"
                title="Start tour"
                aria-label="Start tour"
              >
                <FaMapSigns />
                <span className="hidden sm:inline">Tour</span>
              </button>
            )}
            {user && (
              <div className="hidden max-w-48 truncate text-sm text-zinc-700 dark:text-zinc-200 md:block">
                {user.name || user.email}
              </div>
            )}
            <button
              type="button"
              onClick={toggleTheme}
              className="grid h-9 w-9 place-items-center rounded-md border border-black/10 bg-white/70 text-zinc-800 transition hover:border-ember hover:text-copper dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 sm:h-10 sm:w-10"
              title={theme === "dark" ? "Use light mode" : "Use dark mode"}
              aria-label={theme === "dark" ? "Use light mode" : "Use dark mode"}
            >
              {theme === "dark" ? <FaSun /> : <FaMoon />}
            </button>
            <button
              type="button"
              onClick={onSettingsClick}
              className="grid h-9 w-9 place-items-center rounded-md border border-black/10 bg-white/70 text-zinc-800 transition hover:border-ember hover:text-copper dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 sm:h-10 sm:w-10"
              title="Settings"
              aria-label="Settings"
            >
              <FaSlidersH />
            </button>
            {user && (
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="grid h-9 w-9 place-items-center rounded-md bg-ink text-white transition hover:bg-copper dark:bg-ember dark:text-ink dark:hover:bg-copper dark:hover:text-white sm:h-10 sm:w-10"
                title="Logout"
                aria-label="Logout"
              >
                <FaPowerOff />
              </button>
            )}
          </div>
        </div>
      </header>

      <ConfirmDialog
        open={confirmOpen}
        title="Log out?"
        description="Your saved ratings stay on this device, but you will need to sign in again before getting recommendations."
        confirmLabel="Log out"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
