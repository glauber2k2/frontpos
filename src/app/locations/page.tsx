"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import Pagination from "@/components/Pagination"; // Ajuste o caminho se precisar

interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
}

export default function LocationsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLocations() {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `https://rickandmortyapi.com/api/location?page=${currentPage}`
        );
        setLocations(response.data.results);
        setTotalPages(response.data.info.pages);
      } catch {
        setError("Erro ao carregar as localizações");
      } finally {
        setLoading(false);
      }
    }

    fetchLocations();
  }, [currentPage]);

  return (
    <main className="min-h-screen bg-black text-gray-200 p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Localizações</h1>

      {loading && <p className="text-gray-400">Carregando...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading &&
          !error &&
          locations.map((loc) => (
            <Link
              key={loc.id}
              href={`/locationDetails/${loc.id}`}
              className="block rounded-xl border border-zinc-800 bg-zinc-900 p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <strong className="text-xl text-white">{loc.name}</strong>
              <p className="mt-2 text-gray-400">
                Tipo:{" "}
                <span className="font-medium text-gray-300">{loc.type}</span>
              </p>
              <p className="text-gray-400">
                Dimensão:{" "}
                <span className="font-medium text-gray-300">
                  {loc.dimension}
                </span>
              </p>
            </Link>
          ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </main>
  );
}
