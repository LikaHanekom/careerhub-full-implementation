"use client";

import { useQueryStates, parseAsString } from "nuqs";
import { useEffect, useState } from "react";

const jobFiltersParsers = {
  q: parseAsString.withDefault(""),
  location: parseAsString.withDefault(""),
  status: parseAsString.withDefault("all"),
};

export default function JobFilters() {
  const [filters, setFilters] = useQueryStates(jobFiltersParsers, {
    shallow: false, // triggers server re-render
  });

  // Local state for debounced inputs
  const [keyword, setKeyword] = useState(filters.q);
  const [location, setLocation] = useState(filters.location);

  // Debounce keyword
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ q: keyword });
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  // Debounce location
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ location });
    }, 300);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div className="flex flex-wrap gap-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      {/* Keyword */}
      <div className="flex flex-1 flex-col gap-1 min-w-[180px]">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
          Keyword
        </label>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="e.g. engineer, designer…"
          className="rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        />
      </div>

      {/* Location */}
      <div className="flex flex-1 flex-col gap-1 min-w-[180px]">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
          Location
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Cape Town, Remote…"
          className="rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        />
      </div>

      {/* Status */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
          Status
        </label>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ status: e.target.value })}
          className="rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        >
          <option value="all">All</option>
          <option value="open">Open only</option>
        </select>
      </div>
    </div>
  );
}