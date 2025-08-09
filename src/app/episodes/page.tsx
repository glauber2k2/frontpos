"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/api/server";

interface Episode {
  id: number;
  name: string;
  episode: string;
  air_date: string;
}

export default function Page() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEpisodes() {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/episode");
        setEpisodes(response.data.results);
      } catch {
        setError("Erro ao carregar episódios.");
      } finally {
        setLoading(false);
      }
    }
    fetchEpisodes();
  }, []);

  return (
    <main className="min-h-screen  p-8 max-w-7xl mx-auto">
      <h1 className="text-white text-3xl font-semibold mb-8">Episódios</h1>

      {loading && <p className="text-gray-400">Carregando episódios...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {episodes.map((ep) => (
            <Link
              key={ep.id}
              href={`/episodesDetails/${ep.id}`}
              className="block rounded-xl border border-zinc-700 bg-zinc-800 p-5 hover:border-white transition-colors"
            >
              <h2 className="text-white text-lg font-semibold mb-2">
                {ep.name}
              </h2>
              <p className="text-gray-400 text-sm mb-1">
                Episódio: {ep.episode}
              </p>
              <p className="text-gray-400 text-sm">
                Data de exibição: {ep.air_date}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
