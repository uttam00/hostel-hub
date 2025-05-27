# 🏠 Hostel Management System

A modern, full-stack application for managing hostels, rooms, bookings, and reviews. Built with Next.js, Prisma, PostgreSQL, and Google Maps integration.

![Hostel Management](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-latest-blue?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-latest-blue?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-blue?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [User Roles](#user-roles)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- 🔐 **Authentication & Authorization**: Secure login with role-based access control
- 🏢 **Hostel Management**: Create, update, and manage hostel information
- 🛏️ **Room Management**: Add, edit, and manage rooms with different types
- 📅 **Booking System**: Handle room bookings with check-in/check-out dates
- 💳 **Payment Processing**: Track payments for bookings
- ⭐ **Review System**: Allow users to rate and review hostels
- 🗺️ **Location Integration**: Google Maps integration for hostel locations
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🌙 **Dark Mode**: Support for light and dark themes

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Maps**: Google Maps API
- **UI Components**: Radix UI, Shadcn UI
- **Form Handling**: React Hook Form, Zod
- **State Management**: React Hooks
- **Styling**: Tailwind CSS, CSS Modules

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/)
- [PostgreSQL](https://www.postgresql.org/) (v12 or higher)
- [Git](https://git-scm.com/)

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/hostel-management.git
   cd hostel-management
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory with the following variables (see [Environment Variables](#environment-variables) section for details).

4. **Set up the database**

   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🔑 Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY='your_google_maps_api_key'

# Google OAuth
GOOGLE_CLIENT_ID='your_google_client_id'
GOOGLE_CLIENT_SECRET='your_google_client_secret'

# NextAuth
NEXTAUTH_SECRET='your_nextauth_secret'
NEXTAUTH_URL='http://localhost:3000'

# API URL
NEXT_PUBLIC_API_URL='http://localhost:3000'

# For Sending EMAIL 
SENDGRID_API_KEY="Your_send_grid_API_key'
FROM_EMAIL=example@gmail.com

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/hostel_management?schema=public"

# JWT
JWT_SECRET='your_jwt_secret'
```

> ⚠️ **Important**: Never commit your `.env` file to version control. It's already included in the `.gitignore` file.

## 🗄️ Database Setup

The application uses PostgreSQL with Prisma ORM. Follow these steps to set up the database:

1. **Create a PostgreSQL database**

   ```bash
   createdb hostel_management
   ```

2. **Run migrations**

   ```bash
   npx prisma migrate dev
   ```

3. **Seed the database with initial data**

   ```bash
   npx prisma db seed
   ```

## 🖥️ Running the Application

- **Development mode**

  ```bash
  npm run dev
  # or
  yarn dev
  # or
  pnpm dev
  ```

- **Production build**

  ```bash
  npm run build
  npm start
  # or
  yarn build
  yarn start
  # or
  pnpm build
  pnpm start
  ```

## 👥 User Roles

The application has three user roles:

- **Student**: Can browse hostels, make bookings, and leave reviews
- **Hostel Admin**: Can manage their hostel, rooms, and bookings
- **Super Admin**: Can manage all hostels, users, and system settings

## 📁 Project Structure

```
hostel-management/
├── app/                  # Next.js app directory
│   ├── api/              # API routes
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # Dashboard pages
│   ├── hostels/          # Hostel listing and details
│   ├── admin/            # Admin dashboard
│   ├── hostel-admin/     # Hostel admin dashboard
│   └── super-admin/      # Super admin dashboard
├── components/           # React components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and libraries
├── prisma/               # Prisma schema and migrations
├── public/               # Static assets
├── services/             # API service functions
├── styles/               # Global styles
└── types/                # TypeScript type definitions
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Issues**

   - Ensure PostgreSQL is running
   - Check your database credentials in the `.env` file
   - Verify the database exists

2. **Google Maps Not Loading**

   - Check your Google Maps API key in the `.env` file
   - Ensure the API key has the necessary permissions
   - Check browser console for errors

3. **Authentication Issues**

   - Verify your Google OAuth credentials
   - Check NextAuth configuration
   - Ensure cookies are enabled in your browser

### Getting Help

If you encounter any issues not covered here, please:

1. Check the console logs for error messages
2. Search for similar issues in the project repository
3. Open a new issue with detailed information about the problem

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Made with ❤️ by [Uttam Danidhariya]
