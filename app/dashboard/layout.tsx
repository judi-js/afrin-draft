import SideNav from '@/app/ui/dashboard/sidenav';
import ThemeToggle from '@/app/ui/kits/buttons';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="grow p-6 overflow-y-auto md:p-12 relative">
        <div className="absolute top-6 left-6">
          <ThemeToggle />
        </div>
        {children}
      </div>
    </div>
  );
}
