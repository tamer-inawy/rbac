FROM node:12.19.0-alpine3.9 AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY . .

RUN npm run build

FROM node:12.19.0-alpine3.9 as production

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install --production=true

COPY . .

COPY --from=build /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
