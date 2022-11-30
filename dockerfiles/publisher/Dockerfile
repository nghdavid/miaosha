FROM node:16-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
COPY wait-for-it.sh ./wait-for-it.sh
RUN chmod +x wait-for-it.sh
RUN echo "I am in the building process"
RUN ls -l /
# CMD ["./wait-for-it.sh", "localhost:5672", "--", "node", "server.js"]
CMD ["node", "consumer-server.js"]
