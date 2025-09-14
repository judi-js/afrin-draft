"use client";

import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { StudentField } from "@/app/lib/definitions";
import CameraScanner from "@/app/ui/checker/camera-scanner";
import BarcodeScanner from "@/app/ui/checker/barcode-scanner";
import ManualScanner from "@/app/ui/checker/manual-scanner";
import { kufi } from '@/app/ui/fonts';

export default function QrReader({
  onScan,
  setQrData,
  setDate,
  students
}: {
  onScan: (data: string) => void;
  setQrData?: Dispatch<SetStateAction<string | null>>;
  setDate?: Dispatch<SetStateAction<string | null>>;
  students: StudentField[];
}) {
  const [scannerMode, setScannerMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("scannerMode");
      return savedMode || "qr";
    }
    return "qr";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("scannerMode", scannerMode);
    }
  }, [scannerMode]);

  const handleScan = (data: string) => {
    if (!data) return;
    onScan(data);
  };

  const handleStudentSelect = (id: string) => {
    if (id) {
      onScan(id);
    }
  };

  return (
    <div className="min-h-[60vh]">
      <div className="flex items-center justify-between mb-4">
        <h1 className={`${kufi.className} mb-4 text-xl md:text-2xl`}>
          تسجيل دخول/خروج الطلاب
        </h1>
        <button
          className="transition-colors duration-200 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={() =>
            setScannerMode((prev) =>
              prev === "qr" ? "barcode" : prev === "barcode" ? "student" : "qr"
            )
          }
        >
          التبديل إلى {scannerMode === "qr" ? "ماسح الباركود" : scannerMode === "barcode" ? "اختيار الطالب" : "ماسح QR"}
        </button>
      </div>
      {scannerMode === "qr" && (
        <CameraScanner onScan={handleScan} setQrData={setQrData || (() => { })} />
      )}
      {scannerMode === "barcode" && <BarcodeScanner onScan={handleScan} />}
      {scannerMode === "student" && <ManualScanner onSelect={handleStudentSelect} setDate={setDate} students={students} />}

      {/* Optional: show result
      {scanResult && (
        <div className="text-lg mt-4">النتيجة الممسوحة: {scanResult}</div>
      )} */}
    </div>
  );
}
