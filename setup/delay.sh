#!/bin/bash
/usr/bin/node /home/ec2-user/miaosha/setup/delay-parameter.js 25
sleep 2
pm2 restart 0
