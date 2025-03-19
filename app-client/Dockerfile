# Use an official Node.js runtime as a parent image
FROM node:23-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json files to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the entire app directory to the working directory
COPY . .

# Build the app for production
RUN npx react-native bundle --platform ios --dev false --entry-file node_modules/expo-router/entry.js --bundle-output ios/main.jsbundle --assets-dest ios/assets
RUN npx react-native bundle --platform android --dev false --entry-file node_modules/expo-router/entry.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

# Expose port 8080 for the React Native packager
EXPOSE 8080

# Start the app
CMD ["npx", "expo", "start"]