import { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import BookmarkCard from '../components/BookmarkCard';
import BookmarkFormModal from '../components/BookmarkFormModal';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import Sidebar from '../components/Sidebar';
import TagFilter from '../components/TagFilter';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const initialPagination = {
  data: [],
  page: 1,
  totalPages: 1,
  total: 0,
};

const initialViewState = { view: 'all', value: '' };

function Dashboard() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const searchInputRef = useRef(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [pagination, setPagination] = useState(initialPagination);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [folders, setFolders] = useState([]);
  const [folderError, setFolderError] = useState('');
  const [folderLoading, setFolderLoading] = useState(true);
  const [viewState, setViewState] = useState(initialViewState);

  const tags = useMemo(
    () =>
      [...new Set(bookmarks.flatMap((bookmark) => bookmark.tags || []))].sort((a, b) =>
        a.localeCompare(b)
      ),
    [bookmarks]
  );

  const fetchFolders = async () => {
    try {
      setFolderLoading(true);
      setFolderError('');
      const response = await api.get('/api/folders', { params: { page: 1, limit: 100 } });
      const data = response.data?.data || [];
      setFolders(data);
    } catch (error) {
      setFolders([]);
      const message = error?.response?.data?.message || 'Unable to load folders.';
      setFolderError(message);
      toast.error(message);
    } finally {
      setFolderLoading(false);
    }
  };

  const fetchBookmarks = async (nextPage = page, currentView = viewState) => {
    try {
      setLoading(true);
      setFetchError('');

      let response;
      const params = { page: nextPage, limit: 9 };

      switch (currentView.view) {
        case 'favourites':
          response = await api.get('/api/bookmarks/favourites', { params });
          break;
        case 'recent':
          response = await api.get('/api/bookmarks/recent', { params: { limit: 9 } });
          response.data = {
            data: response.data?.data || [],
            page: 1,
            totalPages: 1,
            total: response.data?.data?.length || 0,
          };
          break;
        case 'folder':
          response = await api.get(`/api/folders/${currentView.value}/bookmarks`, { params });
          break;
        case 'tag':
          response = await api.get(`/api/bookmarks/tag/${encodeURIComponent(currentView.value)}`, {
            params,
          });
          break;
        case 'search':
          response = await api.get('/api/bookmarks/search', {
            params: { ...params, q: currentView.value },
          });
          break;
        default:
          response = await api.get('/api/bookmarks', { params });
          break;
      }

      const payload = response.data || initialPagination;
      setBookmarks(payload.data || []);
      setPagination({
        data: payload.data || [],
        page: payload.page || 1,
        totalPages: payload.totalPages || 1,
        total: payload.total || 0,
      });
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to load bookmarks.';
      setBookmarks([]);
      setPagination(initialPagination);
      setFetchError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  useEffect(() => {
    fetchBookmarks(page, viewState);
  }, [page, viewState]);

  useEffect(() => {
    const handleKeydown = (event) => {
      const tagName = document.activeElement?.tagName;
      const isTypingTarget = tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT';

      if (event.key === '/' && !isTypingTarget) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  const refreshAfterMutation = async () => {
    await fetchFolders();
    await fetchBookmarks(page, viewState);
  };

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
  };

  const openCreateModal = () => {
    setEditingBookmark(null);
    setModalOpen(true);
  };

  const openEditModal = (bookmark) => {
    setEditingBookmark(bookmark);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingBookmark(null);
  };

  const handleSubmitBookmark = async (payload) => {
    try {
      if (editingBookmark) {
        await api.put(`/api/bookmarks/${editingBookmark._id}`, payload);
        toast.success('Bookmark updated successfully.');
      } else {
        await api.post('/api/bookmarks', payload);
        toast.success('Bookmark created successfully.');
      }

      closeModal();
      await refreshAfterMutation();
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to save bookmark.';
      toast.error(message);
      throw error;
    }
  };

  const handleToggleFavourite = async (bookmarkId) => {
    try {
      const response = await api.patch(`/api/bookmarks/${bookmarkId}/favourite`);
      const updatedBookmark = response.data.bookmark;

      setBookmarks((current) =>
        current.map((bookmark) =>
          bookmark._id === bookmarkId ? { ...bookmark, favourite: updatedBookmark.favourite } : bookmark
        )
      );

      toast.success(updatedBookmark.favourite ? 'Added to favourites.' : 'Removed from favourites.');
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to update favourite state.';
      toast.error(message);
    }
  };

  const handleDeleteBookmark = async (bookmarkId) => {
    const confirmed = window.confirm('Are you sure you want to delete this bookmark?');
    if (!confirmed) return;

    try {
      await api.delete(`/api/bookmarks/${bookmarkId}`);
      toast.success('Bookmark deleted successfully.');
      await refreshAfterMutation();
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to delete bookmark.';
      toast.error(message);
    }
  };

  const handleCreateFolder = async (name) => {
    try {
      await api.post('/api/folders', { name });
      toast.success('Folder created successfully.');
      await fetchFolders();
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to create folder';
      toast.error(message);
    }
  };

  const handleRenameFolder = async (folderId, name) => {
    try {
      await api.put(`/api/folders/${folderId}`, { name });
      toast.success('Folder renamed successfully.');
      await fetchFolders();
      if (viewState.view === 'folder' && viewState.value === folderId) {
        await fetchBookmarks(page, viewState);
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to rename folder';
      toast.error(message);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    const confirmed = window.confirm('Delete this folder and unassign its bookmarks?');
    if (!confirmed) return;

    try {
      await api.delete(`/api/folders/${folderId}`);
      toast.success('Folder deleted successfully.');
      await fetchFolders();
      if (viewState.view === 'folder' && viewState.value === folderId) {
        setViewState(initialViewState);
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to delete folder';
      toast.error(message);
    }
  };

  const handleSelectView = (view, value = '') => {
    setViewState({ view, value });
    setPage(1);
  };

  const handleSearch = (query) => {
    if (!query) {
      setViewState(initialViewState);
      setPage(1);
      return;
    }

    setViewState({ view: 'search', value: query });
    setPage(1);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-shell min-h-screen bg-[#f5f4ef] p-4 sm:p-6 dark:bg-transparent">
      <div className="mx-auto max-w-7xl">
        <header className="dashboard-header glass-panel mb-6 flex flex-col gap-4 rounded-[1.75rem] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="icon-pill flex h-12 w-12 rounded-2xl text-lg font-bold text-white shadow-lg shadow-indigo-200/50">
              B
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-slate-500">Dashboard</p>
              <h1 className="mt-1 text-3xl font-black tracking-[-0.05em] text-slate-900">Welcome, {user?.name || 'there'}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="icon-pill rounded-full px-3 py-2 text-sm font-medium transition hover:scale-[1.02] dark:text-slate-100"
            >
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>

            <button
              type="button"
              onClick={openCreateModal}
              className="rounded-full bg-gradient-to-r from-[#7c8cff] via-[#8ea9ff] to-[#b58af7] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(124,140,255,0.32)] transition hover:brightness-110"
            >
              + Add Bookmark
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="flex flex-col gap-6 md:flex-row">
          <Sidebar
            folders={folders}
            activeView={viewState.view}
            activeValue={viewState.value}
            onSelectAll={() => handleSelectView('all')}
            onSelectFavourites={() => handleSelectView('favourites')}
            onSelectRecent={() => handleSelectView('recent')}
            onSelectFolder={(folderId, folderName) => handleSelectView('folder', folderId)}
            onCreateFolder={handleCreateFolder}
            onRenameFolder={handleRenameFolder}
            onDeleteFolder={handleDeleteFolder}
            loading={folderLoading}
            error={folderError}
            onRetry={fetchFolders}
          />

          <main className="dashboard-main glass-panel flex-1 rounded-[1.75rem] p-4 sm:p-6">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  {viewState.view === 'all' && 'All Bookmarks'}
                  {viewState.view === 'favourites' && 'Favourites'}
                  {viewState.view === 'recent' && 'Recently Added'}
                  {viewState.view === 'folder' &&
                    `Folder: ${folders.find((folder) => folder._id === viewState.value)?.name || 'Selected folder'}`}
                  {viewState.view === 'tag' && `Tag: #${viewState.value}`}
                  {viewState.view === 'search' && `Search: ${viewState.value}`}
                </h2>
              </div>

              <SearchBar
                value={viewState.view === 'search' ? viewState.value : ''}
                onSearch={handleSearch}
                inputRef={searchInputRef}
              />
            </div>

            {tags.length > 0 && (
              <div className="mb-5">
                <TagFilter
                  tags={tags}
                  activeTag={viewState.view === 'tag' ? viewState.value : ''}
                  onSelectTag={(tag) => {
                    if (viewState.view === 'tag' && viewState.value === tag) {
                      handleSelectView('all');
                      return;
                    }
                    handleSelectView('tag', tag);
                  }}
                />
              </div>
            )}

            {fetchError ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
                <h3 className="text-lg font-semibold">Unable to load bookmarks</h3>
                <p className="mt-2 text-sm">{fetchError}</p>
                <button
                  type="button"
                  onClick={() => fetchBookmarks(page, viewState)}
                  className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
                >
                  Retry
                </button>
              </div>
            ) : loading ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse rounded-2xl border border-slate-200 bg-slate-100 p-4 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
                        <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
                      </div>
                    </div>
                    <div className="mt-5 space-y-2">
                      <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-700" />
                      <div className="h-3 w-5/6 rounded bg-slate-200 dark:bg-slate-700" />
                      <div className="h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
                    </div>
                    <div className="mt-5 flex gap-2">
                      <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
                      <div className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-700" />
                    </div>
                  </div>
                ))}
              </div>
            ) : bookmarks.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-950/70">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
                  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M8 12h8M12 8v8" />
                    <path d="M5 19V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14l-7-3-7 3z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">No bookmarks found</h2>
                <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
                  Try another filter or add a bookmark to get started.
                </p>
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="mt-6 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
                >
                  Add bookmark
                </button>
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {bookmarks.map((bookmark) => (
                    <BookmarkCard
                      key={bookmark._id}
                      bookmark={bookmark}
                      onToggleFavourite={handleToggleFavourite}
                      onEdit={openEditModal}
                      onDelete={handleDeleteBookmark}
                    />
                  ))}
                </div>

                <Pagination
                  page={pagination.page || 1}
                  totalPages={pagination.totalPages || 1}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </main>
        </div>
      </div>

      <BookmarkFormModal
        visible={modalOpen}
        mode={editingBookmark ? 'edit' : 'create'}
        bookmark={editingBookmark}
        onClose={closeModal}
        onSubmit={handleSubmitBookmark}
      />
    </div>
  );
}

export default Dashboard;
