import { useState } from "react";
import { useCharacters } from "../hooks/useCharacters";
import { Sidebar } from "../../../components/Sidebar";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { useIsMobile } from "../hooks/useIsMobile";
import { useFilters } from "../hooks/useFilters";

export const CharactersPage = () => {
  const [page, setPage] = useState(1);
  const { filters } = useFilters();
  const { characters, loading, error } = useCharacters(page, filters);
  const { pathname } = useLocation();
  const isFiltersRoute = pathname.endsWith("/filters");

  const { id } = useParams();
  const isMobile = useIsMobile();

  if (loading) return <p className="text-white">Cargando...</p>;
  if (error) return <p className="text-red-500">Error al cargar</p>;

  if (isMobile) {
    if (isFiltersRoute) {
      return (
        <main className="w-full min-h-screen bg-white">
          <Outlet />
        </main>
      );
    }
    if (id) {
      return (
        <main className="w-full min-h-screen bg-white">
          <Outlet />
        </main>
      );
    }

    return (
      <div className="w-full min-h-screen bg-gray-50">
        <Sidebar characters={characters} />
      </div>
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
