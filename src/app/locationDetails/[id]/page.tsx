"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { CircleArrowLeft } from "lucide-react";

interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
}

interface Resident {
  id: number;
  name: string;
  image: string;
  species: string;
  status: string;
  location: { name: string };
}

interface Props {
  params: { id: string };
}

export default function LocationDetailPage({ params }: Props) {
  const router = useRouter();
  const { id } = params;

  const [location, setLocation] = useState<Location | null>(null);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLocationDetails() {
      setLoading(true);
      setError(null);

      try {
        const locationResponse = await axios.get(
          `https://rickandmortyapi.com/api/location/${id}`
        );
        const locationData: Location = locationResponse.data;
        setLocation(locationData);

        const residentIds = locationData.residents
          .map((url) => url.split("/").pop())
          .filter(Boolean) as string[];

        if (residentIds.length > 0) {
          const idsString = residentIds.join(",");
          const residentsResponse = await axios.get(
            `https://rickandmortyapi.com/api/character/${idsString}`
          );

          const residentsData = Array.isArray(residentsResponse.data)
            ? residentsResponse.data
            : [residentsResponse.data];

          setResidents(residentsData);
        } else {
          setResidents([]);
        }
      } catch {
        setError("Erro ao carregar detalhes da localização.");
      } finally {
        setLoading(false);
      }
    }

    fetchLocationDetails();
  }, [id]);

  return (
    <main className="min-h-screen bg-black text-gray-200 p-8 max-w-7xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-6 text-gray-400 hover:text-white transition"
        aria-label="Voltar"
      >
        <CircleArrowLeft size={24} />
        Voltar
      </button>

      <h1 className="text-4xl font-bold mb-6">Detalhes da Localização</h1>

      {loading && <p className="text-gray-500">Carregando...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {location && (
        <section className="mb-10 p-6 bg-zinc-900 rounded-xl border border-zinc-800">
          <h2 className="text-2xl font-semibold mb-2">{location.name}</h2>
          <p className="text-gray-400">
            Tipo:{" "}
            <span className="font-medium text-gray-300">{location.type}</span>
          </p>
          <p className="text-gray-400">
            Dimensão:{" "}
            <span className="font-medium text-gray-300">
              {location.dimension}
            </span>
          </p>
        </section>
      )}

      <h3 className="text-3xl font-semibold mb-4">Residentes</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {!loading &&
          !error &&
          residents.map((res) => (
            <Link
              key={res.id}
              href={`/personagensDetails/${res.id}`}
              className="block rounded-xl border border-zinc-800 bg-zinc-900 p-4 hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={res.image}
                alt={res.name}
                className="w-full h-48 object-cover rounded-md mb-3"
              />
              <h4 className="text-lg font-semibold">{res.name}</h4>
              <p className="text-gray-400">{res.species}</p>
              <p className="text-sm mt-1">
                <strong>Status: </strong>
                <span>{res.status}</span>
              </p>
              <p className="text-sm text-gray-400 mt-1">
                <strong>Última localização:</strong> {res.location.name}
              </p>
            </Link>
          ))}
      </div>
    </main>
  );
}
