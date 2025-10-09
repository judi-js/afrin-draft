'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
  { name: 'الصفحة الرئيسية', href: '/dashboard', icon: HomeIcon },
  { name: 'تسجيل دخول/خروج الطلاب', href: '/dashboard/register', icon: PencilIcon },
  { name: 'الجلسات', href: '/dashboard/sessions', icon: DocumentDuplicateIcon },
  { name: 'الطلاب', href: '/dashboard/students', icon: UserGroupIcon },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.name}
            href={link.href}
            aria-current={isActive ? 'page' : undefined}
            className={clsx(
              `flex h-[48px] grow items-center justify-center gap-2 rounded-md 
               bg-gray-50 text-gray-800 hover:bg-sky-100 hover:text-blue-600 
               dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 
               md:flex-none md:justify-start md:p-2 md:px-3`,
              { 'bg-sky-100 text-blue-600 dark:bg-gray-600 dark:text-blue-400': isActive }
            )}
          >
            <LinkIcon className="w-6" />
            <span className="hidden md:block">{link.name}</span>
          </Link>
        );
      })}
    </>
  );
}
