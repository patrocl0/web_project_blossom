import { useNavigate } from "react-router";
import { FilterButton } from "./FilterButton";

export const FiltersPanel = () => {
  const navigate = useNavigate();

  const handleApply = () => {
    navigate("/");
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen flex flex-col">
      <div className="flex-1">
        <FilterButton />
      </div>

      <button
        onClick={handleApply}
        className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600"
      >
        Filter
      </button>
    </div>
  );
};
