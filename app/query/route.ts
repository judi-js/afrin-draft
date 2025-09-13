import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function listInvoices() {
  const data = await sql`
    INSERT INTO sessions (id, student_id, check_in, check_out, estimated_time)
    VALUES (uuid_generate_v4(), '5edd4ef2-0809-43ff-abe1-a60d8e3140c6', '2023-10-01T08:00:00Z', '2023-10-01T09:00:00Z', 60)
    ON CONFLICT (id) DO NOTHING;
  `;

  return data;
}

export async function GET() {
  // return Response.json({
  //   message:
  //     'Uncomment this file and remove this line. You can delete this file when you are finished.',
  // });
  try {
    return Response.json(await listInvoices());
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
