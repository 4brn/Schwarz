FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

RUN npm run build

CMD [ "npm", "run", "preview" ]
