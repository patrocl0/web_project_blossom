import { useState } from "react";
import { useCharacters } from "../hooks/useCharacters";
import { Sidebar } from "../../../components/Sidebar";
import { Outlet } from "react-router-dom";

export const CharactersPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { characters, loading, error } = useCharacters(page, search);

  if (loading) return <p className="text-white">Cargando...</p>;
  if (error) return <p className="text-red-500">Error al cargar</p>;

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Sidebar characters={characters} />
      <main className="flex-1 bg-white p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
