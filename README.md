# Feedback Automation Platform

A comprehensive feedback automation platform designed to help small businesses collect, analyze, and act on customer insights efficiently.

## Features
- Automated feedback collection with sentiment analysis
- Customizable survey templates
- PostgreSQL-backed data storage with flexible feedback management
- Multi-dimensional feedback tracking and reporting
- Responsive design with intuitive user interface

## Tech Stack
- **Frontend**: React, TypeScript, Vite, Shadcn UI, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Other**: Natural.js for sentiment analysis

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

3. Create a PostgreSQL database and update the `DATABASE_URL` in your environment variables:
   ```
   DATABASE_URL=postgres://username:password@localhost:5432/feedback_db
   ```

4. Push the database schema:
   ```
   npm run db:push
   ```

5. Start the development server:
   ```
   npm run dev
   ```

6. Access the application at `http://localhost:5000`

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: (Optional) Port for the server (defaults to 5000)

## Project Structure

- `/client`: Frontend React application
- `/server`: Backend Express application
- `/shared`: Shared code including database schema