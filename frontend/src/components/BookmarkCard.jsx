const getDomain = (url) => {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch (error) {
    return 'bookmark';
  }
};

const getFaviconUrl = (url) => {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
  } catch (error) {
    return 'https://www.google.com/s2/favicons?sz=64&domain=example.com';
  }
};

function BookmarkCard({ bookmark, onToggleFavourite, onEdit, onDelete }) {
  const domain = getDomain(bookmark.url);
  const faviconUrl = getFaviconUrl(bookmark.url);

  return (
    <article className="bookmark-card flex h-full flex-col rounded-[1.6rem] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={faviconUrl}
            alt={domain}
            className="h-11 w-11 rounded-2xl border border-slate-200 bg-[#f7f6f2] object-cover shadow-sm dark:border-slate-700 dark:bg-slate-800"
            loading="lazy"
          />
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold tracking-[-0.03em] text-slate-900 dark:text-slate-100">{bookmark.title}</h3>
            <p className="truncate text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{domain}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onToggleFavourite(bookmark._id)}
          aria-label={bookmark.favourite ? 'Remove from favourites' : 'Add to favourites'}
          className={[
            'rounded-full p-2.5 transition',
            bookmark.favourite
              ? 'bg-amber-100 text-amber-600 hover:bg-amber-200 dark:bg-amber-500/15 dark:text-amber-300'
              : 'bg-slate-100 text-slate-400 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700',
          ].join(' ')}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </button>
      </div>

      <div className="mt-3 min-h-[72px]">
        <a
          href={bookmark.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
        >
          {bookmark.url}
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M14 3h7v7" />
            <path d="M10 14L21 3" />
            <path d="M21 14v7H3V3h7" />
          </svg>
        </a>
      </div>

      {bookmark.description ? (
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{bookmark.description}</p>
      ) : (
        <div className="mt-3 h-[48px]" />
      )}

      <div className="mt-4 flex min-h-[32px] flex-wrap gap-2">
        {bookmark.tags && bookmark.tags.length > 0 ? (
          bookmark.tags.map((tag) => (
            <span
              key={`${bookmark._id}-${tag}`}
              className="rounded-full bg-[#f1f5f9] px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              #{tag}
            </span>
          ))
        ) : (
          <span className="text-xs text-slate-400 dark:text-slate-500">No tags</span>
        )}
      </div>

      <div className="mt-auto flex items-center justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={() => onEdit(bookmark)}
          className="rounded-xl border border-slate-300 bg-white p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          aria-label="Edit bookmark"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => onDelete(bookmark._id)}
          className="rounded-xl border border-red-200 bg-red-50 p-2 text-red-500 transition hover:bg-red-100 dark:border-red-500/40 dark:bg-red-500/10 dark:hover:bg-red-500/15"
          aria-label="Delete bookmark"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
          </svg>
        </button>
      </div>
    </article>
  );
}

export default BookmarkCard;
