ARG SYNTHTS_IMAGE=egrupp/synthproxy:synthts-v1
ARG NODE_IMAGE=node:8-stretch

# create alias to refer it in runtime image
FROM $SYNTHTS_IMAGE AS synthts

# build node app as separate stage
# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
FROM $NODE_IMAGE AS build

WORKDIR /app

# copy app code
COPY  . /app

# run node install
RUN yarn install

# run typescript to javascript build
RUN yarn build

# remove dev packages
RUN yarn install --production

# assemble runtime image
FROM $NODE_IMAGE

WORKDIR /app
COPY --from=synthts /usr/bin/synthts_et /usr/bin
COPY --from=build /app/build /app/build
COPY --from=build /app/node_modules /app/node_modules

EXPOSE 3000
ENV NODE_ENV production
ENV PORT 3000

USER node
CMD ["node", "build/main.js"]
