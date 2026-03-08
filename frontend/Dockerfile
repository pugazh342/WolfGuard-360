# Use Node 20 to satisfy Vite's requirements
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Expose Vite's default port
EXPOSE 5173

# Start the Vite development server and expose it to the local network
CMD ["npm", "run", "dev", "--", "--host"]