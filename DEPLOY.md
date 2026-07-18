# Deployment Guide for Project Res

Follow these steps to deploy the application to Render.

## Step 1: Clone the repository
```bash
git clone https://github.com/yourusername/res.git
cd res
```

## Step 2: Create .env file
Copy the example environment variables:
```bash
cp .env.example .env
# Edit .env file and add your MongoDB connection string
```

## Step 3: Deploy using Docker
Make sure Docker is installed, then run the following commands:
```bash
docker-compose build  # Build the Docker images
docker-compose up -d   # Start the services in detached mode
```

## Step 4: Access your application
Once all services are up, you can access your application at http://localhost:3000.