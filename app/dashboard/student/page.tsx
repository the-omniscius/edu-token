'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../context/UserContext';
import QRScanner from '../../../components/QRScanner';
import MobileQRScanner from '../../../components/MobileQRScanner';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  tokenReward: number;
  tokenType: 'academic' | 'social';
  completed: boolean;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  tokenReward: number;
  tokenType: 'academic' | 'social';
  qrCode: string;
}

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
  read: boolean;
  timestamp: string;
}

interface TokenBalance {
  academic: number;
  social: number;
}

export default function StudentDashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [tokenBalance, setTokenBalance] = useState<TokenBalance>({ academic: 0, social: 0 });
  const [scanning, setScanning] = useState(false);
  const [scannedEvent, setScannedEvent] = useState<Event | null>(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Demo events data
  const demoEvents: Event[] = [
    {
      id: '1',
      title: 'Campus Cleanup Day',
      description: 'Help keep our campus beautiful and earn social tokens!',
      date: '2024-01-15',
      time: '2:00 PM',
      location: 'Main Campus',
      tokenReward: 50,
      tokenType: 'social',
      qrCode: 'event-cleanup-2024'
    },
    {
      id: '2',
      title: 'Math Competition',
      description: 'Test your mathematical skills and win academic tokens',
      date: '2024-01-20',
      time: '10:00 AM',
      location: 'Science Building',
      tokenReward: 100,
      tokenType: 'academic',
      qrCode: 'math-comp-2024'
    },
    {
      id: '3',
      title: 'Peer Tutoring Session',
      description: 'Help fellow students and earn both token types',
      date: '2024-01-25',
      time: '3:30 PM',
      location: 'Library',
      tokenReward: 75,
      tokenType: 'academic',
      qrCode: 'tutoring-2024'
    }
  ];

  useEffect(() => {
    // Check if user is on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    if (user) {
      loadDashboardData();
    } else {
      setLoading(false);
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadTokenBalance(),
        fetchTasks(),
        fetchEvents(),
        fetchNotifications()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTokenBalance = async () => {
    try {
      const { data, error } = await supabase
        .from('user_tokens')
        .select('academic_tokens, social_tokens')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading token balance:', error);
        return;
      }

      if (data) {
        setTokenBalance({
          academic: data.academic_tokens || 0,
          social: data.social_tokens || 0
        });
      }
    } catch (error) {
      console.error('Error loading token balance:', error);
    }
  };

  const fetchTasks = async () => {
    // Demo tasks data
    const demoTasks: Task[] = [
      {
        id: '1',
        title: 'Complete Math Assignment',
        description: 'Finish the calculus problem set',
        dueDate: '2024-01-18',
        tokenReward: 25,
        tokenType: 'academic',
        completed: false
      },
      {
        id: '2',
        title: 'Attend Study Group',
        description: 'Join the physics study session',
        dueDate: '2024-01-20',
        tokenReward: 30,
        tokenType: 'social',
        completed: false
      }
    ];
    setTasks(demoTasks);
  };

  const fetchEvents = async () => {
    setEvents(demoEvents);
  };

  const fetchNotifications = async () => {
    const demoNotifications: Notification[] = [
      {
        id: '1',
        message: 'You earned 25 academic tokens for completing your assignment!',
        type: 'success',
        read: false,
        timestamp: new Date().toISOString()
      },
      {
        id: '2',
        message: 'New event: Campus Cleanup Day - earn social tokens!',
        type: 'info',
        read: false,
        timestamp: new Date().toISOString()
      }
    ];
    setNotifications(demoNotifications);
  };

  const completeTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      // Award tokens
      setTokenBalance(prev => ({
        ...prev,
        [task.tokenType]: prev[task.tokenType] + task.tokenReward
      }));

      // Add notification
      const newNotification: Notification = {
        id: Date.now().toString(),
        message: `You earned ${task.tokenReward} ${task.tokenType} tokens for completing "${task.title}"!`,
        type: 'success',
        read: false,
        timestamp: new Date().toISOString()
      };
      setNotifications(prev => [newNotification, ...prev]);

      // Mark task as completed
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, completed: true } : t
      ));

      // Save to database
      await saveTokenBalance();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const simulateQRScan = (event: Event) => {
    setScanning(true);
    setScannedEvent(event);
    
    // Simulate scanning process
    setTimeout(() => {
      setScanning(false);
      setScannedEvent(null);
      earnTokens(event);
    }, 2000);
  };

  const handleQRScan = (qrData: string) => {
    // Find the event that matches the QR code
    const event = events.find(e => e.qrCode === qrData);
    if (event) {
      earnTokens(event);
    }
    setScanning(false);
    setScannedEvent(null);
  };

  const earnTokens = async (event: Event) => {
    try {
      // First, try to update existing record
      const { data: existingData, error: selectError } = await supabase
        .from('user_tokens')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (selectError && selectError.code === 'PGRST116') {
        // Record doesn't exist, create new one
        const { error: insertError } = await supabase
          .from('user_tokens')
          .insert({
            user_id: user?.id,
            academic_tokens: event.tokenType === 'academic' ? event.tokenReward : 0,
            social_tokens: event.tokenType === 'social' ? event.tokenReward : 0,
            last_updated: new Date().toISOString()
          });

        if (insertError) {
          console.error('Error creating token record:', insertError);
          return;
        }
      } else if (existingData) {
        // Update existing record
        const updateData = {
          academic_tokens: existingData.academic_tokens + (event.tokenType === 'academic' ? event.tokenReward : 0),
          social_tokens: existingData.social_tokens + (event.tokenType === 'social' ? event.tokenReward : 0),
          last_updated: new Date().toISOString()
        };

        const { error: updateError } = await supabase
          .from('user_tokens')
          .update(updateData)
          .eq('user_id', user?.id);

        if (updateError) {
          console.error('Error updating token balance:', updateError);
          return;
        }
      }

      // Update local state
      setTokenBalance(prev => ({
        ...prev,
        [event.tokenType]: prev[event.tokenType] + event.tokenReward
      }));

      // Add notification
      const newNotification: Notification = {
        id: Date.now().toString(),
        message: `🎉 Successfully earned ${event.tokenReward} ${event.tokenType} tokens from ${event.title}!`,
        type: 'success',
        read: false,
        timestamp: new Date().toISOString()
      };
      setNotifications(prev => [newNotification, ...prev]);

      // Show success message
      alert(`🎉 Successfully earned ${event.tokenReward} ${event.tokenType} tokens from ${event.title}!`);
      
    } catch (error) {
      console.error('Error earning tokens:', error);
      alert('Error earning tokens. Please try again.');
    }
  };

  const saveTokenBalance = async () => {
    try {
      const { data: existingData, error: selectError } = await supabase
        .from('user_tokens')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (selectError && selectError.code === 'PGRST116') {
        // Create new record
        await supabase
          .from('user_tokens')
          .insert({
            user_id: user?.id,
            academic_tokens: tokenBalance.academic,
            social_tokens: tokenBalance.social,
            last_updated: new Date().toISOString()
          });
      } else {
        // Update existing record
        await supabase
          .from('user_tokens')
          .update({
            academic_tokens: tokenBalance.academic,
            social_tokens: tokenBalance.social,
            last_updated: new Date().toISOString()
          })
          .eq('user_id', user?.id);
      }
    } catch (error) {
      console.error('Error saving token balance:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Please sign in to access your dashboard</h1>
          <a href="/auth/sign-in" className="text-blue-600 hover:text-blue-800">Sign In</a>
        </div>
      </div>
    );
  }

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.email}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors">
                  🔔
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Token Balance Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Academic Tokens</h3>
                <p className="text-3xl font-bold">{tokenBalance.academic}</p>
                <p className="text-blue-100 text-sm">Earned from academic activities</p>
              </div>
              <div className="text-4xl">📚</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Social Tokens</h3>
                <p className="text-3xl font-bold">{tokenBalance.social}</p>
                <p className="text-green-100 text-sm">Earned from social activities</p>
              </div>
              <div className="text-4xl">🤝</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Tasks Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Tasks</h2>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{task.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>📅 Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            task.tokenType === 'academic' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {task.tokenReward} {task.tokenType} tokens
                          </span>
                        </div>
                      </div>
                      {!task.completed && (
                        <button
                          onClick={() => completeTask(task.id)}
                          className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Complete
                        </button>
                      )}
                      {task.completed && (
                        <span className="ml-4 text-green-600 text-sm">✓ Completed</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Events and QR Scanner Section */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
            
            {/* QR Code Scanner Demo */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Event QR Scanner</h2>
                <button
                  onClick={() => setShowQRScanner(!showQRScanner)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {showQRScanner ? 'Hide Scanner' : 'Show Scanner'}
                </button>
              </div>

              {showQRScanner && (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {isMobile ? '📱 Mobile QR Scanner' : '📱 Demo QR Scanner'}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {isMobile 
                        ? 'Use your camera to scan QR codes at events and earn tokens instantly!'
                        : 'This simulates scanning QR codes at events. Click on any event below to simulate scanning its QR code and earn tokens!'
                      }
                    </p>
                  </div>

                  <div className="grid gap-4">
                    {events.map((event) => (
                      <div key={event.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{event.title}</h4>
                            <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>📅 {event.date}</span>
                              <span>📍 {event.location}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                event.tokenType === 'academic' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {event.tokenType === 'academic' ? '📚' : '🤝'} {event.tokenReward} {event.tokenType} tokens
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => simulateQRScan(event)}
                            disabled={scanning}
                            className={`ml-4 px-4 py-2 rounded-lg font-medium transition-colors ${
                              scanning
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                          >
                            {scanning && scannedEvent?.id === event.id ? 'Scanning...' : 'Scan QR'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* QR Scanner Modal */}
            {isMobile ? (
              <MobileQRScanner 
                onScan={handleQRScan}
                isScanning={scanning}
                onClose={() => {
                  setScanning(false);
                  setScannedEvent(null);
                }}
              />
            ) : (
              <QRScanner 
                onScan={handleQRScan}
                isScanning={scanning}
                onClose={() => {
                  setScanning(false);
                  setScannedEvent(null);
                }}
              />
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <div key={event.id} className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="mr-2">📅</span>
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">📍</span>
                      {event.location}
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">🎁</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        event.tokenType === 'academic' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {event.tokenReward} {event.tokenType} tokens
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {notifications.slice(0, 5).map((notification) => (
              <div key={notification.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl">
                  {notification.type === 'success' ? '🎉' : '📢'}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{notification.message}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
                {!notification.read && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">New</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 