"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/api/server";
import Pagination from "@/components/Pagination";
import { Character, CharactersResponse } from "@/types/character";

export default function CharacterPage() {
  const [personagens, setPersonagens] = useState<Character[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    async function fetchPersonagens() {
      try {
        const response = await api.get<CharactersResponse>(
          `/character?page=${currentPage}`
        );
        setPersonagens(response.data.results);
        setTotalPages(response.data.info.pages);
      } catch (error) {
        console.error("Erro ao buscar personagens:", error);
      }
    }

    fetchPersonagens();
  }, [currentPage]);

  return (
    <main className="min-h-screen bg-black text-gray-200 py-10 px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Cabeçalho */}
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Personagens
          </h1>
          <p className="mt-2 text-gray-400">
            Explore todos os personagens disponíveis na API
          </p>
        </header>

        {/* Lista de Cards */}
        <section className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {personagens.map((personagem) => (
            <Link
              href={`/personagensDetails/${personagem.id}`}
              key={personagem.id}
              className="group"
            >
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-zinc-800 hover:scale-[1.02]">
                <img
                  src={personagem.image}
                  alt={personagem.name}
                  className="w-full h-56 object-cover group-hover:opacity-90 transition-opacity"
                />
                <div className="p-5 space-y-2">
                  <h2 className="text-lg font-semibold text-white">
                    {personagem.name}
                  </h2>
                  <p className="text-sm text-gray-400">{personagem.species}</p>
                  <p className="text-xs font-medium text-gray-300">
                    <span className="font-semibold">Status:</span>{" "}
                    {personagem.status}
                  </p>
                </div>
                <div className="px-5 pb-5 text-xs text-gray-400 border-t border-zinc-800 pt-3">
                  <strong className="block text-gray-300 mb-1">
                    Última localização:
                  </strong>
                  <span>{personagem.location.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </section>

        {/* Paginação */}
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </main>
  );
}
