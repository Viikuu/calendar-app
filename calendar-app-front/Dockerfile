FROM node:alpine

WORKDIR /app

COPY package.json .

RUN npm i

VOLUME [ "/app" ]

CMD ["npm", "run", "dev"]