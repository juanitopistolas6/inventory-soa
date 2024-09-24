FROM node:20.16-alpine

WORKDIR /app/order

COPY ./package*.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3002

CMD [ "npm", "run", "start:dev" ]