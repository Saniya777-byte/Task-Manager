import { X } from 'lucide-react';
import { useState } from 'react';

const initialState = {
  title: '',
  description: '',
  status: 'Pending',
};

const TaskModal = ({ isOpen, task, onClose, onSubmit, loading }) => {
  const [form, setForm] = useState(() => (task ? {
    title: task.title || '',
    description: task.description || '',
    status: task.status || 'Pending',
  } : initialState));
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const nextErrors = {};
    if (form.title.trim().length < 2) nextErrors.title = 'Title must be at least 2 characters';
    if (form.description.length > 1000) nextErrors.description = 'Description cannot exceed 1000 characters';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
    });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 px-4 py-6">
      <div className="w-full max-w-lg rounded-lg border border-stone-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4 dark:border-zinc-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-50">{task ? 'Edit task' : 'Add task'}</h2>
          <button className="rounded p-2 text-slate-500 hover:bg-stone-100 dark:text-zinc-300 dark:hover:bg-zinc-800" type="button" onClick={onClose} aria-label="Close modal">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <form className="space-y-5 p-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-zinc-200">Title</span>
            <input
              className="mt-2 w-full rounded border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-zinc-700 dark:bg-zinc-950"
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="Prepare weekly review"
            />
            {errors.title && <span className="mt-1 block text-xs font-medium text-red-600">{errors.title}</span>}
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-zinc-200">Description</span>
            <textarea
              className="mt-2 min-h-28 w-full resize-y rounded border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-zinc-700 dark:bg-zinc-950"
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              placeholder="Add helpful details"
            />
            {errors.description && <span className="mt-1 block text-xs font-medium text-red-600">{errors.description}</span>}
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-zinc-200">Status</span>
            <select
              className="mt-2 w-full rounded border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-zinc-700 dark:bg-zinc-950"
              value={form.status}
              onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
            >
              <option>Pending</option>
              <option>Completed</option>
            </select>
          </label>
          <div className="flex justify-end gap-3">
            <button className="rounded border border-stone-300 px-4 py-2 text-sm font-semibold hover:bg-stone-100 dark:border-zinc-700 dark:hover:bg-zinc-800" type="button" onClick={onClose}>Cancel</button>
            <button className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
