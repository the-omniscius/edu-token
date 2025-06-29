'use client';

import { useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeGeneratorProps {
  eventId: string;
  eventName: string;
  tokenAmount: number;
  tokenType: 'academic' | 'social';
}

export default function QRCodeGenerator({ eventId, eventName, tokenAmount, tokenType }: QRCodeGeneratorProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      // Create QR code data
      const qrData = JSON.stringify({
        eventId,
        eventName,
        tokenAmount,
        tokenType,
        timestamp: Date.now()
      });

      // Generate QR code
      const url = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      setQrCodeUrl(url);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `event-${eventId}-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Generate QR Code</h3>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Event: {eventName}</p>
        <p className="text-sm text-gray-600 mb-2">Tokens: {tokenAmount} {tokenType}</p>
      </div>

      <button
        onClick={generateQRCode}
        disabled={isGenerating}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 mb-4"
      >
        {isGenerating ? 'Generating...' : 'Generate QR Code'}
      </button>

      {qrCodeUrl && (
        <div className="text-center">
          <div className="mb-4">
            <img src={qrCodeUrl} alt="QR Code" className="mx-auto border-2 border-gray-200 rounded-lg" />
          </div>
          <button
            onClick={downloadQRCode}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Download QR Code
          </button>
        </div>
      )}
    </div>
  );
} 