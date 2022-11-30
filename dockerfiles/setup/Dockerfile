FROM node:16-alpine
ARG YEAR
ARG MONTH
ARG DATE
ARG HOUR
ARG MINUTE
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
#CMD ["node", "setup/set-parameter.js", "2022" , "11", "30", "17", "30"]
CMD ["node", "setup/set-parameter.js", ${YEAR} , ${MONTH}, ${DATE}, ${HOUR}, ${MINUTE}]