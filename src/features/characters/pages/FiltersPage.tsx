import { useNavigate } from "react-router";
import { FiltersPanel } from "../components/FiltersPanel";
import { IoArrowBack } from "react-icons/io5";

export const FiltersPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <div className="relative flex items-center p-4 ">
        <button
          onClick={() => navigate("/")}
          className="mb-4 px-3 py-2 text-2xl text-[#8054C7]"
        >
          <IoArrowBack />
        </button>
        <h2 className="absolute left-1/2 transform -translate-x-1/2 text-lg font-semibold text-gray-900">
          Filters
        </h2>
      </div>
      <FiltersPanel />
    </div>
  );
};
