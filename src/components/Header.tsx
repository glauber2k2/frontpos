// components/Header.tsx
"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="flex justify-between items-center max-w-7xl mx-auto p-6 text-gray-400">
      <span className="font-semibold text-lg cursor-default select-none">
        Rick and Morty
      </span>

      <nav className="flex gap-8 text-sm font-medium">
        <Link
          href="/"
          className="hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Personagens
        </Link>
        <Link
          href="/episodes"
          className="hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Episódios
        </Link>
        <Link
          href="/locations"
          className="hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Localizações
        </Link>
      </nav>
    </header>
  );
}
