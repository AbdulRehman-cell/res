# Deployment Guide for Res App

This guide will help you deploy the Res application in under 5 minutes.

## Prerequisites
1. Install Docker: [Get Docker](https://docs.docker.com/get-docker/)
2. Install Docker Compose: [Get Docker Compose](https://docs.docker.com/compose/install/)
3. An account on Render with the Render CLI installed: [Render Docs](https://render.com/docs/deploy-nodejs)

## Step-by-Step Deployment

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your_username/res.git
   cd res
   ```

2. **Create a `.env` file:**
   Copy `.env.example` to `.env` and fill in the MongoDB URI.
   ```bash
   cp .env.example .env
   ```

3. **Build the Docker image:**
   Make sure you are in the project directory, and run:
   ```bash
   docker-compose up --build -d
   ```

4. **Deploy to Render:**
   If you have Render CLI set up, use the following command:
   ```bash
   npx render-cli deploy
   ```

5. **Check application health:**
   Access `http://localhost:3000/health` to ensure the application is running properly.