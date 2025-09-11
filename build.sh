#!/bin/bash

# Set npm registry explicitly to avoid authentication issues
npm config set registry https://registry.npmjs.org/

# Install all dependencies including devDependencies
npm install

# Build the frontend
npm run build

# Print success message
echo "Build completed successfully!"
