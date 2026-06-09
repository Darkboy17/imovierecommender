"use client";

import { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";

import type { SettingsState } from "@/app/types/movie";

type SettingsProps = {
  onClose: () => void;
  onSave: (settings: SettingsState) => void;
  settings: SettingsState;
};

const options = Array.from({ length: 25 }, (_, i) => (i + 1) * 10);

export default function Settings({ onClose, onSave, settings: incomingSettings }: SettingsProps) {
  const [settings, setSettings] = useState<SettingsState>(incomingSettings);
  const initialSettingsRef = useRef(incomingSettings);

  useEffect(() => {
    setSettings(incomingSettings);
    initialSettingsRef.current = incomingSettings;
  }, [incomingSettings]);

  const settingsChanged =
    settings.numMovies !== initialSettingsRef.current.numMovies;

  const handleSaveChanges = () => {
    localStorage.setItem("settings", JSON.stringify(settings));
    initialSettingsRef.current = settings;
    onSave(settings);
  };

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-ink/70 px-3 py-4 backdrop-blur-sm sm:px-4">
      <div className="settings max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-lg border border-black/10 bg-white p-4 shadow-2xl dark:border-white/10 dark:bg-zinc-950 sm:p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-950 dark:text-white">Settings</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-md text-zinc-500 transition hover:bg-copper hover:text-white"
            aria-label="Close settings"
            title="Close"
          >
            <FaTimes />
          </button>
        </div>

        <div className="mt-5 space-y-5">
          <label className="block">
            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
              Number of recommendations
            </span>
            <select
              className="mt-2 h-11 w-full rounded-md border border-black/10 bg-white px-3 text-zinc-950 outline-none focus:border-ember focus:ring-4 focus:ring-ember/20 dark:border-white/10 dark:bg-zinc-900 dark:text-white"
              value={settings.numMovies}
              onChange={(event) =>
                setSettings({ ...settings, numMovies: Number(event.target.value) })
              }
            >
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={!settingsChanged}
            className="rounded-md bg-ember px-4 py-2 text-sm font-semibold text-ink transition hover:bg-ember/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
