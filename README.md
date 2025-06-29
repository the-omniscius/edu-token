# 🎓 EduToken MVP

A gamified educational platform that incentivizes student engagement through dual-token rewards. Built with Next.js, Supabase, and real-time QR code scanning.

## ✨ Features

### 🎯 For Students
- **Dual Token System**: Earn Academic (📚) and Social (🤝) tokens
- **Real-time QR Scanning**: Scan QR codes at events to earn tokens instantly
- **Mobile-First Design**: Works perfectly on mobile devices with camera access
- **Dashboard Analytics**: Track your token balance and recent activities
- **Event Participation**: Join events and earn rewards

### 👨‍🏫 For Teachers
- **Student Monitoring**: Track student progress and engagement
- **Token Management**: Distribute tokens for achievements
- **Event Creation**: Create and manage educational events
- **Analytics Dashboard**: View student participation metrics

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **QR Scanning**: HTML5-QRCode library
- **Deployment**: Vercel

## 📱 Mobile QR Scanning

The app features real mobile QR code scanning:
- **Camera Access**: Uses device camera for real QR code scanning
- **Demo Mode**: Fallback simulation if camera access fails
- **Event QR Codes**: Scan codes at events to earn tokens instantly
- **Cross-Platform**: Works on iOS and Android

## 🎯 Hackathon Demo

Perfect for hackathon presentations with:
- **Live Demo**: Real-time token earning
- **Mobile Interaction**: QR scanning on actual devices
- **Professional UI**: Modern, responsive design
- **Database Persistence**: Real data storage and retrieval

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/edutoken-mvp.git
cd edutoken-mvp
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Supabase Database Setup
Run these SQL commands in your Supabase SQL editor:

```sql
-- Create user_tokens table
CREATE TABLE user_tokens (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  academic_tokens INTEGER DEFAULT 0,
  social_tokens INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE user_tokens ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own tokens" ON user_tokens
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tokens" ON user_tokens
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tokens" ON user_tokens
  FOR UPDATE USING (auth.uid() = user_id);
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy on Vercel**:
- Go to [vercel.com](https://vercel.com)
- Sign up with GitHub
- Click "New Project"
- Import your repository
- Add environment variables from your `.env.local`
- Deploy!

### Alternative: Deploy to Netlify
```bash
npm run build
# Upload the .next folder to Netlify
```

## 📱 Mobile Testing

### QR Code Testing
Generate QR codes with these values for testing:
- `event-cleanup-2024`
- `math-comp-2024`
- `tutoring-2024`

### Testing Steps
1. Deploy to Vercel (gets HTTPS automatically)
2. Open on mobile device
3. Sign up as a student
4. Go to dashboard → "Show Scanner"
5. Click "Scan QR" → Allow camera access
6. Scan the generated QR codes

## 🎯 Demo Flow for Hackathon

1. **Landing Page**: Show beautiful UI and features
2. **Student Sign-up**: Demonstrate role-based registration
3. **Dashboard**: Show initial token balances (0)
4. **QR Scanner**: Highlight mobile scanning feature
5. **Token Earning**: Show real-time balance updates
6. **Database**: Demonstrate data persistence

## 🔧 Project Structure

```
edutoken-mvp/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Student & Teacher dashboards
│   ├── layout.tsx         # Root layout with UserProvider
│   └── page.tsx           # Landing page
├── components/            # Reusable components
│   ├── QRScanner.tsx      # Demo QR scanner
│   └── MobileQRScanner.tsx # Real mobile QR scanner
├── context/               # React context
│   └── UserContext.tsx    # User authentication context
├── lib/                   # Utility libraries
│   └── supabaseClient.ts  # Supabase client configuration
└── public/                # Static assets
```

## 🔒 Security

- Environment variables are properly configured
- Supabase Row Level Security (RLS) enabled
- No sensitive data in client-side code
- HTTPS required for camera access

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Acknowledgments

- Built for educational hackathon
- Inspired by gamification in education
- Uses modern web technologies
- Mobile-first design approach

---

**Ready for your hackathon demo! 🚀**
