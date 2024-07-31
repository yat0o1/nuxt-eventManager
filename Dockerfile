FROM node:20.14.0

ENV HOST 0.0.0.0

EXPOSE 3000

WORKDIR /web

COPY ./package*.json .

RUN npm install

COPY . .

CMD [ "npm","run","dev" ]