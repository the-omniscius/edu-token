'use client';

import { useState } from 'react';
import QRCodeGenerator from '../../../components/QRCodeGenerator';

export default function TeacherDashboard() {
  const [events, setEvents] = useState([
    { id: 1, name: 'Science Fair 2024', date: '2024-07-15', academicTokens: 50, socialTokens: 0, status: 'active' },
    { id: 2, name: 'Campus Cleanup Day', date: '2024-07-20', academicTokens: 0, socialTokens: 25, status: 'active' },
    { id: 3, name: 'Study Group Session', date: '2024-07-25', academicTokens: 0, socialTokens: 30, status: 'upcoming' }
  ]);

  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    date: '',
    academicTokens: 0,
    socialTokens: 0
  });

  const addEvent = () => {
    if (newEvent.name && newEvent.date) {
      const event = {
        id: Date.now(),
        ...newEvent,
        status: 'upcoming'
      };
      setEvents(prev => [...prev, event]);
      setNewEvent({ name: '', date: '', academicTokens: 0, socialTokens: 0 });
      setShowEventForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">👨‍🏫</div>
              <h1 className="text-xl font-bold text-gray-800">Teacher Dashboard</h1>
            </div>
            <button
              onClick={() => setShowEventForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              + Create Event
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Events</h3>
                <p className="text-3xl font-bold text-blue-600">{events.length}</p>
              </div>
              <div className="text-4xl">📅</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Events</h3>
                <p className="text-3xl font-bold text-green-600">
                  {events.filter(e => e.status === 'active').length}
                </p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Tokens Awarded</h3>
                <p className="text-3xl font-bold text-purple-600">
                  {events.reduce((sum, e) => sum + e.academicTokens + e.socialTokens, 0)}
                </p>
              </div>
              <div className="text-4xl">🎯</div>
            </div>
          </div>
        </div>

        {/* QR Code Generation Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">QR Code Generator</h2>
          <p className="text-gray-600 mb-6">
            Generate QR codes for your events. Students can scan these codes to instantly earn tokens!
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">{event.name}</h3>
                <p className="text-sm text-gray-600 mb-2">Date: {event.date}</p>
                <div className="space-y-1 mb-4">
                  {event.academicTokens > 0 && (
                    <p className="text-sm text-blue-600">📚 {event.academicTokens} Academic Tokens</p>
                  )}
                  {event.socialTokens > 0 && (
                    <p className="text-sm text-green-600">🤝 {event.socialTokens} Social Tokens</p>
                  )}
                </div>
                
                <QRCodeGenerator
                  eventId={event.id.toString()}
                  eventName={event.name}
                  tokenAmount={event.academicTokens || event.socialTokens}
                  tokenType={event.academicTokens > 0 ? 'academic' : 'social'}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Events List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">All Events</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Event Name</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Academic Tokens</th>
                  <th className="text-left py-3 px-4">Social Tokens</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{event.name}</td>
                    <td className="py-3 px-4">{event.date}</td>
                    <td className="py-3 px-4 text-blue-600">{event.academicTokens}</td>
                    <td className="py-3 px-4 text-green-600">{event.socialTokens}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        event.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Event Modal */}
      {showEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Create New Event</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                <input
                  type="text"
                  value={newEvent.name}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter event name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Academic Tokens</label>
                  <input
                    type="number"
                    value={newEvent.academicTokens}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, academicTokens: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Social Tokens</label>
                  <input
                    type="number"
                    value={newEvent.socialTokens}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, socialTokens: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={addEvent}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Create Event
              </button>
              <button
                onClick={() => setShowEventForm(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 