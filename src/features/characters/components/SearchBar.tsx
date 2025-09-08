import { useState } from "react";
import { useFilters } from "../hooks/useFilters";
import { useIsMobile } from "../hooks/useIsMobile";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiSliders } from "react-icons/fi";
import { FilterButton } from "./FilterButton";

export const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { filters, setFilters } = useFilters();

  const isMobile = useIsMobile();

  const navigate = useNavigate();

  return (
    <div className="relative w-[100%] md:w-[375px]">
      <div className="flex items-center bg-gray-200  rounded-xl px-3 py-2 shadow-sm">
        <FiSearch className="text-gray-400 mr-2 cursor-pointer" />
        <input
          type="text"
          placeholder="Search or filter results"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setFilters({ ...filters, name: search });
            }
          }}
          className="flex-1 outline-none text-gray-700"
        />

        {isMobile ? (
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition  cursor-pointer"
            onClick={() => navigate("/filters")}
          >
            <FiSliders className="text-purple-500" />
          </button>
        ) : (
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
          >
            <FiSliders className="text-purple-500" />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute top-14 left-0 w-full bg-white rounded-xl shadow-lg p-4 z-10">
          <FilterButton />

          <button
            onClick={() => setOpen(false)}
            className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition"
          >
            Filter
          </button>
        </div>
      )}
    </div>
  );
};
