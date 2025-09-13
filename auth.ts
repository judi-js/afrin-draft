import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
// import bcrypt from 'bcryptjs';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

type Admin = {
  id: string;
  // Add other admin-specific properties if needed
};

type Student = {
  id: string;
  // Add other student-specific properties if needed
};

type User = Admin | Student | null;

async function getUserById(id: string): Promise<User> {
  try {
    const [admin] = await sql<Admin[]>`SELECT * FROM admins WHERE id=${id} LIMIT 1`;
    if (admin) return admin;
    const [student] = await sql<Student[]>`SELECT * FROM students WHERE id=${id} LIMIT 1`;
    if (student) return student;
    return null;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
}

async function getRoleById(id: string): Promise<'admin' | 'student' | null> {
  try {
    const [admin] = await sql<{ id: string }[]>`SELECT id FROM admins WHERE id=${id} LIMIT 1`;
    if (admin) return 'admin';
  } catch (error) {
    try {
      const [student] = await sql<{ id: string }[]>`SELECT id FROM students WHERE id=${id} LIMIT 1`;
      if (student) return 'student';
    } catch (error) {
      console.error('Error fetching student role by ID:', error);
    }
  }

  try {
    const [student] = await sql<{ id: string }[]>`SELECT id FROM students WHERE id=${id} LIMIT 1`;
    if (student) return 'student';
  } catch (error) {
    console.error('Error fetching student role by ID:', error);
  }

  return null;
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = z
          .object({ id: z.string().min(1) })
          .safeParse(credentials);
        // const parsed = z
        //   .object({ id: z.string().min(1), password: z.string().min(6) })
        //   .safeParse(credentials);

        if (!parsed.success) return null;

        const { id } = parsed.data;
        // const { id, password } = parsed.data;
        const user = await getUserById(id);
        if (!user) return null;

        const role = await getRoleById(id);
        if (!role) return null;

        return { id: user.id, role } as any;
      },
    }),
  ],
});
