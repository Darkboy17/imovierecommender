"use client";

import { FaBriefcase, FaGithub, FaLinkedinIn } from "react-icons/fa";

const links = [
  { href: "https://github.com/Darkboy17", label: "GitHub", icon: FaGithub },
  { href: "https://kordorpyrbot.dpdns.org/", label: "Portfolio", icon: FaBriefcase },
  { href: "https://www.linkedin.com/in/kordor-pyrbot/", label: "LinkedIn", icon: FaLinkedinIn },
];

export default function LeftBar() {
  return (
    <aside className="fixed left-4 top-24 z-40 hidden flex-col gap-3 rounded-lg border border-black/10 bg-white/70 p-2 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-white/5 md:flex">
      {links.map(({ href, label, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="grid h-10 w-10 place-items-center rounded-md text-zinc-700 transition hover:bg-ember hover:text-ink dark:text-zinc-200"
          title={label}
          aria-label={label}
        >
          <Icon />
        </a>
      ))}
    </aside>
  );
}
