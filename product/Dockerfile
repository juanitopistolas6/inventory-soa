FROM node:20.16-alpine

WORKDIR /app/product

COPY ./package*.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3003

CMD [ "npm", "run", "start:dev" ]