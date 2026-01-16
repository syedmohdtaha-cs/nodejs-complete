#!/bin/bash

echo "Starting Case Management System..."
echo "=================================="
echo ""

# Start backend server
echo "Starting Backend Server on port 4000..."
cd /Users/i1545/learning/nodejs-complete
npm start &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo ""
echo "Starting Frontend React App..."
cd /Users/i1545/learning/nodejs-complete/client
npm start &
FRONTEND_PID=$!

echo ""
echo "=================================="
echo "✅ Case Management System is running!"
echo ""
echo "Backend API: http://localhost:4000"
echo "Frontend UI: http://localhost:3002"
echo ""
echo "Press Ctrl+C to stop both servers"
echo "=================================="

# Wait for user to stop
wait $BACKEND_PID $FRONTEND_PID

