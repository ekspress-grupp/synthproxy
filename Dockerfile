ARG SYNTHTS_IMAGE=egrupp/synthproxy:synthts-v2
ARG NODE_IMAGE=node:8-stretch

# create alias to refer it in runtime image
FROM $SYNTHTS_IMAGE AS synthts

# build node app as separate stage
# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
FROM $NODE_IMAGE AS build

WORKDIR /app

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
FROM $NODE_IMAGE

# install ffmpeg
RUN apt-get update \
 && apt-get install -y ffmpeg \
 && apt-get clean

WORKDIR /app
COPY --from=synthts /usr/share/synthts/ /usr/share/synthts/
COPY --from=synthts /usr/bin/synthts_et /usr/bin
COPY --from=build /app/node_modules/ /app/node_modules/
COPY --from=build /app/build /app/build/

EXPOSE 3382
ENV NODE_ENV production
ENV PORT 3382

USER node
CMD ["node", "build/main.js"]