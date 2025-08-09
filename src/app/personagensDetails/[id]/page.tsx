"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CircleArrowLeft } from "lucide-react";
import api from "@/api/server";
import type { Character } from "@/types/character";
import Episodes from "@/components/Episodes";

export default function CharacterDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchCharacter() {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get<Character>(`/character/${id}`);
        setCharacter(response.data);
      } catch {
        setError("Erro ao carregar personagem.");
      } finally {
        setLoading(false);
      }
    }

    fetchCharacter();
  }, [id]);

  if (loading)
    return (
      <main className="min-h-screen bg-black flex items-center justify-center text-gray-300">
        Carregando...
      </main>
    );

  if (error)
    return (
      <main className="min-h-screen bg-black flex items-center justify-center text-red-400">
        {error}
      </main>
    );

  if (!character)
    return (
      <main className="min-h-screen bg-black flex items-center justify-center text-gray-300">
        Personagem não encontrado.
      </main>
    );

  return (
    <main className="min-h-screen bg-black text-gray-200 py-10 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Botão Voltar */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition"
        >
          <CircleArrowLeft size={22} />
          Voltar
        </button>

        {/* Título */}
        <h1 className="text-3xl font-bold text-white">
          Detalhes do Personagem{" "}
          <span className="text-gray-400">{character.name}</span>
        </h1>

        {/* Card */}
        <div className="flex flex-col md:flex-row items-center gap-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex-1 space-y-2">
            <h2 className="text-2xl font-semibold text-white">
              {character.name}
            </h2>
            <p className="text-gray-400">
              <strong className="text-gray-300">Status:</strong>{" "}
              {character.status}
            </p>
            <p className="text-gray-400">
              <strong className="text-gray-300">Espécie:</strong>{" "}
              {character.species}
            </p>
            <p className="text-gray-400">
              <strong className="text-gray-300">Origem:</strong>{" "}
              {character.origin.name}
            </p>
            <p className="text-gray-400">
              <strong className="text-gray-300">Última localização:</strong>{" "}
              {character.location.name}
            </p>
          </div>
          <img
            src={character.image}
            alt={character.name}
            className="w-64 h-64 object-cover rounded-xl border border-zinc-800"
          />
        </div>

        {/* Aqui chamamos o componente Episodes */}
        <Episodes
          title={`${character.name} aparece nos seguintes episódios:`}
        />
      </div>
    </main>
  );
}
