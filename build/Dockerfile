FROM node:16.14.0 as builder

# build wizard
WORKDIR /usr/src/app/wizard
COPY wizard .
RUN yarn
RUN rm -Rf build && yarn build


FROM bloxstaking/ssv-node:v0.1.12

RUN apk add --no-cache supervisor nginx jq
RUN apk upgrade

COPY --from=builder /usr/src/app/wizard/build /usr/local/wizard

# # Monitor
# WORKDIR /usr/src/monitor
# COPY monitor .
# RUN npm i --production

COPY supervisord.conf /etc/supervisord.conf
COPY nginx.conf /etc/nginx/
COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh

WORKDIR /
ENTRYPOINT ["supervisord", "--nodaemon", "--configuration", "/etc/supervisord.conf"]


