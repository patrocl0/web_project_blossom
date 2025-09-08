import { useFilters } from "../hooks/useFilters";
import { FilterChips } from "./FilterChips";

export const FilterButton = () => {
  const { filters, setFilters } = useFilters();
  return (
    <>
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Character</h3>
        <div className="flex gap-2">
          <FilterChips
            options={["All", "Starred", "Others"]}
            value={filters.character ?? "All"}
            onChange={(val) =>
              setFilters({
                ...filters,
                character: val as "All" | "Starred" | "Others",
              })
            }
          />
        </div>
      </div>

      {/* Species filter */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Species</h3>
        <div className="flex gap-2">
          <FilterChips
            options={["All", "Human", "Alien"]}
            value={filters.species ?? "All"}
            onChange={(val) =>
              setFilters({
                ...filters,
                species: val as "All" | "Human" | "Alien",
              })
            }
          />
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
        <div className="flex gap-2">
          <FilterChips
            options={["All", "alive", "dead"]}
            value={filters.status ?? "All"}
            onChange={(val) =>
              setFilters({
                ...filters,
                status: val as "All" | "Alive" | "Dead",
              })
            }
          />
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Gender</h3>
        <div className="flex gap-2">
          <FilterChips
            options={["All", "female", "male"]}
            value={filters.gender ?? "All"}
            onChange={(val) =>
              setFilters({
                ...filters,
                gender: val as "All" | "Male" | "Female",
              })
            }
          />
        </div>
      </div>
    </>
  );
};
