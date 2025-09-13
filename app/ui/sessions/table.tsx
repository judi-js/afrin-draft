import Image from 'next/image';
import { UpdateButton, DeleteButton } from '@/app/ui/kits/buttons';
import { fetchFilteredSessions } from '@/app/lib/data';
import { formatEstimatedTime } from '@/app/lib/utils';

export default async function SessionsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const sessions = await fetchFilteredSessions(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {sessions?.map((session) => {
              const date = new Date(session.check_in).toLocaleDateString(
                "ar-EG",
                { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' }
              );

              const checkInTime = new Date(session.check_in).toLocaleTimeString("ar-EG", {
                hour: '2-digit',
                minute: '2-digit',
              });

              const checkOutTime = session.check_out ? new Date(session.check_out).toLocaleTimeString("ar-EG", {
                hour: '2-digit',
                minute: '2-digit',
              }) : 'لم يتم تسجيل الخروج بعد';

              return (
                <div
                  key={session.id}
                  className="mb-2 w-full rounded-md bg-white p-4"
                >
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="mb-2 flex items-center">
                        <Image
                          src={"/user.png"}
                          className="ml-2 rounded-full"
                          width={28}
                          height={28}
                          alt={`${session.first_name}'s profile picture`}
                        />
                        <p>{session.first_name} {session.last_name}</p>
                      </div>
                      <p className="text-sm text-gray-500">{date}</p>
                    </div>
                    {formatEstimatedTime(+session.estimated_time)}
                  </div>
                  <div className="flex w-full items-center justify-between pt-4">
                    <div>
                      <p>
                        <Image src="/check-in.png" alt="Check In Icon" width={16} height={16} className="inline-block ml-1" />
                        {checkInTime}
                      </p>
                      <p>
                        <Image src="/check-out.png" alt="Check Out Icon" width={16} height={16} className="inline-block ml-1" />
                        {checkOutTime}
                      </p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <UpdateButton id={session.id} tableName="sessions" />
                      <DeleteButton id={session.id} tableName="sessions" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-right text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  اسم الطالب
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  التاريخ
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  وقت الدخول
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  وقت الخروج
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  الوقت المقدر
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {sessions?.map((session) => {
                const date = new Date(session.check_in).toLocaleDateString(
                  "ar-EG",
                  { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' }
                );

                const checkInTime = new Date(session.check_in).toLocaleTimeString("ar-EG", {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                const checkOutTime = session.check_out ? new Date(session.check_out).toLocaleTimeString("ar-EG", {
                  hour: '2-digit',
                  minute: '2-digit',
                }) : 'لم يتم تسجيل الخروج بعد';

                return (
                  <tr
                    key={session.id}
                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex items-center gap-3">
                        <Image
                          src={"/user.png"}
                          className="rounded-full"
                          width={28}
                          height={28}
                          alt={`${session.first_name}'s profile picture`}
                        />
                        <p>{session.first_name} {session.last_name}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {date}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {checkInTime}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {checkOutTime}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {formatEstimatedTime(+session.estimated_time)}
                    </td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        <UpdateButton id={session.id} tableName="sessions" />
                        <DeleteButton id={session.id} tableName="sessions" />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
