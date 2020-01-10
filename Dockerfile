FROM node:12.4.0-alpine

ENV PORT 4000
ENV HTTP_AUTH_USER logger
ENV HTTP_AUTH_PASSWORD rt4241gg

RUN /bin/sh -c "apk add --no-cache bash nano"
RUN mkdir -p /logger/src
COPY package.json /logger
COPY ./src /logger/src/
WORKDIR /logger
RUN npm i && npm i -g ts-node
RUN npm install -g ts-node-dev typescript pm2
CMD npm run start-dev