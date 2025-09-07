import { Link } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import type { Character } from "../interfaces/Character.interface";
import { SearchBar } from "./SearchBar";
import { useFavorites } from "../features/characters/hooks/useFavorites";

interface SidebarProps {
  characters: Character[];
}

export const Sidebar = ({ characters }: SidebarProps) => {
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <aside className="w-[100%] md:w-[375px] bg-white h-screen flex flex-col">
      <h1 className="text-xl font-bold p-4">Rick and Morty list</h1>

      <SearchBar />

      <div className="px-4 mt-4 overflow-y-auto">
        <h2 className="text-sm mb-[16px] mt-[36px]  font-semibold text-gray-500 ">
          Starred Characters
        </h2>
        {characters
          .filter((c) => favorites.includes(c.id))
          .map((item) => (
            <Link
              key={item.id}
              to={`character/${item.id}`}
              className={`flex items-center gap-2 p-4 rounded-lg hover:bg-gray-100 `}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-gray-500">{item.species}</p>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite(item.id);
                }}
                className="text-2xl text-gray-400 transition-transform  ease-in-out cursor-pointer"
              >
                {favorites.includes(item.id) ? (
                  <FaHeart className="text-green-500  scale-100" />
                ) : (
                  <CiHeart className="hover:scale-100 transition-transform" />
                )}
              </button>
            </Link>
          ))}
      </div>

      <div className="px-4 mt-4 flex-1 overflow-y-auto">
        <h2 className="text-sm font-semibold text-gray-500">Characters</h2>
        {characters.map((item) => (
          <Link
            key={item.id}
            to={`character/${item.id}`}
            className={`flex items-center gap-2 p-4 rounded-lg hover:bg-gray-100 `}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-gray-500">{item.species}</p>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleFavorite(item.id);
              }}
              className="text-2xl text-gray-400 transition-transform  ease-in-out cursor-pointer"
            >
              {favorites.includes(item.id) ? (
                <FaHeart className="text-green-500  scale-100" />
              ) : (
                <CiHeart className="hover:scale-100 transition-transform" />
              )}
            </button>
          </Link>
        ))}
      </div>
    </aside>
  );
};
