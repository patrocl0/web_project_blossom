import { Sidebar } from "../../../components/Sidebar";
import { useCharacters } from "../hooks/useCharacters";

export const CharactersListPage = () => {
  const { characters, loading, error } = useCharacters(1, "");

  if (loading) return <p className="text-white">Cargando...</p>;
  if (error) return <p className="text-red-500">Error al cargar</p>;

  return (
    <div className="block md:hidden h-screen">
      <Sidebar characters={characters} />
    </div>
  );
};
