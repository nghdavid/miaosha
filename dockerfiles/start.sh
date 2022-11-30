#!/bin/bash
mkdir mysql/datadir
mkdir rabbitmq/rabbit-data
docker-compose -f ./rabbitmq/docker-compose.yml up -d
sleep 10
docker-compose -f ./docker-compose.yml up -d

