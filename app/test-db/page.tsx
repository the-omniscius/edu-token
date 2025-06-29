'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function TestDB() {
  const [status, setStatus] = useState('Testing connection...');
  const [error, setError] = useState('');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Test basic connection
      const { data, error } = await supabase
        .from('tasks')
        .select('count')
        .limit(1);

      if (error) {
        setError(`Database error: ${error.message}`);
        setStatus('Connection failed');
      } else {
        setStatus('Database connection successful!');
      }
    } catch (err) {
      setError(`Connection error: ${err}`);
      setStatus('Connection failed');
    }
  };

  const createTestTask = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: 'Test Task',
          description: 'This is a test task',
          tokens: 10,
          completed: false
        })
        .select();

      if (error) {
        setError(`Create error: ${error.message}`);
      } else {
        setStatus('Test task created successfully!');
      }
    } catch (err) {
      setError(`Create error: ${err}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Database Test
          </h2>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Connection Status</h3>
            <p className={`text-sm ${status.includes('successful') ? 'text-green-600' : 'text-gray-600'}`}>
              {status}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={testConnection}
              className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Test Connection
            </button>
            
            <button
              onClick={createTestTask}
              className="w-full px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Create Test Task
            </button>

            <a
              href="/"
              className="block w-full text-center px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Go Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
