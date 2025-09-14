import CardWrapper from '@/app/ui/dashboard/cards';
// import RevenueChart from '@/app/ui/dashboard/students-chart';
// import LatestInvoices from '@/app/ui/dashboard/latest-students';
import { kufi } from '@/app/ui/fonts';
import { Suspense } from 'react';
import {
  // RevenueChartSkeleton,
  // LatestInvoicesSkeleton,
  CardsSkeleton,
} from '@/app/ui/kits/skeletons';
import { fetchStudents } from '@/app/lib/data';
import Checker from '@/app/ui/checker/checker';

export default async function Page() {
  const students = await fetchStudents();

  return (
    <main>
      <Checker students={students} />
      <br className="border-b-gray-200 w-full" />
      <h1 className={`${kufi.className} mb-4 text-xl md:text-2xl`}>
        لوحة البيانات
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      {/* <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div> */}
    </main>
  );
}
