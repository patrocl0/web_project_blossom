import { Link } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { useState } from "react";
import type { Character } from "../interfaces/Character.interface";
import { SearchBar } from "./SearchBar";

interface SidebarProps {
  characters: Character[];
}

export const Sidebar = ({ characters }: SidebarProps) => {
  console.log(5, characters);

  const [likes, setLikes] = useState<{ [key: string]: boolean }>({});

  const toggleLike = (id: string) => {
    setLikes((prev) => ({
      ...prev,
      [id]: !prev[id], // Solo se anima el que corresponde
    }));
  };

  return (
    <aside className="w-[375px] bg-white h-screen flex flex-col">
      <h1 className="text-xl font-bold p-4">Rick and Morty list</h1>
      {/*> */}

      <SearchBar />

      <div className="px-4 mt-4 overflow-y-auto">
        <h2 className="text-sm font-semibold text-gray-500">
          Starred Characters
        </h2>
        {characters.map((c) => (
          <Link
            key={c.id}
            to={`/character/${c.id}`}
            className={`flex items-center gap-2 p-4 rounded-lg hover:bg-gray-100 `}
          >
            <img src={c.image} alt={c.name} className="w-8 h-8 rounded-full" />
            <div className="flex-1">
              <p className="text-sm font-medium">{c.name}</p>
              <p className="text-xs text-gray-500">{c.species}</p>
            </div>
            <button
              onClick={() => toggleLike(c.id)}
              className="text-2xl text-gray-400 transition-transform  ease-in-out cursor-pointer"
            >
              {likes[c.id] ? (
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
        {/* {characters.map((c) => (
          <Link
            key={c.id}
            to={`/character/${c.id}`}
            className={`flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 ${
              location.pathname.includes(`${c.id}`) ? "bg-purple-100" : ""
            }`}
          >
            <img src={c.image} alt={c.name} className="w-8 h-8 rounded-full" />
            <div>
              <p className="text-sm font-medium">{c.name}</p>
              <p className="text-xs text-gray-500">{c.species}</p>
            </div>
          </Link>
        ))} */}
      </div>
    </aside>
  );
};
