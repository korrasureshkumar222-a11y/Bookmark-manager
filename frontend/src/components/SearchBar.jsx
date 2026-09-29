import { useEffect, useState } from 'react';

function SearchBar({ value, onSearch, inputRef }) {
  const [query, setQuery] = useState(value || '');

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div className="relative w-full max-w-md">
      <svg
        viewBox="0 0 24 24"
        className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="6" />
        <path d="M16 16L21 21" />
      </svg>

      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search bookmarks..."
        className="w-full rounded-2xl border border-slate-200 bg-[#f8f7f3] py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:bg-slate-950"
      />
    </div>
  );
}

export default SearchBar;
