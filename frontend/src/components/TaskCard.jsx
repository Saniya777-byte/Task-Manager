import { CheckCircle2, Circle, Pencil, Trash2 } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, onToggle }) => (
  <article className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm transition hover:border-emerald-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-700">
    <div className="flex items-start justify-between gap-4">
      <button
        className="mt-0.5 rounded text-emerald-600 hover:text-emerald-700"
        type="button"
        onClick={() => onToggle(task)}
        aria-label="Toggle task status"
        title="Toggle status"
      >
        {task.status === 'Completed' ? <CheckCircle2 className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
      </button>
      <div className="min-w-0 flex-1">
        <h3 className={`break-words text-base font-bold text-slate-900 dark:text-zinc-50 ${task.status === 'Completed' ? 'line-through decoration-emerald-500/70' : ''}`}>
          {task.title}
        </h3>
        <p className="mt-2 min-h-10 break-words text-sm text-slate-600 dark:text-zinc-400">
          {task.description || 'No description added.'}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className={`rounded px-2.5 py-1 text-xs font-semibold ${task.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'}`}>
            {task.status}
          </span>
          <span className="text-xs text-slate-500 dark:text-zinc-500">
            {new Date(task.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 gap-1">
        <button className="rounded p-2 text-slate-500 hover:bg-stone-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100" type="button" onClick={() => onEdit(task)} aria-label="Edit task" title="Edit task">
          <Pencil className="h-4 w-4" />
        </button>
        <button className="rounded p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-red-950 dark:hover:text-red-300" type="button" onClick={() => onDelete(task._id)} aria-label="Delete task" title="Delete task">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  </article>
);

export default TaskCard;
