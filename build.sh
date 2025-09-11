#!/bin/bash

# Set npm registry explicitly to avoid authentication issues
npm config set registry https://registry.npmjs.org/

# Clean npm cache
npm cache clean --force

# Install all dependencies for building
npm install

# Build the frontend
npm run build

# Prepare for production
echo "Preparing for production deployment..."

# Copy server.js to dist directory
cp server.js dist/

# Create production package.json in dist directory
cat > dist/package.json << EOF
{
  "name": "mariage-marius",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "engines": {
    "node": ">=18.0.0 <20.0.0"
  },
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^5.1.0",
    "socket.io": "^4.8.1"
  }
}
EOF

# Install production dependencies in dist directory
cd dist
npm install --production
cd ..

# Print success message
echo "Build completed successfully!"
