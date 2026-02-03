FROM node:24.13.0

WORKDIR /app

COPY nextjs/package.json nextjs/package-lock.json* ./
RUN npm install

COPY nextjs/ .

EXPOSE 3000

CMD ["npm", "run", "dev"]

