FROM node:16-alpine

#RUN echo ${env_DATE}

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
#CMD ["node", "setup/set-parameter.js", "2022" , "11", "30", "18", "30"]
#CMD ["node", "setup/set-parameter.js", "${env_YEAR}" , "${env_MONTH}", "env_DATE", "env_HOUR", "env_MINUTE"]
CMD ["node", "setup/docker-set-parameter.js"]