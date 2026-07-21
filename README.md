# 🚜 AgriSmart

**AgriSmart** is a full-stack web application designed to empower farmers with intelligent tools for crop management, disease detection, weather forecasting, and market analytics. Built with modern technologies, it provides a comprehensive platform connecting farmers and buyers in a sustainable agricultural ecosystem.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Core Functionalities
- **👤 User Management**: Role-based authentication (Farmer & Buyer roles) with secure JWT-based sessions
- **🌾 Crop Management**: Track crop details including planting dates, expected harvest, area, and location
- **🌤️ Weather Forecasting**: Real-time weather updates and forecasts for agricultural planning
- **🔍 Disease Detection**: AI-powered crop disease detection and recommendations using Google Gemini API
- **📊 Analytics Dashboard**: Comprehensive analytics and insights on crop health, market trends, and yield predictions
- **👨‍🌾 Farmer Profile**: Detailed farmer profiles with contact information and crop history
- **💼 Buyer Marketplace**: Connect farmers and buyers for direct trading

### Advanced Features
- **📈 Visual Analytics**: Interactive charts and graphs for crop performance tracking
- **🖼️ Image Upload**: Support for crop images and documentation (via Cloudinary)
- **🔒 Secure Authentication**: BCrypt password hashing and JWT token-based authorization
- **🌐 CORS Enabled**: Secure cross-origin requests for frontend-backend communication
- **📱 Responsive UI**: Modern, user-friendly interface built with React and Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **React 19.2** - UI library
- **Vite 8.1** - Build tool and dev server
- **Tailwind CSS 4.3** - Utility-first CSS framework
- **React Router DOM 7.18** - Client-side routing
- **Chart.js & Recharts** - Data visualization
- **Axios** - HTTP client for API calls
- **React Hook Form** - Form state management
- **Framer Motion** - Animation library
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express 5.2** - Web framework
- **MongoDB & Mongoose 9.7** - NoSQL database and ODM
- **JWT** - Authentication and authorization
- **Bcryptjs** - Password hashing
- **Cloudinary** - Image storage and management
- **Google GenAI SDK** - AI-powered disease detection
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger
- **Dotenv** - Environment configuration

## 📁 Project Structure

```
AgriSmart/
├── client/                    # React frontend application
│   ├── src/                   # Source files
│   ├── public/                # Static assets
│   ├── index.html             # Entry HTML file
│   ├── package.json           # Frontend dependencies
│   └── vite.config.js         # Vite configuration
│
├── server/                    # Express backend application
│   ├── controllers/           # Request handlers
│   ├── models/                # MongoDB schemas (User, Crop)
│   ├── routes/                # API routes
│   │   ├── authRoutes.js      # Authentication endpoints
│   │   ├── userRoutes.js      # User management endpoints
│   │   ├── cropRoutes.js      # Crop management endpoints
│   │   ├── weatherRoutes.js   # Weather data endpoints
│   │   ├── analyticsRoutes.js # Analytics endpoints
│   │   ├── profileRoutes.js   # Farmer profile endpoints
│   │   └── diseaseRoutes.js   # Disease detection endpoints
│   ├── middleware/            # Custom middleware
│   ├── config/                # Configuration files
│   ├── app.js                 # Express app setup
│   ├── server.js              # Server entry point
│   ├── package.json           # Backend dependencies
│   └── testGemini.js          # Gemini API testing script
│
├── .gitignore                 # Git ignore rules
└── README.md                  # Project documentation
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas account)
- **Git**

### Required API Keys/Services
- **Google Gemini API** - For AI-powered disease detection
- **Cloudinary** - For image storage and management
- **MongoDB Atlas** - For cloud database (or local MongoDB)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/AshishKakade2006/AgriSmart.git
cd AgriSmart
```

### 2. Install Server Dependencies

```bash
cd server
npm install
```

### 3. Install Client Dependencies

```bash
cd ../client
npm install
```

## ⚙️ Configuration

### Backend Configuration

1. Create a `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agrismart

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

2. Update `config/` files if needed for database connection and other services.

### Frontend Configuration

1. Create a `.env` file in the `client/` directory (optional):

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

2. The frontend will communicate with the backend API at `http://localhost:5000` by default.

## 🏃 Running the Application

### Development Mode

#### Terminal 1 - Start Backend Server

```bash
cd server
npm run dev
```

The backend server will start at `http://localhost:5000`

#### Terminal 2 - Start Frontend Dev Server

```bash
cd client
npm run dev
```

The frontend will start at `http://localhost:5173`

### Production Mode

#### Build Frontend

```bash
cd client
npm run build
```

#### Start Backend

```bash
cd server
npm start
```

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - User login
- `POST /logout` - User logout
- `POST /refresh-token` - Refresh JWT token

### User Routes (`/api/user`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `GET /all` - Get all users (admin)
- `DELETE /:id` - Delete user (admin)

### Crop Routes (`/api/crops`)
- `GET /` - Get all crops
- `GET /:id` - Get crop details
- `POST /` - Create new crop
- `PUT /:id` - Update crop
- `DELETE /:id` - Delete crop

### Weather Routes (`/api/weather`)
- `GET /forecast` - Get weather forecast
- `GET /current` - Get current weather

### Analytics Routes (`/api/analytics`)
- `GET /dashboard` - Get analytics dashboard data
- `GET /yield-prediction` - Get crop yield predictions
- `GET /market-trends` - Get market trend analysis

### Profile Routes (`/api/profile`)
- `GET /farmer/:id` - Get farmer profile
- `PUT /farmer/:id` - Update farmer profile

### Disease Detection Routes (`/api/disease`)
- `POST /detect` - Detect crop diseases from image
- `GET /recommendations/:diseaseId` - Get treatment recommendations

## 🔐 Environment Variables

Key environment variables used in the project:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/agrismart` |
| `JWT_SECRET` | Secret key for JWT signing | Random string |
| `PORT` | Server port | `5000` |
| `GEMINI_API_KEY` | Google Gemini API key | Your API key |
| `CLOUDINARY_*` | Cloudinary credentials | API keys |
| `FRONTEND_URL` | Frontend application URL | `http://localhost:5173` |

## 👨‍💻 Development

### Code Standards
- Frontend: React best practices, Tailwind CSS for styling
- Backend: Express.js conventions, async/await for database operations
- Use meaningful variable and function names
- Add comments for complex logic

### Linting
- Frontend: Run `npm run lint` in the client directory to check code quality

### Testing
- Backend: Includes `testGemini.js` for testing AI API integration

## 🤝 Contributing

1. Create a new feature branch: `git checkout -b feature/your-feature`
2. Commit your changes: `git commit -m 'Add your feature'`
3. Push to the branch: `git push origin feature/your-feature`
4. Submit a pull request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🌐 Live Demo

The application is deployed and available at:
- **Frontend**: https://agri-smart-self.vercel.app
- **Backend**: Configured for production endpoints

## 📞 Support & Contact

For issues, feature requests, or contributions, please visit the [GitHub repository](https://github.com/AshishKakade2006/AgriSmart).

---

**Happy Farming! 🌾** 

Built with ❤️ for sustainable agriculture.
