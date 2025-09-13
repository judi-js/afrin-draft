"use client"

import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteRecord } from '@/app/lib/actions';
import { useActionState, useState } from 'react';
import { Spinner } from '@/app/ui/kits/spinner';
import QRCodeGenerator from '@/app/ui/students/QRCodeGenerator';
import Modal from '@/app/ui/kits/modal';
import { Student } from '@/app/lib/definitions';

export function CreateButton({ entity }: { entity: "students" | "sessions" }) {
  return (
    <Link
      href={`/dashboard/${entity}/create`}
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">{entity === "students" ? "إضافة طالب" : "إضافة جلسة"}</span>{' '}
      <PlusIcon className="h-5 md:mr-4" />
    </Link>
  );
}

export function UpdateButton({ id, tableName }: { id: string; tableName: string }) {
  return (
    <Link
      href={`/dashboard/${tableName}/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function UpdateButton2({ id, tableName }: { id: string; tableName: string }) {
  return (
    <Link
      href={`/dashboard/${tableName}/${id}/edit`}
      className="text-sm text-gray-500 hover:underline"
    >
      <span>تعديل</span>
    </Link>
  );
}

export function DeleteButton({ id, tableName }: { id: string; tableName: string }) {
  const [state, formAction, isPending] = useActionState(deleteRecord.bind(null, id, tableName), undefined);
  console.log(state);

  return (
    <form action={formAction}>
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        {isPending ? <Spinner className="h-5 w-5 text-gray-400" /> : <TrashIcon className="w-5" />}
      </button>
    </form>
  );
}

export function DeleteButton2({ id, tableName }: { id: string; tableName: string }) {
  const [state, formAction, isPending] = useActionState(deleteRecord.bind(null, id, tableName), undefined);
  console.log(state);

  return (
    <form action={formAction}>
      <button type="submit" className="text-sm text-red-500 hover:underline">
        {isPending ? <Spinner className="h-5 w-5 text-gray-400" /> : <span className="">حذف</span>}
      </button>
    </form>
  );
}

export function GenerateButton({ student, students }: { student: Student; students: Student[] }) {
  const [qrCodeId, setQrCodeId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGenerateQrCode = (studentId: string) => {
    setQrCodeId(studentId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setQrCodeId(null);
  };

  return (
    <>
      <div className="pt-4 text-xs">
        <button
          onClick={() => handleGenerateQrCode(student.id)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Generate QR
        </button>
      </div>

      {isModalOpen && qrCodeId && (
        <Modal onClose={closeModal}>
          <div className="p-4 flex flex-col items-center">
            <h2 className="text-lg font-bold mb-4">QR Code</h2>
            <QRCodeGenerator
              value={qrCodeId}
              title={students.find((s) => s.id === qrCodeId)?.first_name + "_" + students.find((s) => s.id === qrCodeId)?.last_name}
            />
          </div>
        </Modal>
      )}
    </>
  );
}

export function GenerateButton2({ student, students }: { student: Student; students: Student[] }) {
  const [qrCodeId, setQrCodeId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGenerateQrCode = (studentId: string) => {
    setQrCodeId(studentId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setQrCodeId(null);
  };

  return (
    <>
      <button
        onClick={() => handleGenerateQrCode(student.id)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Generate QR
      </button>

      {isModalOpen && qrCodeId && (
        <Modal onClose={closeModal}>
          <div className="p-4 flex flex-col items-center">
            <h2 className="text-lg font-bold mb-4">QR Code</h2>
            <QRCodeGenerator
              value={qrCodeId}
              title={students.find((s) => s.id === qrCodeId)?.first_name + "_" + students.find((s) => s.id === qrCodeId)?.last_name}
            />
          </div>
        </Modal>
      )}
    </>
  );
}