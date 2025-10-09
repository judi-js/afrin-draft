import SideNav from '@/app/ui/dashboard/sidenav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <aside className="w-full flex-none md:w-64">
        <SideNav />
      </aside>
      <main className="grow p-6 overflow-y-auto md:p-12">
        {children}
      </main>
    </div>
  );
}
