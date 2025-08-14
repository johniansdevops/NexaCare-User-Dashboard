# Mediva AI - Healthcare Platform

## 🎯 Overview

Mediva AI is an AI-powered healthcare platform that bridges the gap between patients and healthcare providers through intelligent automation, seamless communication, and data-driven insights. Built with Claude Haiku 3.5 for advanced AI capabilities and modern web technologies.

## 🚀 Features

- **AI-Powered Health Assistant** - Powered by Claude Haiku 3.5
- **Patient Dashboard** - Comprehensive health management
- **Provider Dashboard** - Patient management and AI-assisted tools
- **Appointment Management** - Smart scheduling system
- **Medical Records** - Secure document management
- **Symptom Analysis** - AI-driven health assessments
- **Telehealth Integration** - Video consultations
- **HIPAA Compliant** - Enterprise-grade security

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL), Next.js API Routes
- **AI**: Claude Haiku 3.5 (Anthropic)
- **Authentication**: Supabase Auth
- **UI Components**: Radix UI, Framer Motion
- **Deployment**: Vercel
- **Database**: PostgreSQL (Supabase)

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Anthropic API key

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd mediva-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
Copy `.env.example` to `.env.local` and configure:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://zorrkhnussfbfhzyioxi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvcnJraG51c3NmYmZoenlpb3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwOTkwNTAsImV4cCI6MjA3MDY3NTA1MH0.pwnpRXp9fuUGVbkM9JpqGBgd4DnmCmEHL-a9K_jTVX0
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Anthropic API Configuration (Claude Haiku 3.5)
ANTHROPIC_API_KEY=your-anthropic-api-key-here

# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:3000`

## 🔧 Configuration

### Supabase Setup

Your Supabase instance is pre-configured:
- **URL**: `https://zorrkhnussfbfhzyioxi.supabase.co`
- **ID**: `zorrkhnussfbfhzyioxi`
- **Anon Key**: Already configured in environment

### Anthropic API

1. Get your API key from [Anthropic Console](https://console.anthropic.com/)
2. Add it to your `.env.local` file as `ANTHROPIC_API_KEY`

### Database Schema

The application includes a comprehensive database schema for:
- User profiles (patients/providers)
- Medical records and history
- Appointments and scheduling
- AI conversations and analysis
- Health assessments and vitals

## 🚀 Deployment

### Vercel Deployment

The project is configured for Vercel deployment with `vercel.json`:

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy to Vercel**
```bash
vercel
```

3. **Configure Environment Variables**
Add these in your Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

### Manual Deployment

```bash
npm run build
npm start
```

## 📁 Project Structure

```
mediva-ai/
├── app/                    # Next.js 14 app directory
│   ├── auth/              # Authentication pages
│   ├── patient/           # Patient dashboard
│   ├── provider/          # Provider dashboard
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── lib/                   # Utility libraries
│   ├── supabase.ts        # Supabase configuration
│   ├── anthropic.ts       # Claude AI configuration
│   └── utils.ts           # Helper functions
├── types/                 # TypeScript definitions
├── components/            # Reusable components
├── vercel.json           # Vercel deployment config
└── DEVELOPMENT_ROADMAP.md # Detailed development plan
```

## 🔒 Security & Compliance

- **HIPAA Compliant** architecture
- **End-to-end encryption** for sensitive data
- **Role-based access control**
- **Secure authentication** with Supabase
- **Data validation** and sanitization
- **Security headers** configured

## 🧪 AI Features

### Claude Haiku 3.5 Integration

- **Health Assessments** - Symptom analysis and recommendations
- **Medical Information** - Drug interactions and medication guidance
- **Lab Interpretation** - AI-assisted lab result analysis
- **Preventive Care** - Personalized health recommendations
- **Chat Support** - Intelligent health assistant

### Available AI Functions

```typescript
// Health assessment
generateHealthAssessment(symptoms, medicalHistory)

// Medication information  
generateMedicationInfo(medicationName, patientInfo)

// Personalized recommendations
generateHealthRecommendations(healthData)

// General chat completion
generateChatCompletion(messages, options)
```

## 📈 Development Roadmap

See `DEVELOPMENT_ROADMAP.md` for a comprehensive 24-month development plan including:

- **Phase 1**: Foundation & MVP (Months 1-3)
- **Phase 2**: Core Features (Months 4-8)  
- **Phase 3**: Advanced AI Features (Months 9-12)
- **Phase 4**: Enterprise Features (Months 13-18)
- **Phase 5**: Scale & Optimization (Months 19-24)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in this repository
- Contact the development team
- Check the documentation in `/docs`

## 🎯 Next Steps

1. **Configure Anthropic API** - Add your API key
2. **Set up Supabase** - Configure service role key
3. **Deploy to Vercel** - Use the provided configuration
4. **Customize UI** - Adapt to your brand
5. **Add Features** - Follow the development roadmap

---

**Built with ❤️ for better healthcare accessibility** 