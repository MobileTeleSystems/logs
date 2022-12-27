FROM node:17-alpine AS build

WORKDIR /app

COPY package*.json tsconfig*.json nest-cli.json ./
RUN npm ci

COPY ./src ./src
COPY ./test ./test

# RUN npm run test
RUN npm run build


FROM node:17-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

CMD ["node", "dist/main"]
