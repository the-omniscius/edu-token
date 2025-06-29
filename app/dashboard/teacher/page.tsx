'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../context/UserContext';

interface Task {
  id: string;
  title: string;
  description: string;
  tokens: number;
  tokenType: 'academic' | 'social';
  assigned_to: string;
  completed: boolean;
  created_at: string;
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
  created_by: string;
}

export default function TeacherDashboard() {
  const { user } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'tasks' | 'events'>('tasks');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    tokens: 0,
    tokenType: 'academic' as 'academic' | 'social',
    assigned_to: ''
  });
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    tokenReward: 0,
    tokenType: 'academic' as 'academic' | 'social'
  });
  const router = useRouter();

  // Statistics
  const [totalStudents, setTotalStudents] = useState(0);
  const [activeTasks, setActiveTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);

  useEffect(() => {
    if (!user) {
      router.push('/auth/sign-in');
      return;
    }

    if (user.user_metadata?.role !== 'teacher') {
      router.push('/dashboard/student');
      return;
    }

    fetchTasks();
    fetchEvents();
    fetchStatistics();
  }, [user, router]);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('created_by', user?.email)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('created_by', user?.email)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      setError('Failed to fetch events');
      console.error('Error fetching events:', err);
    }
  };

  const fetchStatistics = async () => {
    try {
      // Fetch total students
      const { count: studentCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student');

      // Fetch active and completed tasks
      const { data: taskStats } = await supabase
        .from('tasks')
        .select('completed')
        .eq('created_by', user?.email);

      const active = taskStats?.filter(task => !task.completed).length || 0;
      const completed = taskStats?.filter(task => task.completed).length || 0;

      setTotalStudents(studentCount || 0);
      setActiveTasks(active);
      setCompletedTasks(completed);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTask.title || !newTask.description || newTask.tokens <= 0) {
      setError('Please fill in all fields and set a valid token amount');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          title: newTask.title,
          description: newTask.description,
          tokens: newTask.tokens,
          tokenType: newTask.tokenType,
          assigned_to: newTask.assigned_to || null,
          completed: false,
          created_by: user?.email
        }])
        .select();

      if (error) throw error;

      setTasks([data[0], ...tasks]);
      setNewTask({ title: '', description: '', tokens: 0, tokenType: 'academic', assigned_to: '' });
      setShowCreateForm(false);
      setActiveTasks(prev => prev + 1);
      setError('');
    } catch (err) {
      setError('Failed to create task');
      console.error('Error creating task:', err);
    }
  };

  const createEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEvent.title || !newEvent.description || !newEvent.date || !newEvent.time || !newEvent.location || newEvent.tokenReward <= 0) {
      setError('Please fill in all fields and set a valid token reward');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('events')
        .insert([{
          title: newEvent.title,
          description: newEvent.description,
          date: newEvent.date,
          time: newEvent.time,
          location: newEvent.location,
          tokenReward: newEvent.tokenReward,
          tokenType: newEvent.tokenType,
          created_by: user?.email
        }])
        .select();

      if (error) throw error;

      setEvents([data[0], ...events]);
      setNewEvent({ title: '', description: '', date: '', time: '', location: '', tokenReward: 0, tokenType: 'academic' });
      setShowEventForm(false);
      setError('');
    } catch (err) {
      setError('Failed to create event');
      console.error('Error creating event:', err);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      setTasks(tasks.filter(task => task.id !== taskId));
      setActiveTasks(prev => prev - 1);
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      setEvents(events.filter(event => event.id !== eventId));
    } catch (err) {
      setError('Failed to delete event');
      console.error('Error deleting event:', err);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/sign-in');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Teacher Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.email || 'Teacher'}
              </span>
              <button
                onClick={handleSignOut}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">👥</span>
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">{totalStudents}</h3>
                  <p className="text-sm text-gray-500">Total Students</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">📋</span>
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">{activeTasks}</h3>
                  <p className="text-sm text-gray-500">Active Tasks</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✅</span>
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">{completedTasks}</h3>
                  <p className="text-sm text-gray-500">Completed Tasks</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('tasks')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'tasks'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📋 Tasks ({tasks.length})
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'events'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📅 Events ({events.length})
              </button>
            </nav>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Tasks Tab */}
          {activeTab === 'tasks' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Manage Tasks</h2>
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {showCreateForm ? 'Cancel' : 'Create New Task'}
                </button>
              </div>

              {showCreateForm && (
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Task</h3>
                  <form onSubmit={createTask} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                          type="text"
                          value={newTask.title}
                          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Token Type</label>
                        <select
                          value={newTask.tokenType}
                          onChange={(e) => setNewTask({ ...newTask, tokenType: e.target.value as 'academic' | 'social' })}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="academic">📚 Academic</option>
                          <option value="social">🤝 Social</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        rows={3}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Tokens</label>
                        <input
                          type="number"
                          min="1"
                          value={newTask.tokens}
                          onChange={(e) => setNewTask({ ...newTask, tokens: parseInt(e.target.value) || 0 })}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Assigned To (Optional)</label>
                        <input
                          type="text"
                          value={newTask.assigned_to}
                          onChange={(e) => setNewTask({ ...newTask, assigned_to: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Student email or leave empty for general task"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Create Task
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCreateForm(false)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="bg-white shadow-sm border rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">All Tasks</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {tasks.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                      <p className="text-gray-500 text-lg">No tasks created yet.</p>
                      <p className="text-gray-400 text-sm mt-2">Create your first task to get started!</p>
                    </div>
                  ) : (
                    tasks.map((task) => (
                      <div key={task.id} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                task.tokenType === 'academic' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {task.tokenType === 'academic' ? '📚 Academic' : '🤝 Social'}
                              </span>
                              <span className={task.completed ? 'text-green-600 text-sm' : 'text-yellow-600 text-sm'}>
                                {task.completed ? '✅ Completed' : '⏳ Pending'}
                              </span>
                            </div>
                            <h4 className="text-lg font-medium text-gray-900">{task.title}</h4>
                            <p className="text-gray-600 mt-1">{task.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <span className="text-green-600 font-medium">{task.tokens} tokens</span>
                              {task.assigned_to && (
                                <span>Assigned to: {task.assigned_to}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Manage Events</h2>
                <button
                  onClick={() => setShowEventForm(!showEventForm)}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {showEventForm ? 'Cancel' : 'Create New Event'}
                </button>
              </div>

              {showEventForm && (
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Event</h3>
                  <form onSubmit={createEvent} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                          type="text"
                          value={newEvent.title}
                          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Token Type</label>
                        <select
                          value={newEvent.tokenType}
                          onChange={(e) => setNewEvent({ ...newEvent, tokenType: e.target.value as 'academic' | 'social' })}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="academic">📚 Academic</option>
                          <option value="social">🤝 Social</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        rows={3}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Date</label>
                        <input
                          type="date"
                          value={newEvent.date}
                          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Time</label>
                        <input
                          type="time"
                          value={newEvent.time}
                          onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <input
                          type="text"
                          value={newEvent.location}
                          onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Token Reward</label>
                        <input
                          type="number"
                          min="1"
                          value={newEvent.tokenReward}
                          onChange={(e) => setNewEvent({ ...newEvent, tokenReward: parseInt(e.target.value) || 0 })}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Create Event
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowEventForm(false)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500 text-lg">No events created yet.</p>
                    <p className="text-gray-400 text-sm mt-2">Create your first event to get started!</p>
                  </div>
                ) : (
                  events.map((event) => (
                    <div key={event.id} className="bg-white p-6 rounded-lg shadow-sm border">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.tokenType === 'academic' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {event.tokenType === 'academic' ? '📚 Academic' : '🤝 Social'}
                        </span>
                        <button
                          onClick={() => deleteEvent(event.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          🗑️
                        </button>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{event.description}</p>
                      <div className="space-y-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <span className="mr-2">📅</span>
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2">🕒</span>
                          {event.time}
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2">📍</span>
                          {event.location}
                        </div>
                      </div>
                      <div className="mt-4">
                        <span className="text-sm text-green-600 font-medium">
                          {event.tokenReward} tokens reward
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 