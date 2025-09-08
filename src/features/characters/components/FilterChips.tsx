type FilterChipsProps = {
  options: string[];
  value: string;
  onChange: (val: string) => void;
};

export const FilterChips = ({ options, value, onChange }: FilterChipsProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`p-4 rounded-lg w-100  font-medium
              ${
                value === opt
                  ? " bg-purple-100 text-purple-600"
                  : "bg-gray-100 text-gray-700"
              }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
};
