"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  value?: string;
}

export function SearchBar({ placeholder = "Rechercher...", onSearch, value = "" }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
    onSearch("");
  };

  return (
    <div className="px-4 py-3 bg-white border-b border-gray-100">
      <div className="relative">
        <div
          className={`relative flex items-center bg-gray-50 rounded-2xl transition-all duration-200 ${
            isFocused
              ? "bg-white ring-2 ring-orange-500/20 shadow-md"
              : "hover:bg-gray-100"
          }`}
        >
          <Search className="absolute left-4 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="w-full pl-12 pr-12 py-3 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-sm"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Suggestions rapides (optionnel) */}
        {isFocused && searchQuery === "" && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-lg z-50">
            <div className="p-3">
              <p className="text-xs text-gray-500 mb-2">Recherches populaires:</p>
              <div className="flex flex-wrap gap-2">
                {["Burger", "Frites", "Coca", "Brownie"].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSearch(suggestion)}
                    className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-orange-100 hover:text-orange-700 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
