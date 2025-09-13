import Pagination from '@/app/ui/kits/pagination';
import Search from '@/app/ui/kits/search';
import Table from '@/app/ui/sessions/table';
import { CreateButton } from '@/app/ui/kits/buttons';
import { kufi } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/kits/skeletons';
import { Suspense } from 'react';
import { fetchSessionsPages } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sessions',
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = await fetchSessionsPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${kufi.className} text-2xl`}>الجلسات</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="ابحث حسب الاسم، الصف، أو الفرع..." />
        <CreateButton entity="sessions" />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
