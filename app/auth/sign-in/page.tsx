'use client';
import { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher'>('student');
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        // Redirect based on selected role
        if (selectedRole === 'student') {
          router.push('/dashboard/student');
        } else {
          router.push('/dashboard/teacher');
        }
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>

        {/* Role Selection */}
        <div className="text-center">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select your role:</label>
          <div className="flex space-x-4 justify-center">
            <label className="flex items-center">
              <input
                type="radio"
                value="student"
                checked={selectedRole === 'student'}
                onChange={(e) => setSelectedRole(e.target.value as 'student' | 'teacher')}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">👨‍🎓 Student</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="teacher"
                checked={selectedRole === 'teacher'}
                onChange={(e) => setSelectedRole(e.target.value as 'student' | 'teacher')}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">👨‍🏫 Teacher</span>
            </label>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <a href="/auth/sign-up" className="text-indigo-600 hover:text-indigo-500">
              Don&apos;t have an account? Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

