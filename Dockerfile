FROM node:20.4.0-alpine AS development

WORKDIR /usr/src/app

EXPOSE 3000


FROM node:20.4.0-alpine as production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main"]
