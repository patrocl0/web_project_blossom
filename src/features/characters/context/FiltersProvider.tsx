import { useState } from "react";
import { FiltersContext } from "./FiltersContext";
import type { Filters } from "../../../interfaces/Filters.interface";

export const FiltersProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [filters, setFilters] = useState<Filters>({
    name: "",
    character: "All",
    species: "All",
    status: "All",
    gender: "All",
  });

  return (
    <FiltersContext.Provider value={{ filters, setFilters }}>
      {children}
    </FiltersContext.Provider>
  );
};
