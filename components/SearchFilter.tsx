"use client";

import { useRef, useState } from "react";
import { Search, X } from "lucide-react";

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
  const [searchValue, setSearchValue] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onSearch(value), 300);
  };

  const clearSearch = () => {
    setSearchValue("");
    onSearch("");
  };

  const handleFilter = (key: string, value: string) => {
    const updated = { ...activeFilters, [key]: value };
    if (!value) delete updated[key];
    setActiveFilters(updated);
    onFilterChange(updated);
  };

  const activeCount = Object.keys(activeFilters).length;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[280px]">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] transition-colors"
            style={{ color: searchValue ? "var(--color-primary-500)" : "var(--text-muted)" }}
          />
          <input
            type="text"
            placeholder="Search prescriptions..."
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="input pl-11 pr-10"
          />
          {searchValue && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {filters.map((filter) => (
          <select
            key={filter.key}
            onChange={(e) => handleFilter(filter.key, e.target.value)}
            className="select min-w-[160px]"
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

      {activeCount > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Active filters:
          </span>
          {Object.entries(activeFilters).map(([key, value]) => (
            <button
              key={key}
              onClick={() => handleFilter(key, "")}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors"
              style={{
                background: "var(--color-primary-50)",
                color: "var(--color-primary-600)",
              }}
            >
              {value}
              <X className="w-3 h-3" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
