import { CheckCircle2 } from 'lucide-react';
import authImage from '../assets/auth-image.png';

const AuthLayout = ({ title, subtitle, children }) => (
  <main className="min-h-screen bg-stone-50 text-slate-900 dark:bg-zinc-950 dark:text-zinc-50">
    <div className="mx-auto grid min-h-screen w-full max-w-6xl lg:h-screen lg:grid-cols-[0.95fr_1.05fr] lg:overflow-hidden">
      <section className="hidden border-r border-stone-200 bg-white px-10 py-8 dark:border-zinc-800 dark:bg-zinc-900 lg:flex lg:flex-col lg:justify-center lg:gap-7">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded bg-emerald-600 text-white">
              <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">TaskFlow</p>
              <h1 className="text-2xl font-bold">Work stays visible.</h1>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg border border-stone-200 bg-stone-100 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <img
            src={authImage}
            alt="TaskFlow workspace preview"
            className="h-52 w-full object-cover xl:h-64"
          />
        </div>
        <div className="space-y-5">
          <h2 className="max-w-md text-3xl font-bold leading-tight xl:text-4xl">A focused task workspace for daily execution.</h2>
          <div className="grid gap-3 text-sm text-slate-600 dark:text-zinc-300">
            {['Private task boards per user', 'Fast search, status filters, and pagination', 'Protected APIs with JWT authentication'].map((item) => (
              <div className="flex items-center gap-3" key={item}>
                <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">TaskFlow</p>
            <h1 className="text-2xl font-bold">Work stays visible.</h1>
          </div>
          <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
            <div className="mb-7">
              <h2 className="text-2xl font-bold">{title}</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </section>
    </div>
  </main>
);

export default AuthLayout;
