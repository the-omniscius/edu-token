'use client';

import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface MobileQRScannerProps {
  onScan: (qrData: string) => void;
  isScanning: boolean;
  onClose: () => void;
}

export default function MobileQRScanner({ onScan, isScanning, onClose }: MobileQRScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isScanning && !isInitialized) {
      initializeScanner();
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, [isScanning, isInitialized]);

  const initializeScanner = () => {
    try {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        false
      );

      scanner.render((decodedText) => {
        // Success callback
        onScan(decodedText);
        scanner.clear();
        setIsInitialized(false);
      }, (error) => {
        // Error callback - we can ignore most errors during scanning
        console.log('QR scanning error:', error);
      });

      scannerRef.current = scanner;
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize QR scanner:', error);
      // Fallback to demo mode
      setTimeout(() => {
        onScan('demo-qr-code');
        setIsInitialized(false);
      }, 2000);
    }
  };

  const handleClose = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
    }
    setIsInitialized(false);
    onClose();
  };

  if (!isScanning) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="text-center">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Scan QR Code</h3>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <p className="text-gray-600 text-sm mb-4">
            Point your camera at the event QR code
          </p>

          {/* QR Scanner Container */}
          <div id="qr-reader" className="mb-4"></div>

          {/* Fallback for demo */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600">
              💡 <strong>Demo Mode:</strong> If camera access is not available, 
              this will simulate scanning after 2 seconds.
            </p>
          </div>

          <button
            onClick={handleClose}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
} 