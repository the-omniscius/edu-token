'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function TestSupabase() {
  const [status, setStatus] = useState('Testing...');
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const [details, setDetails] = useState<any>({});

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setStatus('Testing Supabase connection...');
      setError('');
      setDetails({});
      
      // Test 1: Check environment variables
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      setDetails(prev => ({
        ...prev,
        url: url,
        keyLength: key ? key.length : 0,
        hasUrl: !!url,
        hasKey: !!key
      }));
      
      if (!url || !key) {
        setError('Environment variables not loaded properly');
        setStatus('Failed');
        return;
      }
      
      // Test 2: Try to access a simple endpoint first
      try {
        console.log('Testing basic Supabase connection...');
        const { data, error } = await supabase.from('tokens').select('count').limit(1);
        
        if (error) {
          console.error('Database error:', error);
          if (error.message.includes('relation "tokens" does not exist')) {
            setError('Database table "tokens" does not exist. Please create it in Supabase.');
            setStatus('Table Missing');
          } else if (error.message.includes('permission denied')) {
            setError('Permission denied. RLS (Row Level Security) might be blocking access. Check RLS policies.');
            setStatus('RLS Issue');
          } else {
            setError(`Database Error: ${error.message}`);
            setStatus('Failed');
          }
          return;
        }
        
        setDetails(prev => ({ ...prev, tableExists: true }));
        setStatus('Database connection successful!');
        
      } catch (tableError: any) {
        console.error('Table access error:', tableError);
        setError(`Table Error: ${tableError.message}`);
        setStatus('Table Error');
        return;
      }
      
      // Test 3: Check authentication
      try {
        console.log('Testing authentication...');
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          console.error('Auth error:', authError);
          setError(`Auth Error: ${authError.message}`);
          setStatus('Auth Failed');
          return;
        }
        
        setUser(user);
        setDetails(prev => ({ ...prev, authWorking: true }));
        
      } catch (authErr: any) {
        console.error('Auth error:', authErr);
        setError(`Auth Error: ${authErr.message}`);
        setStatus('Auth Failed');
      }
      
    } catch (err: any) {
      console.error('Connection error:', err);
      setError(`Connection Error: ${err.message}`);
      setStatus('Failed');
    }
  };

  const testSignUp = async () => {
    try {
      setStatus('Testing sign up...');
      setError('');
      
      const { data, error } = await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'testpassword123'
      });
      
      if (error) {
        setError(`Sign Up Error: ${error.message}`);
        setStatus('Failed');
        return;
      }
      
      setStatus('Sign up successful! Check your email.');
      setDetails(prev => ({ ...prev, signUpSuccess: true }));
      
    } catch (err: any) {
      setError(`Sign Up Error: ${err.message}`);
      setStatus('Failed');
      console.error('Sign up error:', err);
    }
  };

  const testTableAccess = async () => {
    try {
      setStatus('Testing table access...');
      setError('');
      
      // Try different approaches to access the table
      console.log('Testing table access with different methods...');
      
      // Method 1: Simple select
      const { data: data1, error: error1 } = await supabase
        .from('tokens')
        .select('*')
        .limit(1);
      
      if (error1) {
        console.error('Method 1 error:', error1);
        setError(`Table Access Error: ${error1.message}`);
        setStatus('Table Access Failed');
        return;
      }
      
      setStatus('Table access successful!');
      setDetails(prev => ({ ...prev, tableAccess: true }));
      
    } catch (err: any) {
      setError(`Table Access Error: ${err.message}`);
      setStatus('Table Access Failed');
      console.error('Table access error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔧 Supabase Connection Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <div className="space-y-4">
            <div>
              <strong>Status:</strong> 
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                status.includes('successful') ? 'bg-green-100 text-green-800' : 
                status.includes('Failed') ? 'bg-red-100 text-red-800' : 
                status.includes('Missing') ? 'bg-orange-100 text-orange-800' :
                status.includes('RLS') ? 'bg-yellow-100 text-yellow-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {status}
              </span>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-4">
                <strong>Error:</strong> {error}
              </div>
            )}
            
            {user && (
              <div className="bg-green-50 border border-green-200 rounded p-4">
                <strong>User:</strong> {user.email}
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2 text-sm">
            <div><strong>SUPABASE_URL:</strong> {details.url || 'Not set'}</div>
            <div><strong>SUPABASE_ANON_KEY:</strong> {details.hasKey ? `Set (${details.keyLength} chars)` : 'Not set'}</div>
            <div><strong>URL Valid:</strong> {details.hasUrl ? '✅' : '❌'}</div>
            <div><strong>Key Valid:</strong> {details.hasKey ? '✅' : '❌'}</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <h2 className="text-xl font-semibold mb-4">Database Status</h2>
          <div className="space-y-2 text-sm">
            <div><strong>Tokens Table:</strong> {details.tableExists ? '✅ Exists' : '❌ Missing'}</div>
            <div><strong>Table Access:</strong> {details.tableAccess ? '✅ Working' : '❌ Failed'}</div>
            <div><strong>Authentication:</strong> {details.authWorking ? '✅ Working' : '❌ Failed'}</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <div className="space-x-4">
            <button
              onClick={testConnection}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Test Connection
            </button>
            <button
              onClick={testTableAccess}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Test Table Access
            </button>
            <button
              onClick={testSignUp}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Test Sign Up
            </button>
          </div>
          
          {status.includes('RLS') && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <h3 className="font-semibold text-yellow-800">RLS (Row Level Security) Issue</h3>
              <p className="text-sm text-yellow-700 mt-2">
                The table exists but Row Level Security is blocking access. Run this SQL in your Supabase SQL Editor:
              </p>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
{`-- Create RLS policies for tokens table
CREATE POLICY "Users can view own tokens" ON tokens
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tokens" ON tokens
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tokens" ON tokens
  FOR UPDATE USING (auth.uid() = user_id);`}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 