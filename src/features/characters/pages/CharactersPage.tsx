import { useState } from "react";
import { useCharacters } from "../hooks/useCharacters";
import { Sidebar } from "../../../components/Sidebar";
import { Outlet, useParams } from "react-router-dom";
import { useIsMobile } from "../hooks/useIsMobile";

export const CharactersPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { characters, loading, error } = useCharacters(page, search);

  const { id } = useParams();
  const isMobile = useIsMobile();

  if (loading) return <p className="text-white">Cargando...</p>;
  if (error) return <p className="text-red-500">Error al cargar</p>;

  if (isMobile) {
    // Si no hay personaje seleccionado → muestro lista
    if (!id) {
      return (
        <div className="w-full min-h-screen bg-gray-50">
          <Sidebar characters={characters} />
        </div>
      );
    }

    return (
      <main className="w-full min-h-screen  bg-white ">
        <Outlet />
      </main>
    );
  }

  return (
    <div className="flex flex-row h-screen">
      <Sidebar characters={characters} />
      <main className="flex-1 bg-white p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
