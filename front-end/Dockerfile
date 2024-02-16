# ---- Base Node ----
FROM node:20 AS base
WORKDIR /app

COPY package.json ./
RUN npm install


COPY . /app

EXPOSE 3000
CMD ["npm", "start"]

