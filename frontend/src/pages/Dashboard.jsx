/* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from 'react';
import { LogOut, Moon, Plus, Search, Sun, UserCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { useDebounce } from '../hooks/useDebounce';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../services/api';
import { createTask, deleteTask, fetchTasks, updateTask, updateTaskStatus } from '../services/taskService';
import { getStoredTheme, setStoredTheme } from '../utils/storage';

const statusOptions = ['All', 'Pending', 'Completed'];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 8 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [theme, setTheme] = useState(() => getStoredTheme());
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    setStoredTheme(theme);
  }, [theme]);

  const loadTasks = async (page = pagination.page) => {
    try {
      setLoading(true);
      const { data } = await fetchTasks({
        page,
        limit: pagination.limit,
        search: debouncedSearch,
        status,
      });
      setTasks(data.tasks);
      setStats(data.stats);
      setPagination(data.pagination);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks(1);
  }, [debouncedSearch, status]);

  const completionRate = useMemo(() => (
    stats.total ? Math.round((stats.completed / stats.total) * 100) : 0
  ), [stats]);

  const openCreateModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSaveTask = async (payload) => {
    try {
      setSaving(true);
      if (editingTask) {
        await updateTask(editingTask._id, payload);
        toast.success('Task updated');
      } else {
        await createTask(payload);
        toast.success('Task added');
      }
      setModalOpen(false);
      setEditingTask(null);
      await loadTasks(editingTask ? pagination.page : 1);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      toast.success('Task deleted');
      await loadTasks(tasks.length === 1 && pagination.page > 1 ? pagination.page - 1 : pagination.page);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleToggleTask = async (task) => {
    const nextStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      await updateTaskStatus(task._id, nextStatus);
      await loadTasks(pagination.page);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <main className="min-h-screen bg-stone-50 text-slate-900 dark:bg-zinc-950 dark:text-zinc-50">
      <header className="border-b border-stone-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">TaskFlow</p>
            <h1 className="text-2xl font-bold">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="rounded border border-stone-300 p-2 hover:bg-stone-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
              type="button"
              onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <div className="relative group">
              <button className="flex items-center gap-2 rounded border border-stone-300 px-3 py-2 text-sm font-semibold hover:bg-stone-100 dark:border-zinc-700 dark:hover:bg-zinc-800" type="button">
                <UserCircle className="h-5 w-5" aria-hidden="true" />
                <span className="max-w-28 truncate sm:max-w-44">{user?.name}</span>
              </button>
              <div className="absolute right-0 top-11 z-20 hidden w-56 rounded border border-stone-200 bg-white p-2 shadow-lg group-hover:block dark:border-zinc-800 dark:bg-zinc-900">
                <div className="border-b border-stone-200 px-3 py-2 text-sm dark:border-zinc-800">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="truncate text-slate-500 dark:text-zinc-400">{user?.email}</p>
                </div>
                <button className="mt-2 flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950" type="button" onClick={logout}>
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ['Total Tasks', stats.total],
            ['Completed Tasks', stats.completed],
            ['Pending Tasks', stats.pending],
          ].map(([label, value]) => (
            <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900" key={label}>
              <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">{label}</p>
              <p className="mt-2 text-3xl font-bold">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-lg border border-stone-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold">Completion</span>
            <span className="text-slate-500 dark:text-zinc-400">{completionRate}%</span>
          </div>
          <div className="h-2 rounded bg-stone-200 dark:bg-zinc-800">
            <div className="h-2 rounded bg-emerald-600 transition-all" style={{ width: `${completionRate}%` }} />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold">Tasks</h2>
            <p className="text-sm text-slate-600 dark:text-zinc-400">Search, filter, edit, and keep momentum visible.</p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700" type="button" onClick={openCreateModal}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add task
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-3 md:flex-row">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              className="w-full rounded border border-stone-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-zinc-700 dark:bg-zinc-900"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title"
            />
          </label>
          <div className="flex rounded border border-stone-300 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-900">
            {statusOptions.map((option) => (
              <button
                className={`rounded px-3 py-2 text-sm font-semibold ${status === option ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-stone-100 dark:text-zinc-300 dark:hover:bg-zinc-800'}`}
                type="button"
                onClick={() => setStatus(option)}
                key={option}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div className="h-32 animate-pulse rounded-lg bg-stone-200 dark:bg-zinc-800" key={index} />
            ))
          ) : tasks.length ? (
            tasks.map((task) => (
              <TaskCard task={task} onEdit={openEditModal} onDelete={handleDeleteTask} onToggle={handleToggleTask} key={task._id} />
            ))
          ) : (
            <div className="rounded-lg border border-dashed border-stone-300 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
              <p className="text-lg font-bold">No tasks found</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400">Create a task or adjust your search and filters.</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-slate-600 dark:text-zinc-400">
            Page {pagination.page} of {pagination.pages} · {pagination.total} matching tasks
          </p>
          <div className="flex gap-2">
            <button className="rounded border border-stone-300 px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700" type="button" disabled={pagination.page <= 1 || loading} onClick={() => loadTasks(pagination.page - 1)}>
              Previous
            </button>
            <button className="rounded border border-stone-300 px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700" type="button" disabled={pagination.page >= pagination.pages || loading} onClick={() => loadTasks(pagination.page + 1)}>
              Next
            </button>
          </div>
        </div>
      </section>

      {modalOpen && (
        <TaskModal
          key={editingTask?._id || 'new-task'}
          isOpen={modalOpen}
          task={editingTask}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSaveTask}
          loading={saving}
        />
      )}
    </main>
  );
};

export default Dashboard;
