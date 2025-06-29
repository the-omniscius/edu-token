'use client';

import { useState, useEffect } from 'react';

interface QRScannerProps {
  onScan: (qrData: string) => void;
  isScanning: boolean;
  onClose: () => void;
}

export default function QRScanner({ isScanning, onClose }: Omit<QRScannerProps, 'onScan'>) {
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    if (isScanning) {
      setScanProgress(0);
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isScanning]);

  if (!isScanning) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="text-4xl mb-4">📱</div>
          <h3 className="text-lg font-semibold mb-2">Scanning QR Code...</h3>
          <p className="text-gray-600 mb-4">Point your camera at the event QR code</p>
          
          {/* Simulated camera view */}
          <div className="relative bg-gray-100 rounded-lg p-8 mb-4">
            <div className="border-2 border-blue-500 rounded-lg p-4 relative">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500"></div>
              
              <div className="flex items-center justify-center h-32">
                <div className="text-6xl">📋</div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-200"
              style={{ width: `${scanProgress}%` }}
            ></div>
          </div>
          
          <p className="text-sm text-gray-500 mb-4">
            {scanProgress < 100 ? 'Scanning...' : 'QR Code detected!'}
          </p>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 