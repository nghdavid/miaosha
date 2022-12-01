FROM node:16-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
# For Production
EXPOSE 3000
CMD ["node", "general-app.js"]