FROM node:20.16-alpine

WORKDIR /app/customer

COPY ./package*.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3001

CMD [ "npm", "run", "start:dev" ]