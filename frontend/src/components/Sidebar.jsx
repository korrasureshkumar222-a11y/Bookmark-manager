import { useState } from 'react';

function Sidebar({
  folders,
  activeView,
  activeValue,
  onSelectAll,
  onSelectFavourites,
  onSelectRecent,
  onSelectFolder,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  loading,
  error,
  onRetry,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const handleCreateFolder = (event) => {
    event.preventDefault();
    const trimmed = newFolderName.trim();
    if (!trimmed) return;
    onCreateFolder(trimmed);
    setNewFolderName('');
  };

  const handleRenameSave = (folderId) => {
    const trimmed = editingName.trim();
    if (!trimmed) return;
    onRenameFolder(folderId, trimmed);
    setEditingFolderId(null);
    setEditingName('');
  };

  return (
    <>
      <button
        type="button"
        className="mb-4 inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 md:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        onClick={() => setMobileOpen((current) => !current)}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
        Menu
      </button>

      <aside
        className={[
          'glass-panel w-full rounded-[1.75rem] p-4 md:max-w-xs',
          mobileOpen ? 'block' : 'hidden md:block',
        ].join(' ')}
      >
        {error ? (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
            <p>{error}</p>
            <button type="button" onClick={onRetry} className="mt-2 font-medium underline">
              Retry
            </button>
          </div>
        ) : null}

        <div className="space-y-2">
          <button
            type="button"
            onClick={onSelectAll}
            className={[
              'flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium transition',
              activeView === 'all'
                ? 'bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 shadow-sm dark:from-indigo-500/20 dark:to-violet-500/10 dark:text-indigo-200'
                : 'text-slate-700 hover:bg-white/60 dark:text-slate-200 dark:hover:bg-slate-800/70',
            ].join(' ')}
          >
            <span className="inline-flex items-center gap-2">
              <span className="icon-pill h-7 w-7 rounded-lg text-[10px]">★</span>
              All Bookmarks
            </span>
          </button>

          <button
            type="button"
            onClick={onSelectFavourites}
            className={[
              'flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium transition',
              activeView === 'favourites'
                ? 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 shadow-sm dark:from-amber-500/20 dark:to-orange-500/10 dark:text-amber-200'
                : 'text-slate-700 hover:bg-white/60 dark:text-slate-200 dark:hover:bg-slate-800/70',
            ].join(' ')}
          >
            <span className="inline-flex items-center gap-2">
              <span className="icon-pill h-7 w-7 rounded-lg text-[10px]">★</span>
              Favourites
            </span>
          </button>

          <button
            type="button"
            onClick={onSelectRecent}
            className={[
              'flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium transition',
              activeView === 'recent'
                ? 'bg-gradient-to-r from-sky-50 to-cyan-50 text-sky-700 shadow-sm dark:from-sky-500/20 dark:to-cyan-500/10 dark:text-sky-200'
                : 'text-slate-700 hover:bg-white/60 dark:text-slate-200 dark:hover:bg-slate-800/70',
            ].join(' ')}
          >
            <span className="inline-flex items-center gap-2">
              <span className="icon-pill h-7 w-7 rounded-lg text-[10px]">⏱</span>
              Recently Added
            </span>
          </button>
        </div>

        <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-700">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Folders</h2>

          <form onSubmit={handleCreateFolder} className="mt-3 flex gap-2">
            <input
              type="text"
              value={newFolderName}
              onChange={(event) => setNewFolderName(event.target.value)}
              placeholder="New folder"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:bg-slate-950"
            />
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-3 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-200/50 transition hover:brightness-110"
            >
              +
            </button>
          </form>

          <div className="mt-4 space-y-2">
            {loading ? (
              <div className="space-y-2">
                <div className="h-10 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
                <div className="h-10 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
              </div>
            ) : folders.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">No folders yet.</p>
            ) : (
              folders.map((folder) => {
                const isActive = activeView === 'folder' && activeValue === folder._id;

                return (
                  <div
                    key={folder._id}
                    className={[
                      'flex items-center justify-between gap-2 rounded-xl px-2.5 py-2 transition',
                      isActive ? 'bg-indigo-50 dark:bg-indigo-500/15' : 'hover:bg-slate-100 dark:hover:bg-slate-800',
                    ].join(' ')}
                  >
                    {editingFolderId === folder._id ? (
                      <div className="flex w-full items-center gap-2">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(event) => setEditingName(event.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                        />
                        <button type="button" onClick={() => handleRenameSave(folder._id)} className="text-xs font-medium text-indigo-600 dark:text-indigo-300">
                          Save
                        </button>
                        <button type="button" onClick={() => setEditingFolderId(null)} className="text-xs text-slate-500 dark:text-slate-400">
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onSelectFolder(folder._id, folder.name)}
                        className="flex flex-1 items-center justify-between gap-2 text-left"
                      >
                        <span className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">{folder.name}</span>
                        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                          {folder.bookmarkCount ?? 0}
                        </span>
                      </button>
                    )}

                    {editingFolderId !== folder._id ? (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingFolderId(folder._id);
                            setEditingName(folder.name);
                          }}
                          className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
                          aria-label={`Rename ${folder.name}`}
                        >
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                          </svg>
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteFolder(folder._id)}
                          className="rounded-lg p-1.5 text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                          aria-label={`Delete ${folder.name}`}
                        >
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                            <path d="M3 6h18" />
                            <path d="M8 6V4h8v2" />
                            <path d="M19 6l-1 14H6L5 6" />
                            <path d="M10 11v6M14 11v6" />
                          </svg>
                        </button>
                      </div>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
