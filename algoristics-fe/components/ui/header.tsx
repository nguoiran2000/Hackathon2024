import { useEffect, useState } from 'react';
import Link from "next/link";
import Logo from "./logo";

export default function Header() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setEmail(localStorage.getItem('email'));
    }
  }, []);
  return (
    <header className="fixed top-2 z-30 w-full md:top-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex h-14 items-center justify-between gap-3 rounded-2xl bg-white/90 px-3 shadow-lg shadow-black/[0.03] backdrop-blur-sm before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(theme(colors.gray.100),theme(colors.gray.200))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]">
          {/* Site branding */}
          <div className="flex flex-1 items-center gap-4">
            <Logo /><b>Algoristics Team (FHN)</b>
          </div>

          {/* Desktop sign in links */}
          <ul className="flex flex-1 items-center justify-end gap-3">
          {email && (<><li>
              <Link
                href="/dashboard"
                className="btn-sm bg-white text-gray-800 shadow hover:bg-gray-50"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/project"
                className="btn-sm bg-white text-gray-800 shadow hover:bg-gray-50"
              >
                Project
              </Link>
            </li>
            <li>
              <Link
                href="/employee"
                className="btn-sm bg-white text-gray-800 shadow hover:bg-gray-50"
              >
                Employee
              </Link>
            </li></>
          )}
            {email && (<li>
              <Link
                href="/signout"
                className="btn-sm bg-gray-800 text-gray-200 shadow hover:bg-gray-900"
              >
                Logout
              </Link>
            </li>)}
            {!email && (<><li>
              <Link
                href="/signin"
                className="btn-sm bg-white text-gray-800 shadow hover:bg-gray-50"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                href="/signup"
                className="btn-sm bg-gray-800 text-gray-200 shadow hover:bg-gray-900"
              >
                Register
              </Link>
            </li></>)}
          </ul>
        </div>
      </div>
    </header>
  );
}
