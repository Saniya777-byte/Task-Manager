const FormInput = ({ label, error, ...props }) => (
  <label className="block">
    <span className="text-sm font-medium text-slate-700 dark:text-zinc-200">{label}</span>
    <input
      className="mt-2 w-full rounded border border-stone-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
      {...props}
    />
    {error && <span className="mt-1 block text-xs font-medium text-red-600">{error}</span>}
  </label>
);

export default FormInput;
