import { useEffect, useState } from 'react';
import api from '../services/api';

const emptyForm = {
  title: '',
  url: '',
  description: '',
  tags: '',
  folder: '',
};

function BookmarkFormModal({ visible, mode = 'create', bookmark = null, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm);
  const [folders, setFolders] = useState([]);
  const [loadingFolders, setLoadingFolders] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!visible) {
      return;
    }

    const fetchFolders = async () => {
      try {
        setLoadingFolders(true);
        const response = await api.get('/api/folders?limit=100');
        const fetchedFolders = response.data?.data || [];
        setFolders(fetchedFolders);
      } catch (err) {
        setFolders([]);
      } finally {
        setLoadingFolders(false);
      }
    };

    fetchFolders();
  }, [visible]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    if (bookmark) {
      setForm({
        title: bookmark.title || '',
        url: bookmark.url || '',
        description: bookmark.description || '',
        tags: bookmark.tags ? bookmark.tags.join(', ') : '',
        folder: bookmark.folder?._id || bookmark.folder || '',
      });
      return;
    }

    setForm(emptyForm);
  }, [bookmark, visible]);

  if (!visible) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedTitle = form.title.trim();
    const trimmedUrl = form.url.trim();

    if (!trimmedTitle) {
      setError('Title is required.');
      return;
    }

    if (!trimmedUrl) {
      setError('URL is required.');
      return;
    }

    try {
      new URL(trimmedUrl);
    } catch (error) {
      setError('Please enter a valid URL.');
      return;
    }

    const payload = {
      title: trimmedTitle,
      url: trimmedUrl,
      description: form.description.trim(),
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      folder: form.folder || null,
    };

    try {
      setSubmitting(true);
      setError('');
      await onSubmit(payload);
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.18)] dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-slate-500">
              {mode === 'edit' ? 'Edit' : 'Add'} bookmark
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.05em] text-slate-900 dark:text-slate-100">
              {mode === 'edit' ? 'Update bookmark' : 'Create bookmark'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 bg-slate-50 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            aria-label="Close modal"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:bg-slate-950"
              placeholder="Example: React Guide"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">URL</label>
            <input
              type="url"
              name="url"
              value={form.url}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:bg-slate-950"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:bg-slate-950"
              placeholder="Add a note about this bookmark"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Tags</label>
            <input
              type="text"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:bg-slate-950"
              placeholder="javascript, react, productivity"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Folder</label>
            <select
              name="folder"
              value={form.folder}
              onChange={handleChange}
              disabled={loadingFolders}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-indigo-500 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:bg-slate-950"
            >
              <option value="">No folder</option>
              {folders.map((folder) => (
                <option key={folder._id} value={folder._id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? 'Saving...' : mode === 'edit' ? 'Save changes' : 'Create bookmark'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookmarkFormModal;
