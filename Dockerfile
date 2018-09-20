ARG SYNTHTS_IMAGE=egrupp/synthproxy:synthts-v1
ARG NODE_IMAGE=node:8-stretch

# create alias to refer it in runtime image
FROM $SYNTHTS_IMAGE AS synthts

# build node app as separate stage
FROM $NODE_IMAGE AS build

WORKDIR /app
COPY . /app
RUN yarn install --production
RUN rm yarn.lock .yarnrc

# assemble runtime image
FROM $NODE_IMAGE

WORKDIR /app
COPY --from=synthts /app /app
COPY --from=synthts /usr/bin/synthts_et /usr/bin
COPY --from=build /app /app

EXPOSE 3000
ENV NODE_ENV production
ENV PORT 3000

USER node
CMD ["node", "build/main.js"]
