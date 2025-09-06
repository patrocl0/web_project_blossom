import { useCharacterDetail } from "../hooks/useCharacterDetail";

export const CharacterDetailPage = () => {
  const { character, loading, error } = useCharacterDetail();

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="ml-[100px]">
      <img
        src={character?.image}
        alt={character?.name}
        className="w-40 h-40 rounded-full my-4"
      />
      <h1 className="text-2xl font-bold">{character?.name}</h1>
      <div>
        <div className="grid grid-cols-1  gap-4 mt-4">
          <div className="border-b border-gray-300">
            <div className="font-bold text-gray-900">Specie</div>
            <div className="font-medium text-gray-600">
              {character?.species}
            </div>
          </div>
          <div className="border-b border-gray-300">
            <div className="font-bold text-gray-900">Status</div>
            <div className="font-medium text-gray-600">{character?.status}</div>
          </div>
          <div className="border-b border-gray-300">
            <div className="font-bold text-gray-900">Occupation</div>
            <div className="font-medium text-gray-600">
              {character?.species}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
