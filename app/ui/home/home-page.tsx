'use client'

import { useState } from "react";
import LoginForm from "@/app/ui/home/login";
import QrScanner from "@/app/ui/checker/camera-scanner";

export default function HomePage() {
  const [qrData, setQrData] = useState<string | null>(null);

  return (
    <main className="bg-[url(/afrin.jpg)] bg-cover">
      <div className="flex flex-col items-center justify-center min-h-screen bg-black/70 text-white p-8 sm:p-20">
        <h1 className="text-4xl font-bold mb-4">معهد عفرين يرحب بك</h1>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="grid items-center justify-items-center gap-4">
            <QrScanner onScan={(data) => data && setQrData(data)} setQrData={setQrData} />
          </div>

          {qrData && (
            <div className="mt-4 transition-opacity duration-500 ease-in-out">
              <LoginForm id={qrData} />
            </div>
          )}

          <div className="text-center mt-4 text-gray-700 dark:text-gray-300">
            قم بمسح رمز QR للبدء
          </div>
        </div>
      </div>
    </main>
  );
}
