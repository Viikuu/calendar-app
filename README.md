# Calendar-App

This is a Calendar application built with Node.js, Fastify, React with TypeScript, and Docker Compose.

The Calendar App provides users with a smooth UI created in React.ts with vite bundler. Api is created in fastify.js using MongoDB and everything is wrapped in Dockerfiles and docker-compose.yaml for fast enviroment creation.

This app is live on [cloud hosting](http://67.207.75.222/)

## Technologies

![Fastify](https://img.shields.io/badge/-Fastify-000?logo=fastify) ![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript) ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript) ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js) ![React](https://img.shields.io/badge/-React-61DAFB?logo=react) ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?logo=mongodb) ![Docker](https://img.shields.io/badge/-Docker-2496ED?logo=docker) ![Docker Compose](https://img.shields.io/badge/-Docker%20Compose-2496ED?logo=docker)

## Features

- User Authorization and Authentication using JWT token provided in http only cookies
- Day event REST api which provides fully operational CRUD
- Navigate through different months
- Click on individual days to view activity details
- Dockerized deployment using Docker Compose

## Prerequisites

Make sure you have the following dependencies installed on your machine:

- Docker: [https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/)
- Docker Compose: [https://docs.docker.com/compose/install](https://docs.docker.com/compose/install)

## Getting Started

To run the Calendar App locally, follow these steps:

1. Clone this repository: `git clone https://github.com/Viikuu/calendar-app.git`
2. Navigate to the project directory: `cd calendar-app`
3. Start the application using Docker Compose: `docker-compose up`
4. Access the application in your browser at: `http://localhost:80`

## Project Structure

The project structure is as follows:

```
calendar-app
├── calendar-app-front
│ └── ...
├── calendar-app-backend
│ └── ...
├── docker-compose.yml
├── .gitignore
└── README.md
```

- The `calendar-app-front` directory contains the client-side React with TypeScript application.
- The `calendar-app-backend` directory contains the server-side Fastify application.
- The `docker-compose.yml` file defines the Docker Compose configuration for running the application.

Thank you for checking out the Calendar App!
