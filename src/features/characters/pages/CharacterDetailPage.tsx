import { useNavigate } from "react-router";
import { useCharacterDetail } from "../hooks/useCharacterDetail";
import { FaHeart } from "react-icons/fa";
import { useIsMobile } from "../hooks/useIsMobile";
import { IoArrowBack } from "react-icons/io5";

export const CharacterDetailPage = () => {
  const { character, loading, error } = useCharacterDetail();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="ml-[24px] mr-[24px] sm:ml-[100px] ">
      {isMobile && (
        <button
          onClick={() => navigate("/")}
          className="mb-4 px-3 py-2 text-2xl text-[#8054C7]"
        >
          <IoArrowBack />
        </button>
      )}

      <img
        src={character?.image}
        alt={character?.name}
        className=" w-[75px] h-[75px]  md:w-40 md:h-40  rounded-full my-4"
      />

      <button className="absolute p-[10px] left-[85px] top-[120px] text-[20px] text-green-500 rounded-full bg-white cursor-pointer  md:text-2xl  md:top-[155px] md:left-[630px]  ">
        <FaHeart />
      </button>

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
          <div>
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
