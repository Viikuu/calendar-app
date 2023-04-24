FROM node:alpine

WORKDIR /data

COPY package.json .

RUN npm i

VOLUME [ "/data" ]

EXPOSE 5173

CMD ["npm", "run", "dev"]