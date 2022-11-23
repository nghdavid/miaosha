#!/bin/bash
docker exec wycs_rabbitmq3.8 rabbitmqadmin delete queue name=waiting
docker exec wycs_rabbitmq3.8 rabbitmqadmin delete queue name=check_payment
docker exec wycs_rabbitmq3.8 rabbitmqadmin delete queue name=people_queue
docker exec wycs_rabbitmq3.8 rabbitmqadmin delete exchange name=people_queue
docker exec wycs_rabbitmq3.8 rabbitmqadmin delete exchange name=check_payment


