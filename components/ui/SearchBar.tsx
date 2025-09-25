"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  value?: string;
}

export function SearchBar({
  placeholder = "Rechercher...",
  onSearch,
  value = "",
}: SearchBarProps) {
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
              ? "bg-white ring-2 ring-orange-500/20 shadow-md scale-[1.02]"
              : "hover:bg-gray-100 active:bg-white"
          }`}
        >
          <Search
            className={`absolute left-4 w-5 h-5 transition-all duration-200 ${
              isFocused ? "text-orange-500 scale-110" : "text-gray-400"
            }`}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="w-full pl-12 pr-12 py-4 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-sm touch-manipulation"
            style={{ minHeight: "48px" }}
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-4 p-2 text-gray-400 hover:text-gray-600 active:text-gray-800 hover:bg-gray-100 active:bg-gray-200 rounded-full transition-all duration-150 touch-manipulation"
            >
              <X className="w-4 h-4 transition-transform duration-150 hover:scale-110 active:scale-95" />
            </button>
          )}
        </div>

        {/* Suggestions rapides (optionnel) */}
        {isFocused && searchQuery === "" && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-lg z-50 animate-in slide-in-from-top-2 duration-200">
            <div className="p-4">
              <p className="text-xs text-gray-500 mb-3 font-medium">
                Recherches populaires:
              </p>
              <div className="flex flex-wrap gap-2">
                {["Burger", "Frites", "Coca", "Brownie"].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSearch(suggestion)}
                    className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-orange-100 hover:text-orange-700 active:bg-orange-200 transition-all duration-150 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 touch-manipulation min-h-[40px]"
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
