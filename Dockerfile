FROM node:20.14.0

WORKDIR /web

COPY package*.json ./

RUN npm install -g npm@latest
RUN rm -rf node_modules package-lock.json
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]