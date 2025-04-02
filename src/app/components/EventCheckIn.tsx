"use client";

import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import QrScanner from "qr-scanner";

export default function EventCheckIn() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [checkInStatus, setCheckInStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateQRCode = () => {
    const eventId = "event123";
    const userId = "user123";
    setQrCode(`${eventId}:${userId}:${Date.now()}`);
  };

  const handleScan = async (file: File) => {
    try {
      const result = await QrScanner.scanImage(file);
      setCheckInStatus(`✅ Check-in successful: ${result}`);
    } catch (error) {
      setCheckInStatus("❌ Invalid QR code. Please try again.");
    }
  };

  return (
    <div className="p-5 bg-gray-100 rounded-lg shadow-md w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">Event Check-In</h2>
      <button
        className="bg-green-500 hover:bg-green-600 text-black font-semibold p-3 rounded w-full transition"
        onClick={generateQRCode}
      >
        Generate QR Code
      </button>
      {qrCode && (
        <div className="mt-4 flex justify-center border p-4 rounded bg-white">
          <QRCodeCanvas value={qrCode} />
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files && handleScan(e.target.files[0])}
      />
      <button
        className="bg-blue-500 hover:bg-blue-600 text-black font-semibold p-3 rounded mt-4 w-full transition"
        onClick={() => fileInputRef.current?.click()}
      >
        Scan QR Code
      </button>
      {checkInStatus && <p className="mt-3 text-center font-semibold">{checkInStatus}</p>}
    </div>
  );
}