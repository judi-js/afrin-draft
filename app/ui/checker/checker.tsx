"use client"

import React, { useState } from 'react';
import QrReader from '@/app/ui/checker/QrReader'; // Adjust the import path if necessary
import { CheckButton } from '@/app/ui/kits/buttons';
import { StudentField } from '@/app/lib/definitions';

export default function Checker({ students }: { students: StudentField[] }) {
  const [qrData, setQrData] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);

  const handleScan = async (data: string) => {
    if (data) {
      setQrData(data);
    }
  };
  
  console.log(qrData);

  return (
    <div className="min-h-[60vh]">
      <QrReader onScan={handleScan} setQrData={setQrData} students={students} setDate={setDate} />
      {qrData && <p className="text-gray-700 flex items-center justify-center"><span className="font-semibold">{students.find(x => x.id === qrData)?.first_name || 'Unknown'} {students.find(x => x.id === qrData)?.last_name || 'Unknown'}</span></p>}
      {qrData && <CheckButton id={qrData || ''} date={date} />}
    </div>
  );
}