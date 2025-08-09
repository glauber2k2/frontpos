"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { CircleArrowLeft } from "lucide-react";
import api from "@/api/server";

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
  location: { name: string };
}

interface Episode {
  id: number;
  name: string;
  episode: string;
  air_date: string;
  characters: string[];
}

export default function EpisodeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [episode, setEpisode] = useState<Episode | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchEpisodeDetails() {
      setLoading(true);
      setError(null);

      try {
        const episodeResponse = await api.get(`/episode/${id}`);
        const episodeData: Episode = episodeResponse.data;
        setEpisode(episodeData);

        const characterIds = episodeData.characters
          .map((url) => url.split("/").pop())
          .filter(Boolean);

        if (characterIds.length > 0) {
          const idsString = characterIds.join(",");
          const charactersResponse = await api.get(`/character/${idsString}`);
          const chars = Array.isArray(charactersResponse.data)
            ? charactersResponse.data
            : [charactersResponse.data];
          setCharacters(chars);
        } else {
          setCharacters([]);
        }
      } catch {
        setError("Erro ao carregar detalhes do episódio");
      } finally {
        setLoading(false);
      }
    }

    fetchEpisodeDetails();
  }, [id]);

  if (loading)
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-gray-400">
        Carregando...
      </main>
    );

  if (error)
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-red-500">
        {error}
      </main>
    );

  if (!episode)
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-gray-400">
        Episódio não encontrado.
      </main>
    );

  return (
    <main className="min-h-screen bg-black text-gray-200 py-10 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Botão Voltar */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition"
          aria-label="Voltar"
        >
          <CircleArrowLeft size={24} />
          Voltar
        </button>

        {/* Detalhes do Episódio */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">{episode.name}</h1>
          <p className="text-gray-400">
            <strong>Temporada:</strong> <span>{episode.episode}</span>
          </p>
          <p className="text-gray-400">
            <strong>Data de Exibição:</strong> <span>{episode.air_date}</span>
          </p>
        </section>

        {/* Lista de Personagens */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Personagens</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {characters.map((character) => (
              <Link
                key={character.id}
                href={`/personagensDetails/${character.id}`}
                className="block rounded-xl border border-zinc-800 bg-zinc-900 p-4 hover:shadow-lg transition-shadow"
              >
                <img
                  src={character.image}
                  alt={character.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-lg font-semibold text-white">
                  {character.name}
                </h3>
                <p className="text-gray-400">{character.species}</p>
                <p className="font-medium mt-1 text-gray-300">
                  Status: {character.status}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  <strong>Última localização:</strong> {character.location.name}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
