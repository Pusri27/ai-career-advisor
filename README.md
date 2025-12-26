# 🎯 AI Career Advisor

> Full-stack web application with AI-powered career guidance and intelligent skill tracking

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-brightgreen.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🌟 Overview

AI Career Advisor is a comprehensive career development platform that leverages artificial intelligence to provide personalized career guidance, skill tracking, and job recommendations. Built with modern web technologies and integrated with GPT-4 and Claude AI models for intelligent insights.

**Live Demo:** [Coming Soon]

## ✨ Key Features

### 🤖 AI-Powered Intelligence
- **Dual Model Architecture** - GPT-4 Turbo for complex analysis, Claude 3.5 for fast responses
- **Career Analysis** - Personalized career path recommendations based on skills and goals
- **Skill Gap Analysis** - Identify areas for improvement with AI insights
- **Job Matching** - Intelligent job recommendations aligned with your profile
- **Learning Paths** - AI-curated course recommendations from Udemy, Coursera, YouTube, and more

### 📊 Skill & Progress Tracking
- **Visual Progress Charts** - Interactive skill progression visualization with Recharts
- **Real-time Synchronization** - Auto-refresh across all pages without manual reload
- **Historical Data** - Track skill improvements over time
- **Color-coded Proficiency** - Red/Yellow/Blue/Green indicators for skill levels
- **Goal Management** - Set SMART goals with deadline warnings and progress tracking

### 💼 Job Application Management
- **Application Tracking** - Comprehensive status tracking (Saved, Applied, Interview, Offer, etc.)
- **Dashboard Widgets** - Quick insights on applications and progress
- **Statistics Overview** - Total applications, interviews, and offers at a glance

### 🎨 Modern User Experience
- **Smooth Animations** - Framer Motion for delightful interactions
- **Loading Skeletons** - Professional loading states
- **Toast Notifications** - Real-time feedback for all actions
- **Empty States** - Helpful guidance with clear CTAs
- **Form Validation** - Comprehensive input validation with error messages
- **PDF Export** - Generate professional progress reports with charts

### 🔄 Advanced Features
- **Auto-Refresh System** - Cross-page data synchronization using Context API
- **Auto-Save** - Instant persistence of all changes
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Dark Mode Ready** - CSS variables for easy theming

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with Hooks and Context API
- **React Router** - Client-side routing
- **Framer Motion** - Smooth animations and transitions
- **Recharts** - Interactive data visualization
- **jsPDF** - PDF generation
- **html2canvas** - Chart capture for PDFs
- **React Hot Toast** - Toast notifications
- **Lucide React** - Beautiful icon library
- **Date-fns** - Date manipulation

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing

### AI Integration
- **OpenRouter API** - Unified AI model access
- **GPT-4 Turbo** - Advanced reasoning and analysis
- **Claude 3.5 Sonnet** - Fast, efficient responses
- **Dual Model Strategy** - Cost optimization through smart model selection

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- MongoDB 6 or higher
- OpenRouter API key ([Get one here](https://openrouter.ai/))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Pusri27/ai-career-advisor.git
cd ai-career-advisor
```

2. **Install server dependencies**
```bash
cd server
npm install
```

3. **Install client dependencies**
```bash
cd ../client
npm install
```

4. **Configure environment variables**

Create `.env` in the `server` directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OPENROUTER_API_KEY=your_openrouter_api_key
PORT=5001
```

Create `.env` in the `client` directory:
```env
VITE_API_URL=http://localhost:5001
```

5. **Start MongoDB**
```bash
# Make sure MongoDB is running
mongod
```

6. **Run the application**

Terminal 1 - Start the server:
```bash
cd server
npm start
```

Terminal 2 - Start the client:
```bash
cd client
npm run dev
```

7. **Open your browser**
```
http://localhost:5173
```

## 📁 Project Structure

```
ai-career-advisor/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React Context providers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   └── utils/         # Utility functions
│   └── package.json
│
├── server/                # Node.js backend
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express routes
│   ├── services/         # Business logic & AI agents
│   ├── middleware/       # Express middleware
│   ├── utils/            # Utility functions
│   └── package.json
│
└── README.md
```

## 🏗️ Architecture Highlights

### Frontend Architecture
- **Component-based Design** - Modular, reusable React components
- **Context API** - Global state management for auth and refresh
- **Custom Hooks** - `useAgent`, `useAuth`, `useRefresh` for clean logic separation
- **Service Layer** - Centralized API calls with error handling

### Backend Architecture
- **RESTful API** - Clean, predictable endpoints
- **Middleware Pattern** - Authentication, error handling, validation
- **Agent System** - Modular AI agents (Career Advisor, Job Matcher, Learning Advisor, Skill Analyzer)
- **Orchestrator Pattern** - Coordinates multiple AI agents for complex tasks

### AI Agent System
```
Orchestrator
    ├── Career Advisor (Career path recommendations)
    ├── Job Matcher (Job recommendations)
    ├── Learning Advisor (Course suggestions)
    └── Skill Analyzer (Skill gap analysis)
```

## 🎯 Core Features in Detail

### 1. Skill Assessment
- Add skills with custom proficiency levels (0-100%)
- Quick-add popular skills
- Visual proficiency indicators
- Auto-save functionality

### 2. Progress Tracking
- Interactive skill progression charts
- Historical data visualization
- Filter by time range (7, 30, 90 days, all time)
- Export progress reports as PDF

### 3. Goal Management
- Create SMART goals with deadlines
- Track progress with milestones
- Deadline warnings (urgent, due soon)
- Visual progress bars

### 4. Job Applications
- Track application status
- Manage interviews and contacts
- Application statistics dashboard
- Recent applications widget

### 5. AI Chat Assistant
- Context-aware conversations
- Career guidance and advice
- Skill recommendations
- Learning path suggestions

### 6. Learning Path
- AI-generated personalized learning paths
- Real course URLs from top platforms
- Estimated timeframes
- Learning priorities

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Secure HTTP-only cookies
- Environment variable configuration

## 🎨 UI/UX Features

- Modern, clean interface
- Smooth page transitions
- Loading skeletons for better perceived performance
- Toast notifications for user feedback
- Empty states with helpful CTAs
- Form validation with clear error messages
- Responsive design for all screen sizes

## 📊 Data Models

### User
- Profile information (name, email, role, experience)
- Skills with proficiency levels
- Career goals and preferences

### Goal
- Title, target skill, target level
- Starting level, current level
- Deadline and milestones
- Progress calculation

### Application
- Job details (title, company, location, salary)
- Status tracking
- Interview scheduling
- Notes and contacts

### Progress History
- Skill progression over time
- Historical snapshots
- Analytics data

## 🚧 Roadmap

- [x] Core features (20/20 completed)
- [x] Auto-refresh system
- [x] Form validation
- [x] PDF export
- [ ] Drag & drop Kanban board
- [ ] Application details modal
- [ ] Search and filter functionality
- [ ] Notifications system
- [ ] Unit and integration tests
- [ ] CI/CD pipeline

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Pusri27/ai-career-advisor/issues).

## 📝 License

This project is [MIT](LICENSE) licensed.

## 👤 Author

**Pusri**
- GitHub: [@Pusri27](https://github.com/Pusri27)
- Repository: [ai-career-advisor](https://github.com/Pusri27/ai-career-advisor)

## 🙏 Acknowledgments

- [OpenRouter](https://openrouter.ai/) for AI API access
- [React](https://reactjs.org/) for the amazing frontend framework
- [MongoDB](https://www.mongodb.com/) for the database solution
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Recharts](https://recharts.org/) for data visualization

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

⭐ **Star this repository if you find it helpful!**

Built with ❤️ using React, Node.js, MongoDB, and AI
