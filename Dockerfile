FROM node:16 AS build-env
ADD . /app
WORKDIR /app

RUN npm ci
RUN npm run build-production
WORKDIR /app/dist
RUN cp ../package*.json ./
RUN npm ci --production

FROM gcr.io/distroless/nodejs:16

WORKDIR /app
COPY --from=build-env /app/dist /app

EXPOSE 8080
CMD ["index.js"]