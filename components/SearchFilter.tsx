"use client";

import { useRef, useState } from "react";
import { Search } from "lucide-react";

interface FilterOption {
  label: string;
  key: string;
  options: { value: string; label: string }[];
}

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: Record<string, string>) => void;
  filters?: FilterOption[];
}

export default function SearchFilter({
  onSearch,
  onFilterChange,
  filters = [],
}: SearchFilterProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleSearch = (value: string) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onSearch(value), 300);
  };

  const handleFilter = (key: string, value: string) => {
    const updated = { ...activeFilters, [key]: value };
    if (!value) delete updated[key];
    setActiveFilters(updated);
    onFilterChange(updated);
  };

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="relative flex-1 min-w-[280px]">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search prescriptions..."
          onChange={(e) => handleSearch(e.target.value)}
          className="input pl-12"
          style={{ height: 48 }}
        />
      </div>

      {filters.map((filter) => (
        <select
          key={filter.key}
          onChange={(e) => handleFilter(filter.key, e.target.value)}
          className="select min-w-[160px]"
          style={{ height: 48 }}
        >
          <option value="">{filter.label}</option>
          {filter.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
}
