FROM node:12.19.0-alpine3.9 AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000
RUN npm test

RUN npm run build

FROM node:12.19.0-alpine3.9 as production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main"]
