import { fetchStudents } from '@/app/lib/data';
import Form from '@/app/ui/students/create-form';
import Breadcrumbs from '@/app/ui/kits/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Student',
};

export default function Page() {

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'الطلاب', href: '/dashboard/students' },
          {
            label: 'إضافة طالب',
            href: '/dashboard/students/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
