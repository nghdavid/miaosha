#!/bin/bash
YEAR=`date +"%Y"`
MONTH=`date +"%m"`
DATE=`date +"%d"`
HOUR=`date +"%H"`
MINUTE=`date +"%M"`
SECOND=`date +"%S"`
echo Current YEAR is: ${YEAR}
echo Current MONTH is: ${MONTH}
echo Current DATE is: ${DATE}
#echo Current HOUR is: ${HOUR}
#echo Current MINUTE is: ${MINUTE}
#echo Current SECOND is: ${SECOND}
#node ./set-parameter.js ${YEAR} ${MONTH} ${DATE} ${HOUR} ${MINUTE} ${SECOND}
/usr/bin/node /home/ec2-user/miaosha/setup/set-parameter.js ${YEAR} ${MONTH} ${DATE} 9 30 0