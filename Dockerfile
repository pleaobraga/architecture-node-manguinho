FROM node:current

WORKDIR /usr/src/clean-node-api

COPY package.json ./

RUN npm install


