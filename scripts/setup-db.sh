#!/bin/bash

# Exit on error
set -e

echo "🔧 Setting up PostgreSQL database..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
  echo "❌ PostgreSQL is not installed. Please install it first."
  echo "   On Ubuntu/Debian: sudo apt-get install postgresql postgresql-contrib"
  exit 1
fi

# Check if PostgreSQL service is running
if ! pg_isready -h localhost -p 5432 &> /dev/null; then
  echo "⚠️ PostgreSQL service is not running. Starting it..."
  sudo service postgresql start
  sleep 2
fi

# Create database and user if they don't exist
echo "📦 Creating database and user..."
sudo -u postgres psql -c "CREATE USER postgres WITH PASSWORD 'postgres' CREATEDB;" || true
sudo -u postgres psql -c "CREATE DATABASE hostel_management OWNER postgres;" || true

# Run Prisma migrations
echo "🔄 Running Prisma migrations..."
npx prisma migrate reset --force

# Run seed script
echo "🌱 Seeding database..."
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts

echo "✅ Database setup completed!" 