FROM node:18-alpine

WORKDIR /app

# Копирование package.json и установка зависимостей
COPY package*.json ./
RUN npm install

# Копирование остального кода
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
