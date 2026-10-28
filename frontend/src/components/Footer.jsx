import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';

export default function Footer() {
  return (
    <footer className="relative z-10 mt-10 border-t border-fg/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-5 py-8 text-sm text-fg/55 sm:flex-row sm:px-6">
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <Logo />
          <p>Generate exceptional content with AI in seconds.</p>
        </div>
        <nav className="flex items-center gap-5">
          <Link to="/app" className="transition-colors hover:text-fg">Workspace</Link>
          <Link to="/history" className="transition-colors hover:text-fg">History</Link>
        </nav>
        <p className="text-center text-xs sm:text-right">
          &copy; {new Date().getFullYear()} GenWrite AI <br className="sm:hidden" />
          Built with React, Flask &amp; NVIDIA NIM
        </p>
      </div>
    </footer>
  );
}
