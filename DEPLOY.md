# Deployment Guide for Res Application

This guide will help you deploy the Res application on Render in under 5 minutes.

## Prerequisites

- Node.js installed (make sure it's version 18 or higher)
- Docker and Docker Compose installed
- Render account

## Step-by-Step Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Set up environment variables**:
   Copy the `.env.example` to `.env` and configure values as needed.
   ```bash
   cp .env.example .env
   ```

3. **Build the Docker image**:
   ```bash
   docker-compose build
   ```

4. **Run the application locally to verify**:
   ```bash
   docker-compose up
   ```
   Visit `http://localhost:3000` to ensure it's running correctly.

5. **Deploy to Render**:
   Commit your changes and push to `main`:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

You should now see the deployment on Render automatically begin.