FROM node:20
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm ci --silent
COPY . .
RUN npm run build
EXPOSE 4000
CMD ["node", "dist/index.js"]