#!/bin/bash
docker-compose -f ./rabbitmq/docker-compose.yml down
docker-compose -f ./docker-compose.yml down

