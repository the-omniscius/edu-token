'use client';

import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface QRScanData {
  eventId: string;
  eventName: string;
  tokenAmount: number;
  tokenType: 'academic' | 'social';
  timestamp: number;
}

interface QRCodeScannerProps {
  onScan: (data: QRScanData) => void;
  onClose: () => void;
}

export default function QRCodeScanner({ onScan, onClose }: QRCodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && !scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        false
      );

      scannerRef.current.render((decodedText) => {
        try {
          const data = JSON.parse(decodedText) as QRScanData;
          onScan(data);
          setIsScanning(false);
        } catch (error) {
          console.error('Invalid QR code data:', error);
        }
      }, () => {
        // Ignore scanning errors
      });

      setIsScanning(true);
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Scan QR Code</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        
        <div ref={containerRef} id="qr-reader" className="mb-4"></div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            Point your camera at a QR code to scan and earn tokens
          </p>
          {isScanning && (
            <div className="text-blue-600 text-sm">
              Scanning for QR codes...
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 