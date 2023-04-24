FROM node:alpine

WORKDIR /data

COPY package.json .

RUN npm i

VOLUME [ "/data" ]

EXPOSE 8000

CMD ["npm", "run", "dev"]