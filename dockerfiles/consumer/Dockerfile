FROM node:16-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4000
COPY wait-for-it.sh ./wait-for-it.sh
RUN chmod +x wait-for-it.sh
#CMD ["./wait-for-it.sh", "localhost:5672", "--", "node", "consumer-server.js"]
CMD ["node", "consumer-server.js"]