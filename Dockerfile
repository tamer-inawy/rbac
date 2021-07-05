FROM node:12.19.0-alpine3.9 AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY . .

RUN npm run build

CMD ["node", "dist/main"]
