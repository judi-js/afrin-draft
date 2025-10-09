import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

type User = { id: string; role: 'admin' | 'student' };

async function getUserById(id: string): Promise<User | null> {
  try {
    const [admin] = await sql<{ id: string }[]>`SELECT id FROM admins WHERE id=${id} LIMIT 1`;
    if (admin) return { id: admin.id, role: 'admin' };

    const [student] = await sql<{ id: string }[]>`SELECT id FROM students WHERE id=${id} LIMIT 1`;
    if (student) return { id: student.id, role: 'student' };

    return null;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = z.object({ id: z.string().min(1) }).safeParse(credentials);
        if (!parsed.success) return null;

        const { id } = parsed.data;
        const user = await getUserById(id);
        return user;
      },
    }),
  ],
});
