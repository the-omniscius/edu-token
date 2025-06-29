# EduToken MVP Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended for Hackathon)
1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/edutoken-mvp.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your repository
   - Add environment variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```
   - Deploy!

### Option 2: Netlify
1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy:**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `out` folder (after build)
   - Or connect your GitHub repository

### Option 3: Railway
1. **Connect to Railway:**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Add environment variables
   - Deploy automatically

## 📱 Mobile QR Scanning Setup

### For Real QR Code Scanning:
1. **Generate QR Codes for Events:**
   - Use any QR code generator
   - Create QR codes with these values:
     - `event-cleanup-2024`
     - `math-comp-2024`
     - `tutoring-2024`

2. **Test on Mobile:**
   - Open your deployed site on mobile
   - Go to Student Dashboard
   - Click "Show Scanner"
   - Click "Scan QR" on any event
   - Allow camera access
   - Scan the generated QR codes

### For Demo Purposes:
- The app includes a fallback demo mode
- If camera access fails, it simulates scanning after 2 seconds
- Perfect for hackathon demos!

## 🔧 Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 🎯 Hackathon Demo Checklist

### Before Demo:
- [ ] Deploy to Vercel/Netlify
- [ ] Test sign-up/sign-in flow
- [ ] Test QR scanning on mobile
- [ ] Verify token earning works
- [ ] Prepare QR codes for events

### Demo Flow:
1. **Landing Page** - Show features
2. **Student Sign-up** - Demonstrate registration
3. **Dashboard** - Show token balances
4. **QR Scanner** - Highlight mobile scanning
5. **Token Earning** - Show real-time updates
6. **Database** - Show data persistence

## 🌐 Public URLs

After deployment, your app will be available at:
- **Vercel:** `https://your-project.vercel.app`
- **Netlify:** `https://your-project.netlify.app`
- **Railway:** `https://your-project.railway.app`

## 📱 Mobile Testing

### QR Code Testing:
1. **Generate QR Codes:**
   ```
   event-cleanup-2024
   math-comp-2024
   tutoring-2024
   ```

2. **Test on Different Devices:**
   - iPhone Safari
   - Android Chrome
   - Desktop browsers

### Camera Permissions:
- The app requests camera access for QR scanning
- Works on HTTPS (required for camera access)
- Fallback demo mode if camera fails

## 🔒 Security Notes

- Environment variables are public (NEXT_PUBLIC_)
- Supabase RLS policies protect your data
- No sensitive data in client-side code
- Perfect for hackathon demos

## 🚨 Troubleshooting

### Common Issues:
1. **"Invalid API Key"** - Check Supabase credentials
2. **Camera not working** - Ensure HTTPS deployment
3. **Import errors** - Check file paths
4. **Build failures** - Check Node.js version (18+)

### Quick Fixes:
```bash
# Clear cache
npm run build -- --no-cache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check environment
echo $NEXT_PUBLIC_SUPABASE_URL
```

## 🎉 Ready for Hackathon!

Your EduToken MVP is now ready for deployment and demo! The QR code scanning feature will definitely impress the judges. Good luck! 🚀 