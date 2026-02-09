export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} ADchaser. All rights reserved.
        </p>
        <nav className="flex gap-6 text-sm text-slate-500">
          <a href="#" className="transition hover:text-white">
            Privacy
          </a>
          <a href="#" className="transition hover:text-white">
            Terms
          </a>
        </nav>
      </div>
    </footer>
  );
}
