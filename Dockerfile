ARG BASE_IMAGE=egrupp/synthproxy:synthts-v3

# build node app as separate stage
# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
FROM $BASE_IMAGE AS build

# Install only app dependencies, to cache yarn install
COPY package.json yarn.lock ./
RUN yarn install

# bundle rest of the app source
COPY . .

# run typescript to javascript build
RUN yarn build

# remove dev packages
RUN yarn install --production

# assemble runtime image
FROM $BASE_IMAGE

COPY --from=build /app/node_modules/ /app/node_modules/
COPY --from=build /app/build /app/build/
COPY --from=build /app/swagger.yml /app/swagger.yml

EXPOSE 3382
ENV NODE_ENV production
ENV PORT 3382

USER node
CMD ["node", "build/main.js"]
