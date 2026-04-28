#!/bin/bash

# Function to run Django server
run_back() {
    cd backend
    npm run start
}

# Function to run React frontend
run_front() {
    cd frontend
    npm run start
}

# Check the argument and run the appropriate function
if [ "$1" = "back" ]; then
    run_back
elif [ "$1" = "front" ]; then
    run_front
else
    echo "Usage: $0 [back|front]"
    exit 1
fi