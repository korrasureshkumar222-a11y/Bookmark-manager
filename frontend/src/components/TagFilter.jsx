function TagFilter({ tags, activeTag, onSelectTag }) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map((tag) => {
        const selected = activeTag === tag;

        return (
          <button
            key={tag}
            type="button"
            onClick={() => onSelectTag(tag)}
            className={[
              'rounded-full border px-3 py-1.5 text-xs font-medium transition',
              selected
                ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                : 'border-slate-200 bg-[#f7f6f2] text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800',
            ].join(' ')}
          >
            #{tag}
          </button>
        );
      })}
    </div>
  );
}

export default TagFilter;
