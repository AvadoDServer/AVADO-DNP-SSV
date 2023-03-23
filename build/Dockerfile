ARG UPSTREAM_VERSION

FROM --platform=linux/amd64 node:16.15.0 as builder

# build wizard
# WORKDIR /usr/src/app/wizard
# COPY wizard .
# RUN npm i
# RUN npm run build 
#RUN rm -Rf build && yarn build

# Monitor
WORKDIR /usr/src/monitor
COPY monitor .
RUN yarn --production

FROM --platform=linux/amd64 bloxstaking/ssv-node:${UPSTREAM_VERSION} as ssv_node_image

FROM --platform=linux/amd64 frolvlad/alpine-glibc:glibc-2.34 as builder_1
RUN apk add --no-cache yarn git
WORKDIR /
RUN git clone https://github.com/bloxapp/ssv-keys.git --branch=v0.0.11
WORKDIR /ssv-keys
RUN yarn

# final image
FROM --platform=linux/amd64 frolvlad/alpine-glibc:glibc-2.34


RUN apk add --no-cache yq --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community
RUN apk add --no-cache supervisor nginx nodejs yarn

# copy wizard & monitor
# COPY --from=builder /usr/src/app/wizard/out /usr/local/wizard
COPY --from=builder /usr/src/monitor /usr/local/monitor

# supervisor, nginx, entrypoint
ADD supervisord.conf /etc/supervisord.conf
ADD nginx.conf /etc/nginx/
ADD startssvnode.sh /
RUN chmod +x /startssvnode.sh

# SSV executables
COPY --from=ssv_node_image /go /go
COPY --from=builder_1  /ssv-keys /ssv-keys

WORKDIR /
ENTRYPOINT ["supervisord", "--nodaemon", "--configuration", "/etc/supervisord.conf"]
