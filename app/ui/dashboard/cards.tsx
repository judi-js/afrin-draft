import {
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import { fetchCardData } from '@/app/lib/data';

const iconMap = {
  students: UserGroupIcon,
  sessions: InboxIcon,
  grades: InboxIcon,
};

export default async function CardWrapper() {
  const {
    numberOfSessions,
    numberOfStudents,
    numberOfGrades,
    averageSessionsPerStudent,
  } = await fetchCardData();

  return (
    <>
      <Card
        title="عدد الطلاب"
        value={numberOfStudents}
        type="students"
      />
      <Card title="عدد الجلسات" value={numberOfSessions} type="sessions" />
      <Card
        title="عدد الجلسات (وسطياً)"
        value={averageSessionsPerStudent}
        type="grades"
      />
      <Card
        title="عدد الصفوف"
        value={numberOfGrades}
        type="grades"
      />
    </>
  );
}

export function Card({ title, value, type }: {
  title: string;
  value: number | string;
  type: 'sessions' | 'students' | 'grades';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700 dark:text-gray-300" /> : null}
        <h3 className="mr-2 text-sm font-medium text-gray-800 dark:text-gray-200">{title}</h3>
      </div>
      <p className="truncate rounded-xl bg-white dark:bg-gray-700 px-4 py-8 text-center text-2xl text-gray-900 dark:text-gray-100">
        {value}
      </p>
    </div>
  );
}
