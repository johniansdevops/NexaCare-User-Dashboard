# Mediva AI - Development Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create `.env.local` file:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=sk-your_openai_api_key

# App Configuration
NODE_ENV=development
```

### 3. Database Setup (Supabase)
1. Create a new Supabase project
2. Run the database migration from `lib/supabase.ts`
3. Enable Row Level Security (RLS)
4. Set up authentication policies

### 4. Start Development Server
```bash
npm run dev
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking

## 🎨 Design System

### Colors
- **Primary**: Pink gradient (#ec4899)
- **Secondary**: Blue (#0ea5e9)
- **Success**: Green (#22c55e)
- **Warning**: Orange (#f59e0b)
- **Danger**: Red (#ef4444)
- **Dark**: Slate variants

### Components
- All UI components use Tailwind CSS classes
- Custom component styles in `globals.css`
- Responsive design with mobile-first approach

## 🧪 Testing Setup

### Unit Tests
```bash
npm test
```

### E2E Tests
```bash
npm run test:e2e
```

## 📱 Features Overview

### Patient Dashboard
- Health overview with AI-generated score
- Medication reminders and tracking
- Appointment scheduling
- AI health chat assistant
- Health assessments (12 types)
- Medical records management

### Provider Dashboard  
- Patient management system
- Clinical decision support AI
- Practice analytics
- Appointment calendar
- Telehealth integration

### AI Features
- 24/7 health assistant (GPT-4)
- Symptom analysis and triage
- Medication interaction checking
- Lab result interpretation
- Preventive care recommendations

## 🔐 Security Features

- HIPAA-compliant data handling
- Row-level security (RLS)
- Authentication with Supabase Auth
- Encrypted data storage
- Audit logging

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy automatically

### Production Checklist
- [ ] Set production environment variables
- [ ] Configure Supabase production instance
- [ ] Set up monitoring (Sentry)
- [ ] Configure domain and SSL
- [ ] Test all integrations

## 📊 Key Files

- `app/layout.tsx` - Root layout with providers
- `app/providers.tsx` - Auth and theme contexts
- `lib/supabase.ts` - Database client and schema
- `lib/openai.ts` - AI integration
- `types/index.ts` - TypeScript definitions
- `tailwind.config.js` - Styling configuration

## 🤝 Development Workflow

1. Create feature branch
2. Implement changes
3. Test thoroughly
4. Create pull request
5. Code review
6. Deploy to staging
7. Deploy to production

## 🐛 Common Issues

### TypeScript Errors
- Run `npm run type-check` to verify
- Ensure all dependencies are installed
- Check `tsconfig.json` configuration

### Styling Issues
- Verify Tailwind CSS is properly configured
- Check custom CSS in `globals.css`
- Ensure dark mode classes are applied

### API Integration
- Verify environment variables
- Check Supabase connection
- Test OpenAI API key

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) 