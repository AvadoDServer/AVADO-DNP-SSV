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

RUN apt-get update && apt-get install -y supervisor nginx nodejs curl
RUN wget https://github.com/mikefarah/yq/releases/latest/download/yq_linux_amd64 -O /usr/bin/yq && chmod +x /usr/bin/yq
RUN useradd -r -s /bin/false nginx

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
