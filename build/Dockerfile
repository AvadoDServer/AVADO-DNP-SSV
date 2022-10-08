ARG UPSTREAM_VERSION

FROM node:16.14.0 as builder

# build wizard
WORKDIR /usr/src/app/wizard
COPY wizard .
RUN yarn
RUN rm -Rf build && yarn build

FROM --platform=linux/amd64 bloxstaking/ssv-node:${UPSTREAM_VERSION}

RUN apk add --no-cache yq --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community
RUN apk add --no-cache supervisor nginx 

# copy wizard
COPY --from=builder /usr/src/app/wizard/build /usr/local/wizard

# SSV config template
ADD config.yml .

# supervisor, nginx, entrypoint
ADD supervisord.conf /etc/supervisord.conf
ADD nginx.conf /etc/nginx/
ADD entrypoint.sh /
RUN chmod +x /entrypoint.sh

WORKDIR /
ENTRYPOINT ["supervisord", "--nodaemon", "--configuration", "/etc/supervisord.conf"]
