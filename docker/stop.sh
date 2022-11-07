#!/bin/bash
ip=$(ipconfig getifaddr en0) docker-compose -f ~/Desktop/redis-cluster/docker-compose.yml down
redis-cli shutdown
docker stop rabbitmq
docker-compose -f ~/Desktop/phpMyAdmin/docker-compose.yml down