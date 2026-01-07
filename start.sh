#!/bin/bash

echo "================================================"
echo "  ATI Nawalapitiya Campus Management System"
echo "================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✓ Node.js version: $(node -v)"

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null
then
    echo "⚠️  MongoDB is not running."
    echo "Starting MongoDB..."
    sudo systemctl start mongod 2>/dev/null || mongod --fork --logpath /var/log/mongodb.log 2>/dev/null
    sleep 2
fi

if pgrep -x "mongod" > /dev/null
then
    echo "✓ MongoDB is running"
else
    echo "❌ Failed to start MongoDB. Please start it manually."
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo ""
    echo "📦 Installing backend dependencies..."
    npm install
fi

if [ ! -d "frontend/node_modules" ]; then
    echo ""
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
fi

echo ""
echo "✓ All dependencies installed"

# Ask if user wants to seed the database
echo ""
read -p "Do you want to seed the database with sample data? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "🌱 Seeding database..."
    node backend/scripts/seed.js
fi

echo ""
echo "================================================"
echo "  Starting Application"
echo "================================================"
echo ""
echo "Backend will run on: http://localhost:5000"
echo "Frontend will run on: http://localhost:3000"
echo ""
echo "Default admin credentials:"
echo "  Email: admin@ati.lk"
echo "  Password: admin123"
echo ""
echo "Press Ctrl+C to stop the servers"
echo ""
echo "================================================"
echo ""

# Start both servers
npm run dev-all
