ARG UPSTREAM_VERSION

FROM node:18.15.0 as builder

RUN mkdir ~/.ssh
RUN ssh-keyscan github.com >> ~/.ssh/known_hosts

# build wizard
WORKDIR /usr/src/app/wizard
COPY wizard .
RUN npm i
RUN npm run build
#RUN rm -Rf build && yarn build

# Monitor
WORKDIR /usr/src/monitor
COPY monitor .
RUN yarn --production

FROM --platform=linux/amd64 bloxstaking/ssv-node:${UPSTREAM_VERSION}

RUN apk add --no-cache yq --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community
RUN apk add --no-cache supervisor nginx nodejs curl

# copy wizard & monitor
COPY --from=builder /usr/src/app/wizard/out /usr/local/wizard
COPY --from=builder /usr/src/monitor /usr/local/monitor

# supervisor, nginx, entrypoint
ADD supervisord.conf /etc/supervisord.conf
ADD nginx.conf /etc/nginx/
ADD startssvnode.sh /
RUN chmod +x /startssvnode.sh

WORKDIR /
ENTRYPOINT ["supervisord", "--nodaemon", "--configuration", "/etc/supervisord.conf"]
