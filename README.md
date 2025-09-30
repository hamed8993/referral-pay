# NestJS Backend System - Advanced Financial Platform

A sophisticated backend system built with NestJS featuring multi-role authentication, referral system, real-time notifications, and queue-based email services.

## 🚀 Core Features

- **Authentication & Authorization**: JWT-based auth with Passport.js and role-based access control
- **Referral System**: Complete referral code management with hierarchical user relationships
- **Transaction Management**: Secure transaction processing with admin approval workflow
- **Queue System**: BullMQ-powered background jobs for email processing
- **Real-time Notifications**: Instant email alerts for transaction approvals
- **Automated Reporting**: Daily cron jobs for financial reports
- **Email Service**: Template-based email system with queue management

## 🛠 Tech Stack

- **Framework**: NestJS with TypeScript
- **Database**: MySQL with TypeORM
- **Authentication**: Passport.js + JWT
- **Queue**: BullMQ with Redis
- **Email**: Nodemailer with templates
- **Scheduling**: NestJS Cron jobs
- **Validation**: Class Validator & Transformer
