'use client';

import { useState } from 'react';
import QRCodeScanner from '../../../components/QRCodeScanner';

interface QRScanData {
  eventId: string;
  eventName: string;
  tokenAmount: number;
  tokenType: 'academic' | 'social';
  timestamp: number;
}

export default function StudentDashboard() {
  const [academicTokens, setAcademicTokens] = useState(150);
  const [socialTokens, setSocialTokens] = useState(75);
  const [showScanner, setShowScanner] = useState(false);
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'academic', amount: 50, description: 'Completed Math Assignment', time: '2 hours ago' },
    { id: 2, type: 'social', amount: 25, description: 'Attended Study Group', time: '1 day ago' },
    { id: 3, type: 'academic', amount: 100, description: 'Won Science Competition', time: '3 days ago' }
  ]);

  const handleQRScan = (data: QRScanData) => {
    const { eventName, tokenAmount, tokenType } = data;
    
    // Update token balance
    if (tokenType === 'academic') {
      setAcademicTokens(prev => prev + tokenAmount);
    } else {
      setSocialTokens(prev => prev + tokenAmount);
    }

    // Add to recent activity
    const newActivity = {
      id: Date.now(),
      type: tokenType,
      amount: tokenAmount,
      description: `QR Scan: ${eventName}`,
      time: 'Just now'
    };

    setRecentActivity(prev => [newActivity, ...prev.slice(0, 4)]);
    setShowScanner(false);

    // Show success message
    alert(`🎉 Successfully earned ${tokenAmount} ${tokenType} tokens for ${eventName}!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">🎓</div>
              <h1 className="text-xl font-bold text-gray-800">Student Dashboard</h1>
            </div>
            <button
              onClick={() => setShowScanner(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <span>📱</span>
              <span>Scan QR Code</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Token Balance Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Academic Tokens</h3>
                <p className="text-3xl font-bold">{academicTokens}</p>
                <p className="text-blue-100 text-sm">Earned through studies</p>
              </div>
              <div className="text-4xl">📚</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Social Tokens</h3>
                <p className="text-3xl font-bold">{socialTokens}</p>
                <p className="text-green-100 text-sm">Earned through community</p>
              </div>
              <div className="text-4xl">🤝</div>
            </div>
          </div>
        </div>

        {/* QR Code Demo Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">QR Code Scanner Demo</h2>
          <p className="text-gray-600 mb-4">
            Scan QR codes at events to instantly earn tokens! This is a demo - try scanning any QR code to see how it works.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Demo QR Codes</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium">Science Fair Event</p>
                  <p className="text-sm text-gray-600">50 Academic Tokens</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium">Campus Cleanup</p>
                  <p className="text-sm text-gray-600">25 Social Tokens</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium">Study Group Session</p>
                  <p className="text-sm text-gray-600">30 Social Tokens</p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <button
                onClick={() => setShowScanner(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-colors flex items-center justify-center space-x-2 mx-auto"
              >
                <span>📱</span>
                <span>Start Scanning</span>
              </button>
              <p className="text-sm text-gray-500 mt-2">
                Click to open QR scanner
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'academic' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    <span className="text-lg">
                      {activity.type === 'academic' ? '📚' : '🤝'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{activity.description}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
                <div className={`font-bold ${
                  activity.type === 'academic' ? 'text-blue-600' : 'text-green-600'
                }`}>
                  +{activity.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRCodeScanner
          onScan={handleQRScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
} 