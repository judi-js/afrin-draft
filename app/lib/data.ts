import postgres from "postgres";
import {
  StudentField,
  InvoiceForm,
  LatestInvoiceRaw,
  Revenue,
  SessionsTable,
  Student,
  Session,
} from "./definitions";
import { formatCurrency } from "./utils";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue[]>`SELECT * FROM revenue`;

    // console.log('Data fetch completed after 3 seconds.');

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw[]>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].count ?? "0");
    const numberOfCustomers = Number(data[1].count ?? "0");
    const totalPaidInvoices = formatCurrency(data[2][0].paid ?? "0");
    const totalPendingInvoices = formatCurrency(data[2][0].pending ?? "0");

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch card data.");
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredSessions(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const sessions = await sql<SessionsTable[]>`
      SELECT
        sessions.id,
        sessions.check_in,
        sessions.check_out,
        sessions.estimated_time,
        students.first_name,
        students.last_name,
        students.grade,
        students.department
      FROM sessions
      JOIN students ON sessions.student_id = students.id
      WHERE
        students.first_name ILIKE ${`%${query}%`} OR
        students.last_name ILIKE ${`%${query}%`} OR
        students.grade ILIKE ${`%${query}%`} OR
        students.department ILIKE ${`%${query}%`}
      ORDER BY sessions.check_in DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return sessions;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch sessions.");
  }
}

export async function fetchFilteredStudents(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const data = await sql<Student[]>`
		SELECT * FROM students
		WHERE
		  students.first_name ILIKE ${`%${query}%`} OR
        students.last_name ILIKE ${`%${query}%`} OR
        students.grade ILIKE ${`%${query}%`} OR
        students.department ILIKE ${`%${query}%`}
		ORDER BY students.first_name ASC
    LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
	  `;

    return data;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch customer table.");
  }
}

export async function fetchStudentsPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM students
    WHERE
      students.first_name ILIKE ${`%${query}%`} OR
      students.last_name ILIKE ${`%${query}%`} OR
      students.grade ILIKE ${`%${query}%`} OR
      students.department ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of students.");
  }
}

export async function fetchSessionsPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM sessions
    JOIN students ON sessions.student_id = students.id
    WHERE
      students.first_name ILIKE ${`%${query}%`} OR
      students.last_name ILIKE ${`%${query}%`} OR
      students.grade ILIKE ${`%${query}%`} OR
      students.department ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of sessions.");
  }
}

export async function fetchSessionById(id: string) {
  try {
    const data = await sql<Session[]>`
      SELECT
        sessions.id,
        sessions.student_id,
        sessions.check_in,
        sessions.check_out,
        sessions.estimated_time
      FROM sessions
      WHERE sessions.id = ${id};
    `;

    return data[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch session.");
  }
}

export async function fetchStudents() {
  try {
    const students = await sql<StudentField[]>`
      SELECT
        id,
        first_name,
        last_name
      FROM students
      ORDER BY first_name ASC
    `;

    return students;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all students.");
  }
}

export async function fetchStudentById(id: string) {
  try {
    const data = await sql<Student[]>`
      SELECT * FROM students WHERE id = ${id};
    `;

    return data[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch student.");
  }
}
