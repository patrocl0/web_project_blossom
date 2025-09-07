import { useState } from "react";
import { FiSearch, FiSliders } from "react-icons/fi";

export const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  console.log(search);

  return (
    <div className="relative w-[100%] md:w-[375px]">
      {/* Input + botón filtro */}
      <div className="flex items-center bg-gray-200  rounded-xl px-3 py-2 shadow-sm">
        <FiSearch className="text-gray-400 mr-2 cursor-pointer" />
        <input
          type="text"
          placeholder="Search or filter results"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 outline-none text-gray-700"
        />
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
        >
          <FiSliders className="text-purple-500" />
        </button>
      </div>

      {/* Dropdown filtros */}
      {open && (
        <div className="absolute top-14 left-0 w-full bg-white rounded-xl shadow-lg p-4 z-10">
          {/* Character filter */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Character
            </h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded-lg bg-purple-100 text-purple-600 font-medium">
                All
              </button>
              <button className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200">
                Starred
              </button>
              <button className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200">
                Others
              </button>
            </div>
          </div>

          {/* Species filter */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Species</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded-lg bg-purple-100 text-purple-600 font-medium">
                All
              </button>
              <button className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200">
                Human
              </button>
              <button className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200">
                Alien
              </button>
            </div>
          </div>

          <button className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition">
            Filter
          </button>
        </div>
      )}
    </div>
  );
};
