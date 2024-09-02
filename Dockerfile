# Use a specific Node.js version for consistency
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy only package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy .env file
# COPY .env ./

# Copy prisma folder
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Expose the application port
EXPOSE 8000

# Define the command to run the application
CMD ["npm", "start"]
