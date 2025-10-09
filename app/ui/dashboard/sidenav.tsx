import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import AfrinLogo from '@/app/ui/kits/afrin-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { signOut } from '@/auth';
import ThemeToggle from '@/app/ui/kits/buttons';

export default function SideNav() {
  return (
    <nav className="flex h-full flex-col px-3 py-4 md:px-2 bg-white dark:bg-gray-800">
      {/* Header with logo + theme toggle */}
      <div className="mb-2 flex h-20 items-center justify-between rounded-md bg-blue-600 p-4 md:h-40">
        <Link
          href="/dashboard"
          aria-label="العودة إلى الصفحة الرئيسية"
          className="flex items-center text-white"
        >
          <AfrinLogo />
        </Link>
        <ThemeToggle />
      </div>

      {/* Navigation links + logout */}
      <div className="flex grow flex-row justify-between space-x-2 space-x-reverse md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md dark:bg-transparent bg-gray-50 md:block"></div>
        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/' });
          }}
        >
          <button
            aria-label="تسجيل الخروج"
            className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md 
                       bg-gray-50 text-gray-800 hover:bg-sky-100 hover:text-blue-600 
                       dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <PowerIcon className="w-6" />
            <span className="hidden md:block">تسجيل الخروج</span>
          </button>
        </form>
      </div>
    </nav>
  );
}
