import Image from 'next/image';
import { Student } from '@/app/lib/definitions';
import { DeleteButton, DeleteButton2, GenerateButton, GenerateButton2, UpdateButton, UpdateButton2 } from '@/app/ui/kits/buttons';
import { fetchFilteredStudents } from '@/app/lib/data';

export default async function StudentsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const students = await fetchFilteredStudents(query, currentPage);

  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {students?.map((student) => (
                  <div
                    key={student.id}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <div className="flex items-center gap-3">
                            <Image
                              src={"/user.png"}
                              className="rounded-full"
                              alt={`${student.first_name}'s profile picture`}
                              width={28}
                              height={28}
                            />
                            <p>{student.first_name} {student.last_name}</p>
                          </div>
                        </div>
                        <div className="flex justify-start gap-3">
                          <DeleteButton2 id={student.id} tableName="students" />
                          <UpdateButton2 id={student.id} tableName="students" />
                        </div>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between border-b py-5">
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">الصف</p>
                        <p className="font-medium">{student.grade}</p>
                      </div>
                      {student.department ? (<div className="flex w-1/2 flex-col">
                        <p className="text-xs">الفرع</p>
                        <p className="font-medium">{student.department}</p>
                      </div>) : null}
                    </div>
                    <GenerateButton student={student} students={students} />
                  </div>
                ))}
              </div>
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-right text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      الاسم
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      الصف
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      الفرع
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      <span className="sr-only">توليد</span>
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      <span className="sr-only">تعديل</span>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {students.map((student) => (
                    <tr key={student.id} className="group">
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <Image
                            src={"/user.png"}
                            className="rounded-full"
                            alt={`${student.first_name}'s profile picture`}
                            width={28}
                            height={28}
                          />
                          <p>{student.first_name} {student.last_name}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {student.grade}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {student.department || "-"}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-xs">
                        <GenerateButton2 student={student} students={students} />
                      </td>
                      <td className="whitespace-nowrap py-3 pl-6 pr-3 bg-white">
                        <div className="flex justify-end gap-3">
                          <UpdateButton id={student.id} tableName="students" />
                          <DeleteButton id={student.id} tableName="students" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
