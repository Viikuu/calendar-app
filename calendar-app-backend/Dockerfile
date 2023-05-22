FROM node:alpine

WORKDIR /data

COPY package.json .

RUN npm i

VOLUME [ "/data" ]

CMD ["npm", "run", "start:dev"]