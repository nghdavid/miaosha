# miaosha
Miaosha is a product-selling website which can handle the traffic from a million of users. My backend system can reach 20,000 QPS with 8 t3.nano instances and maintain 300,000 WebSocket connections with 6 t3a.small instances.

- Website Link: https://miaosha.click/
- Explanation Video: https://drive.google.com/file/d/1Y3m75dhT6n5ikO_NZSxNYeaZeiIZEPPO/view?usp=sharing

## Login

- email: demo@test.com
- password: demodemo

## Table of Contents

- [Main Features](#main-features)
- [Backend Technique](#backend-technique)
  - [Infrastructure](#infrastructure)
  - [Environment](#environment)
  - [Database](#database)
  - [Cloud Services](#cloud-services)
  - [Networking](#networking)
  - [Test](#test)
  - [Third Party Library](#third-party-library)
  - [Version Control](#version-control)
  - [Key Points](#key-points)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [Frontend Technique](#frontend-technique)
  - [React (hook)](#react-hook)
  - [React Router](#react-router)
  - [Redux (redux-toolkit)](#redux-redux-toolkit)
  - [Tailwind CSS, Tailwind UI](#tailwind-css-tailwind-ui)
  - [Third-Party Modules](#third-party-library-1)
  - [Cloud Services](#cloud-services-1)
- [API Doc](#api-doc)
- [Contact](#contact)

## Main Features

- Actively informed users with WebSocket instead of short polling to decrease API requests
- Improved API efficiency by processing asynchronously with RabbitMQ
- Use socket.io for real time co-editing.
- Achieved high concurrency with distributed system including Publisher, Consumer, MySQL read replica, and Redis cluster
- Routed high traffic API and general API to different EC2 target groups with Elastic Load Balancer to ensure the stability of other API
- Prevent overselling with atomic operation in Redis and short-TTL JWT
- Sent emails asynchronously with SQS and Lambda
- Complete queuing system with RabbitMQ (Dead letter exchange)
- Used EventBridge to schedule Lambda to start EC2 before each event
- Prevented malicious attacks using Nginx’s rate limiter
- Applied CloudFront as CDN to reduce bandwidth loading and latency
- Packaged Miaosha system in Docker Compose as development environment, including Node.js, MySQL, Redis cluster, RabbitMQ, and phpMyAdmin
- Continuously deployed with GitHub Actions and Docker Hub
- Performed unit test and integration test by Jest and Supertest


## Backend Technique

### Environment

- Node.js/Express
- WebSocket (Socket.IO)
- PM2

### Server
- EC2
- Elastic Load Balancer
- Auto scaling
### Web server
- Nginx

### Serverless
- Lambda
- EventBridge

### Database

- RDS (MySQL) with read replica
- phpMyAdmin

### Cache
- ElastiCache (Redis cluster)

### Message Broker
- RabbitMQ

### Container
- Docker
- Docker Compose

### Continuous delivery
- GitHub Action
- Docker Hub

### CDN
- CloudFront

### Others
- S3
- Route53

### Test
- Unit test: Jest, Supertest

## System design

## Architecture
- Server Architecture

## Database Schema
## How to prevent overselling
Tools: Redis, JWT token

- Use atomic operation in redis to prevent race condition
- Prevent .......

## Send email asynchronously
When an user successfully checks out, checkout API 
would send email and user id to SQS. After that, SQS would trigger Lambda to send email.


## How to prevent robot attack
## Decrease API response time with asynchronous processing

## How to ensure the stability of other API (login, checkout) when selling event starts?
When flash sale happens, a huge influx would flow into the backend system and may influence other APIs. However, elastic load balancer would route different APIs to different target groups. Miaosha API would be routed to publisher target group. Thus, consumer and general target group would not be influenced by miaosha API.

## Queuing System

- Limit the number of people visiting the event selling page to prevent server crashes.
- Apply "queuing psychology" and calculate the estimated waiting time for each user by using **WebSocket** and **Redis** List & Hash.

### How do I implement the queuing system?

Tool: Redis (List & Hash)

1. Use List to record the order of people entering ticket selling page.
2. Use Hash to record the timestamp of each user entering the ticket selling page.
3. If the number of people inside the page reaches the limit, another list will record the queuing order.
4. There is a 10-minute time limit for the purchasing process. Use the index to find the corresponding user that each queuing user should wait for and calculate the estimated waiting time.

## Queuing System

## Continuous Deployment

## Load Test
Concert ticket selling website must be capable of handling high traffic.

I use WebSocket to confirm if a user is still on the page or in the queue, so I implemented a load test to check the max socket connections with both horizontal and vertical scaling and compared two scaling results & costs.

Code: https://github.com/Claudia-teng/ticket-club-load-test/blob/main/connection-time.js

### Horizontal Scaling

### Vertical Scaling

## How to start 

## Future Features
