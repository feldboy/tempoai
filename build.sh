#!/bin/bash

# Build the project
npm run build

# Create a dist directory if it doesn't exist
mkdir -p dist

# Copy the index.html to 404.html for client-side routing
cp dist/index.html dist/404.html
