import { createContext } from "react";
import type { Filters } from "../../../interfaces/Filters.interface";

type FiltersContextType = {
  filters: Filters;
  setFilters: (filters: Filters) => void;
};

export const FiltersContext = createContext<FiltersContextType>({
  filters: {
    name: "Rick",
    character: "All",
    species: "All",
    status: "All",
    gender: "All",
  },
  setFilters: () => {},
});
