# ---- Base Node ----
FROM node:20 AS base
WORKDIR /app

 
COPY package.json ./
RUN npm install


COPY . /app
EXPOSE 5000
CMD ["npm", "start"]

