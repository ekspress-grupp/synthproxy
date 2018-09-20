FROM node:8-alpine AS build

WORKDIR /app
COPY . /app
RUN yarn install --production
RUN rm yarn.lock .yarnrc

FROM node:8-alpine

WORKDIR /app
COPY --from=build /app /app

EXPOSE 3000

ENV NODE_ENV production
ENV PORT 3000

USER node

CMD ["node", "build/main.js"]
