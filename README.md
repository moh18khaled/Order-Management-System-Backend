# Order Management System (OMS) for E-commerce Mobile App

## Overview

The Order Management System (OMS) is a backend API system designed for an E-commerce Mobile App, built using NestJS and Prisma. It provides functionalities to add products to a cart, view and update the cart, create orders, update order statuses, and retrieve order details.

## Prerequisites

Before setting up the Order Management System, ensure you have the following prerequisites installed on your system:

1. **Node.js and npm**: Ensure Node.js (version 10 or higher) and npm (Node Package Manager) are installed.
   - [Node.js Installation Guide](https://nodejs.org/)
   
2. **Git**: Install Git to clone the project repository from GitHub.
   - [Git Installation Guide](https://git-scm.com/)
   
3. **Database**: PostgreSQL should be installed and running.
   - [PostgreSQL Installation Guide](https://www.postgresql.org/)
   
4. **NestJS CLI**: Install the NestJS Command Line Interface (CLI) globally.
   - Install using npm:
     ```bash
     npm install -g @nestjs/cli
     ```
   - [NestJS CLI Documentation](https://docs.nestjs.com/cli/overview)
   
5. **Prisma**: Prisma is used for database access. Install Prisma and the Prisma Client.
   - Install Prisma globally:
     ```bash
     npm install -g prisma
     ```
   - Initialize Prisma in your project:
     ```bash
     npx prisma init
     ```
   - Install Prisma Client in your project:
     ```bash
     npm install @prisma/client
     ```
   - [Prisma Documentation](https://www.prisma.io/docs/)


## Database Migration

To manage database schema changes, use Prisma migrations:

```bash
npx prisma migrate dev --name init
```

## Start the Application

```bash
$ npm run start:prod
```

## Manual Testing

using Postman and testing folder

## API Documentation

For detailed API documentation and endpoints, refer to [Postman API Documentation](https://documenter.getpostman.com/view/36480709/2sA3e2e8hn).



