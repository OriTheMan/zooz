FROM node:8
RUN mkdir /app
WORKDIR /app
COPY package.json .
RUN npm install
RUN npm install sails -g
COPY . .
CMD sails lift
EXPOSE 1337