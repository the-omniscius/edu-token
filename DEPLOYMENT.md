# 🚀 EduToken MVP Deployment Guide

This guide will help you deploy your EduToken MVP to Vercel and test the QR scanning functionality.

## 📋 Prerequisites

- GitHub account
- Vercel account (free)
- Supabase project with database setup
- Mobile device for QR testing

## 🔧 Step 1: GitHub Repository Setup

### 1.1 Create New Repository
1. Go to [GitHub](https://github.com)
2. Click "New repository"
3. Name it: `edutoken-mvp`
4. Make it **Public** (for free Vercel deployment)
5. Don't initialize with README (we already have one)

### 1.2 Push Your Code
```bash
# Add the new GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/edutoken-mvp.git

# Push to GitHub
git add .
git commit -m "Initial commit - EduToken MVP with QR scanning"
git push -u origin main
```

## 🌐 Step 2: Vercel Deployment

### 2.1 Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your `edutoken-mvp` repository

### 2.2 Configure Environment Variables
In Vercel project settings, add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: Use the same values from your `.env.local` file.

### 2.3 Deploy
1. Click "Deploy"
2. Wait for build to complete (2-3 minutes)
3. Your app will be live at: `https://your-project.vercel.app`

## 📱 Step 3: Mobile QR Testing

### 3.1 Generate QR Codes
Use any QR code generator (like [qr-code-generator.com](https://www.qr-code-generator.com)) to create QR codes with these values:

```
event-cleanup-2024
math-comp-2024
tutoring-2024
```

### 3.2 Test on Mobile
1. **Open your deployed app** on mobile: `https://your-project.vercel.app`
2. **Sign up as a student** with any email
3. **Go to dashboard** → Click "Show Scanner"
4. **Click "Scan QR"** on any event
5. **Allow camera access** when prompted
6. **Scan the QR codes** you generated
7. **Watch tokens increase** in real-time!

## 🎯 Step 4: Hackathon Demo Preparation

### 4.1 Demo Script
1. **Landing Page** (30 seconds)
   - Show beautiful UI
   - Highlight features
   - Click "Join as Student"

2. **Sign-up Process** (30 seconds)
   - Show role selection
   - Complete registration
   - Redirect to dashboard

3. **Dashboard Overview** (30 seconds)
   - Show token balances (initially 0)
   - Explain dual token system
   - Point out recent activity

4. **QR Scanner Demo** (60 seconds)
   - Click "Show Scanner"
   - Explain mobile functionality
   - Click "Scan QR" on an event
   - Show scanning animation
   - Demonstrate token earning

5. **Real-time Updates** (30 seconds)
   - Show token balance increase
   - Check notifications
   - Demonstrate persistence

### 4.2 Backup Plan
If camera doesn't work:
- The app has a fallback demo mode
- It simulates scanning after 2 seconds
- Still shows token earning functionality

## 🔍 Step 5: Testing Checklist

- [ ] App loads without errors
- [ ] Sign-up works for both roles
- [ ] Dashboard displays correctly
- [ ] QR scanner opens on mobile
- [ ] Camera permission requested
- [ ] Tokens earned after scanning
- [ ] Data persists in Supabase
- [ ] Works on different mobile devices

## 🚨 Troubleshooting

### Common Issues:

1. **"Invalid API Key" Error**
   - Check Supabase credentials in Vercel
   - Ensure URL and key match your Supabase project

2. **Camera Not Working**
   - Must be on HTTPS (Vercel provides this)
   - Allow camera permissions
   - Try different browser (Chrome works best)

3. **Build Failures**
   - Check Node.js version (18+ required)
   - Verify all dependencies are installed
   - Check for TypeScript errors

4. **Database Connection Issues**
   - Verify Supabase RLS policies are set up
   - Check if user_tokens table exists
   - Ensure environment variables are correct

### Quick Fixes:
```bash
# Clear cache and rebuild
npm run build -- --no-cache

# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL

# Test locally first
npm run dev
```

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify Supabase connection at `/test-supabase`
3. Test on different devices/browsers
4. Check Vercel deployment logs

## 🎉 Success!

Once deployed and tested, your EduToken MVP will be:
- ✅ **Live on the internet**
- ✅ **Mobile QR scanning working**
- ✅ **Real-time token system**
- ✅ **Database persistence**
- ✅ **Ready for hackathon demo**

**Good luck with your presentation! 🚀** 