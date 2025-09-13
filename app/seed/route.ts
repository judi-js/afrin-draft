import bcrypt from 'bcryptjs';
import postgres from 'postgres';
import { invoices, customers, revenue, users } from '../lib/placeholder-data';
import { v4 as uuidv4 } from "uuid";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export const students = [
  {
    id: "5edd4ef2-0809-43ff-abe1-a60d8e3140c6",
    firstName: "لينا",
    lastName: "خالد",
    grade: "التاسع",
    department: "",
  },
  {
    id: "520c0268-8cb8-47c6-9ec0-6ac30626ff9c",
    firstName: "يزن",
    lastName: "فارس",
    grade: "الحادي عشر",
    department: "علمي",
  },
  {
    id: "4f43f6c2-30d1-4fc6-b25c-99af9ed12b28",
    firstName: "نور",
    lastName: "أمين",
    grade: "العاشر",
    department: "أدبي",
  },
  ...Array.from({ length: 27 }, (_, i) => ({
    id: uuidv4(),
    firstName: `طالب${i + 1}`,
    lastName: `اسم${i + 1}`,
    grade: `الصف ${i % 12 + 1}`,
    department: i % 2 === 0 ? "علمي" : "أدبي",
  })),
];

export const sessions = [
  {
    id: uuidv4(),
    studentId: students[0].id,
    checkInDate: new Date("2023-10-01T08:00:00Z"),
    checkOutDate: new Date("2023-10-01T09:00:00Z"),
    estimatedTime: 60, // in minutes
  },
  {
    id: uuidv4(),
    studentId: students[1].id,
    checkInDate: new Date("2023-10-02T10:00:00Z"),
    checkOutDate: new Date("2023-10-02T11:30:00Z"),
    estimatedTime: 90, // in minutes
  },
  {
    id: uuidv4(),
    studentId: students[2].id,
    checkInDate: new Date("2023-10-03T14:00:00Z"),
    checkOutDate: new Date("2023-10-03T15:00:00Z"),
    estimatedTime: 60, // in minutes
  },
  ...Array.from({ length: 27 }, (_, i) => ({
    id: uuidv4(),
    studentId: students[i % students.length].id,
    checkInDate: new Date(`2023-10-${(i % 30) + 4}T08:00:00Z`),
    checkOutDate: new Date(`2023-10-${(i % 30) + 4}T09:00:00Z`),
    estimatedTime: 60,
  })),
];

async function seedUsers() {

  // const insertedSessions = await Promise.all(
  //   sessions.map(async (session) => {
  //     return sql`
  //       INSERT INTO sessions (id, student_id, check_in, check_out, estimated_time)
  //       VALUES (${session.id}, ${session.studentId}, ${session.checkInDate}, ${session.checkOutDate}, ${session.estimatedTime})
  //       ON CONFLICT (id) DO NOTHING;
  //     `;
  //   }),
  // );

  // return insertedSessions;
  const insertedStudents = await Promise.all(
    students.map(async (student) => {
      return sql`
        INSERT INTO students (id, first_name, last_name, grade, department)
        VALUES (${student.id}, ${student.firstName}, ${student.lastName}, ${student.grade}, ${student.department})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedStudents;
}

export async function GET() {
  try {
    const result = await sql.begin((sql) => [
      seedUsers(),
    ]);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
