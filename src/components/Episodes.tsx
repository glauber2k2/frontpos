"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/api/server";

interface Episode {
  id: number;
  name: string;
  episode: string;
  air_date: string;
}

interface Props {
  title?: string;
}

export default function Episodes({ title }: Props) {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(`/episode`);
        setEpisodes(response.data.results);
      } catch {
        setError("Erro ao carregar episódios");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mt-8">
      <h3 className="text-xl font-semibold text-white mb-4">
        {title ?? "Episódios"}
      </h3>

      {loading && <p className="text-gray-400">Carregando episódios...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul className="space-y-3 max-h-72 overflow-y-auto">
        {!loading &&
          !error &&
          episodes.map((ep) => (
            <li
              key={ep.id}
              className="p-3 bg-zinc-800 rounded-md hover:bg-zinc-700 transition"
            >
              <Link
                href={`/episodesDetails/${ep.id}`}
                className="block text-gray-300 hover:text-white"
              >
                <strong>{ep.name}</strong>
                <p className="text-sm text-gray-400">Episódio: {ep.episode}</p>
                <p className="text-sm text-gray-400">
                  Data Exibição: {ep.air_date}
                </p>
              </Link>
            </li>
          ))}
      </ul>
    </section>
  );
}
