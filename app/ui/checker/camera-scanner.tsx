"use client"

import React, { useRef, useEffect, useState, Dispatch, SetStateAction } from 'react';
import jsQR from 'jsqr';

const CameraScanner: React.FC<{
  onScan: (data: string) => void,
  setQrData: Dispatch<SetStateAction<string | null>>
}> = ({ onScan, setQrData }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let stream: MediaStream;
    let animationId: number;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setLoading(false);
            scanLoop();
          };
        }
      } catch (err: any) {
        if (err.name === 'NotAllowedError') setError('تم رفض إذن الكاميرا');
        else if (err.name === 'NotFoundError') setError('لم يتم العثور على كاميرا');
        else setError('حدث خطأ أثناء تشغيل الكاميرا');
      }
    };

    const scanLoop = () => {
      if (videoRef.current && canvasRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && !scanned) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const scale = 0.6; // downscale for performance
          canvas.width = video.videoWidth * scale;
          canvas.height = video.videoHeight * scale;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code?.data) {
            setScanned(true);
            onScan(code.data);
          }
        }
      }
      animationId = requestAnimationFrame(scanLoop);
    };

    startCamera();

    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
      cancelAnimationFrame(animationId);
    };
  }, [onScan]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-sm rounded-xl overflow-hidden shadow-lg">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          aria-label="QR Scanner"
          className="w-full rounded-xl"
        />
        {loading && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
            جار فتح الكاميرا...
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
            تعذر فتح الكاميرا...
          </div>
        )}
        {scanned && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md">
            <button
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold shadow-lg hover:scale-105 transition-transform duration-200"
              onClick={() => {
                setScanned(false);
                onScan('');
                setQrData(null);
              }}
            >
              إعادة المسح
            </button>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {error && (
        <div role="alert" className="text-red-500 mt-2 font-semibold bg-red-100 rounded px-3 py-2 shadow">
          {error}
        </div>
      )}
    </div>
  );
};

export default CameraScanner;
