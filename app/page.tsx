'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">🎓</div>
              <h1 className="text-xl font-bold text-gray-800">EduToken</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/auth/sign-in"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/sign-up"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Revolutionizing Education with
            <span className="text-blue-600"> Token Rewards</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            EduToken incentivizes student engagement through a dual-token system. 
            Earn Academic and Social tokens for your achievements and contributions to the community.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/auth/sign-up"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              Start Earning Tokens
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Academic Tokens</h3>
            <p className="text-gray-600">
              Earn tokens for completing assignments, participating in competitions, 
              and achieving academic milestones.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Social Tokens</h3>
            <p className="text-gray-600">
              Build community by participating in events, helping peers, 
              and contributing to campus activities.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">QR Code Scanning</h3>
            <p className="text-gray-600">
              Instantly earn tokens by scanning QR codes at events and activities. 
              Real-time rewards for real engagement.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Transform Education?</h2>
          <p className="text-gray-600 mb-8">
            Join us in creating a more engaging and rewarding educational experience
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/auth/sign-up?role=student"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Join as Student
            </Link>
            <Link 
              href="/auth/sign-up?role=teacher"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Join as Teacher
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 EduToken - Revolutionizing Education Through Token Incentives
          </p>
        </div>
      </footer>
    </div>
  );
} 