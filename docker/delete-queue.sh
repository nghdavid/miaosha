#!/bin/bash
docker exec wycs_rabbitmq3.8 rabbitmqadmin delete queue name=waiting
