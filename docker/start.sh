#!/bin/bash
ip=$(ipconfig getifaddr en0) docker-compose -f ~/Desktop/redis-cluster/docker-compose.yml up -d --build
#redis-server --daemonize yes
# docker run -d --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.10-management
docker-compose -f ~/Desktop/phpMyAdmin/docker-compose.yml up -d
docker-compose -f ~/Desktop/rabbitmq/docker-compose.yml up -d