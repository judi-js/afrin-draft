"use server";

import { z } from "zod";
import postgres from "postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const FormSchema = z.object({
  id: z.string(),
  studentId: z.string({
    invalid_type_error: "اختر طالباً من فضلك.",
  }),
  check_in: z.string(),
  check_out: z.string().optional(),
});

const StudentFormSchema = z
  .object({
    first_name: z.string({
      required_error: "الاسم الاول مطلوب.",
      invalid_type_error: "الاسم الأول يجب أن يكون نصاً.",
    }).min(3, "يجب أن يكون الاسم الاول مؤلفاً من ثلاثة حروف على الأقل."),
    last_name: z.string({
      required_error: "اسم العائلة مطلوب.",
      invalid_type_error: "اسم العائلة يجب أن يكون نصاً.",
    }).min(3, "يجب أن يكون اسم العائلة مؤلفاً من ثلاثة حروف على الأقل."),
    grade: z.string({
      invalid_type_error: "اختر صفاً من فضلك.",
    }),
    department: z.preprocess(
      (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
      z.string().nullable().optional()
    ),
  })
  .refine(
    (data) => {
      const needsDepartment = ["الحادي عشر", "الثاني عشر"].includes(data.grade);

      if (needsDepartment) {
        // Must have a non-empty department
        return !!data.department && data.department.trim().length > 0;
      } else {
        // Must NOT have a department
        return !data.department || data.department.trim().length === 0;
      }
    },
    {
      message: "الفرع مطلوب للصفوف الحادي عشر والثاني عشر.",
      path: ["department"],
    }
  );

export type StudentFormState = {
  errors?: {
    first_name?: string[];
    last_name?: string[];
    grade?: string[];
    department?: string[];
  };
  message?: string | null;
};

const CreateSession = FormSchema.omit({ id: true });
const UpdateSession = FormSchema.omit({ id: true });

export type State = {
  errors?: {
    studentId?: string[];
    check_in?: string[];
    check_out?: string[];
  };
  message?: string | null;
};

export async function checkSession(studentId: string, date?: string | null) {
  try {
    // Helper to add 3 hours
    const getAdvancedDate = (d?: string | null) => {
      const base = d ? new Date(d) : new Date();
      base.setHours(base.getHours() + 3);
      return base;
    };
    if (date) {
      const advancedDate = getAdvancedDate(date);

      // Check if the student exists in the students table
      const studentExists = await sql`
    SELECT 1
    FROM students
    WHERE id = ${studentId}
  `;

      if (studentExists.length === 0) {
        return { message: "الطالب غير موجود. فشل إنشاء الجلسة." };
      }

      // Check if the student has an active session or is within the 10-minute interval
      // const activeSession = await sql`
      //   SELECT 1
      //   FROM sessions
      //   WHERE student_id = ${studentId}
      //     AND (check_out IS NULL OR ${new Date()} - check_in <= INTERVAL '20 seconds')
      // `;
      const activeSession = await sql`
    SELECT ${advancedDate} - check_in <= INTERVAL '10 minutes' AS is_active
    FROM sessions
    WHERE student_id = ${studentId}
      AND (check_out IS NULL AND ${advancedDate} - check_in <= INTERVAL '10 minutes')
  `;

      // console.log("Active Session:", activeSession[0]?.is_active);
      if (activeSession.length > 0) {
        return {
          message:
            "لا يمكن تسجيل الدخول. يجب تسجيل الخروج أولاً والانتظار لمدة 10 دقائق.",
        };
      }

      const result = await sql`
    UPDATE sessions
    SET check_out = ${advancedDate},
        estimated_time = EXTRACT(EPOCH FROM ${advancedDate} - check_in) / 60
    WHERE student_id = ${studentId} 
      AND check_out IS NULL 
      AND ${advancedDate} - check_in > INTERVAL '10 minutes'
  `;

      // Only insert a new session if no rows were updated
      if (result.count === 0) {
        await sql`
      INSERT INTO sessions (student_id, check_in, estimated_time)
      VALUES (${studentId}, ${advancedDate}, 60)
    `;
      }

      revalidatePath("/dashboard/sessions");
      return;
    }
    // Check if the student exists in the students table
    const studentExists = await sql`
      SELECT 1
      FROM students
      WHERE id = ${studentId}
    `;

    if (studentExists.length === 0) {
      return { message: "الطالب غير موجود. فشل إنشاء الجلسة." };
    }

    // Check if the student has an active session or is within the 10-minute interval
    // const activeSession = await sql`
    //   SELECT 1
    //   FROM sessions
    //   WHERE student_id = ${studentId}
    //     AND (check_out IS NULL OR ${new Date()} - check_in <= INTERVAL '20 seconds')
    // `;
    const activeSession = await sql`
      SELECT ${getAdvancedDate()} - check_in <= INTERVAL '10 minutes' AS is_active
      FROM sessions
      WHERE student_id = ${studentId}
        AND (check_out IS NULL AND ${getAdvancedDate()} - check_in <= INTERVAL '10 minutes')
    `;

    // console.log("Active Session:", activeSession[0]?.is_active);
    if (activeSession.length > 0) {
      return {
        message:
          "لا يمكن تسجيل الدخول. يجب تسجيل الخروج أولاً والانتظار لمدة 10 دقائق.",
      };
    }

    const result = await sql`
      UPDATE sessions
      SET check_out = ${getAdvancedDate()},
          estimated_time = EXTRACT(EPOCH FROM ${getAdvancedDate()} - check_in) / 60
      WHERE student_id = ${studentId} 
        AND check_out IS NULL 
        AND ${getAdvancedDate()} - check_in > INTERVAL '10 minutes'
    `;

    // Only insert a new session if no rows were updated
    if (result.count === 0) {
      await sql`
        INSERT INTO sessions (student_id, check_in, estimated_time)
        VALUES (${studentId}, ${getAdvancedDate()}, 60)
      `;
    }

    revalidatePath("/dashboard/sessions");
  } catch (error) {
    console.log(error);
    return { message: "خطأ في قاعدة البيانات: فشل إنشاء الجلسة." };
  }
}

export async function createSession(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = CreateSession.safeParse({
    studentId: formData.get("studentId"),
    check_in: formData.get("check_in"),
    check_out: formData.get("check_out"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "يجب إدخال جميع الحقول. فشل في إنشاء الجلسة.",
    };
  }

  // Prepare data for insertion into the database
  const { studentId, check_in, check_out } = validatedFields.data;

  // Check that check_in is less than the current time
  const checkInDate = new Date(check_in);
  const now = new Date();
  if (checkInDate.getTime() >= now.getTime()) {
    return {
      errors: {
        check_in: ["يجب أن يكون وقت الدخول قبل الوقت الحالي."],
      },
      message: "يجب أن يكون وقت الدخول قبل الوقت الحالي.",
    };
  }

  // Check interval between check_in and check_out (at least 10 minutes)
  if (check_out) {
    const checkOutDate = new Date(check_out);
    // Check that check_out is less than the current time
    if (checkOutDate.getTime() >= now.getTime()) {
      return {
        errors: {
          check_out: ["يجب أن يكون وقت الخروج قبل الوقت الحالي."],
        },
        message: "يجب أن يكون وقت الخروج قبل الوقت الحالي.",
      };
    }
    const diffMs = checkOutDate.getTime() - checkInDate.getTime();
    if (diffMs < 10 * 60 * 1000) {
      return {
        errors: {
          check_out: [
            "يجب أن يكون وقت الخروج بعد الدخول بعشر دقائق على الأقل.",
          ],
        },
        message: "يجب أن يكون وقت الخروج بعد الدخول بعشر دقائق على الأقل.",
      };
    }
  }

  // Insert data into the database
  try {
    const checkInISO = new Date(check_in).toISOString();
    const checkOutISO = check_out ? new Date(check_out).toISOString() : null;
    let estimatedTime: number | null = null;
    if (check_out) {
      const checkInDate = new Date(check_in);
      const checkOutDate = new Date(check_out);
      estimatedTime = Math.floor(
        (checkOutDate.getTime() - checkInDate.getTime()) / (60 * 1000)
      );
    }
    await sql`
      INSERT INTO sessions (student_id, check_in, check_out, estimated_time)
      VALUES (${studentId}, ${checkInISO}, ${checkOutISO}, ${estimatedTime})
    `;
  } catch (error) {
    console.error("DB Insert Error:", error);
    // If a database error occurs, return a more specific error.
    return {
      message: "خطأ في قاعدة البيانات: فشل في إنشاء الجلسة.",
    };
  }

  // Revalidate the cache for the students page and redirect the user.
  revalidatePath("/dashboard/students");
  redirect("/dashboard/students");
}

export async function createStudent(
  prevState: StudentFormState,
  formData: FormData
) {
  // Validate form fields using Zod
  const validatedFields = StudentFormSchema.safeParse({
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    grade: formData.get("grade"),
    department: formData.get("department"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "يجب إدخال جميع الحقول. فشل في إضافة الطالب.",
    };
  }

  // Prepare data for insertion into the database
  const { first_name, last_name, grade, department } = validatedFields.data;

  // Insert data into the database
  try {
    await sql`
      INSERT INTO students (first_name, last_name, grade, department)
      VALUES (${first_name}, ${last_name}, ${grade}, ${department ?? null})
    `;
  } catch (error) {
    console.error("DB Insert Error:", error);
    // If a database error occurs, return a more specific error.
    return {
      message: "خطأ في قاعدة البيانات: فشل في إضافة الطالب.",
    };
  }

  // Revalidate the cache for the students page and redirect the user.
  revalidatePath("/dashboard/students");
  redirect("/dashboard/students");
}

export async function updateStudent(
  id: string,
  prevState: StudentFormState,
  formData: FormData
) {
  // Validate form fields using Zod
  const validatedFields = StudentFormSchema.safeParse({
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    grade: formData.get("grade"),
    department: formData.get("department"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "يجب إدخال جميع الحقول. فشل في تحديث الطالب.",
    };
  }

  // Prepare data for insertion into the database
  const { first_name, last_name, grade, department } = validatedFields.data;

  // Insert data into the database
  try {
    await sql`
      UPDATE students
      SET first_name = ${first_name}, last_name = ${last_name}, grade = ${grade}, department = ${department ?? null}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error("DB Insert Error:", error);
    // If a database error occurs, return a more specific error.
    return {
      message: "خطأ في قاعدة البيانات: فشل في تحديث الطالب.",
    };
  }

  // Revalidate the cache for the students page and redirect the user.
  revalidatePath("/dashboard/students");
  redirect("/dashboard/students");
}

export async function updateSession(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = UpdateSession.safeParse({
    studentId: formData.get("studentId"),
    check_in: formData.get("check_in"),
    check_out: formData.get("check_out"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "يجب إدخال جميع الحقول. فشل في تحديث الجلسة.",
    };
  }

  const { studentId, check_in, check_out } = validatedFields.data;

  // Check that check_in is less than the current time
  const checkInDate = new Date(check_in);
  const now = new Date();
  if (checkInDate.getTime() >= now.getTime()) {
    return {
      errors: {
        check_in: ["يجب أن يكون وقت الدخول قبل الوقت الحالي."],
      },
      message: "يجب أن يكون وقت الدخول قبل الوقت الحالي.",
    };
  }

  // Check interval between check_in and check_out (at least 10 minutes)
  if (check_out) {
    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);
    // Check that check_out is less than the current time
    if (checkOutDate.getTime() >= now.getTime()) {
      return {
        errors: {
          check_out: ["يجب أن يكون وقت الخروج قبل الوقت الحالي."],
        },
        message: "يجب أن يكون وقت الخروج قبل الوقت الحالي.",
      };
    }
    const diffMs = checkOutDate.getTime() - checkInDate.getTime();
    if (diffMs < 10 * 60 * 1000) {
      return {
        errors: {
          check_out: [
            "يجب أن يكون وقت الخروج بعد الدخول بعشر دقائق على الأقل.",
          ],
        },
        message: "يجب أن يكون وقت الخروج بعد الدخول بعشر دقائق على الأقل.",
      };
    }
  }

  try {
    const checkOut = check_out ? new Date(check_out).toISOString() : null;
    const checkIn = new Date(check_in).toISOString();

    let estimatedTime: number | null = null;
    if (check_out) {
      const checkInDate = new Date(check_in);
      const checkOutDate = new Date(check_out);
      estimatedTime = Math.floor(
        (checkOutDate.getTime() - checkInDate.getTime()) / (60 * 1000)
      );
    }
    await sql`
      UPDATE sessions
      SET student_id = ${studentId}, check_in = ${checkIn}, check_out = ${checkOut}, estimated_time = ${estimatedTime}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: "خطأ في قاعدة البيانات: فشل في تحديث الجلسة." };
  }

  revalidatePath("/dashboard/sessions");
  redirect("/dashboard/sessions");
}

export async function deleteSession(id: string) {
  await sql`DELETE FROM sessions WHERE id = ${id}`;
  revalidatePath("/dashboard/sessions");
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export async function deleteRecord(id: string, tableName: string) {
  console.log(tableName);
  await sql`DELETE FROM ${sql(tableName)} WHERE id = ${id}`;
  revalidatePath("/dashboard/students");
}
