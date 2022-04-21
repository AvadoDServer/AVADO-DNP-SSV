FROM node:16.14.0 as builder

# build wizard
WORKDIR /usr/src/app/wizard
COPY wizard .
# RUN npm i
# RUN rm -Rf build && npm run build

FROM alpine:latest


RUN apk add --no-cache supervisor gcompat nginx nodejs npm
RUN apk upgrade

# COPY --from=builder /usr/src/app/wizard/build /usr/local/wizard

# # Monitor
# WORKDIR /usr/src/monitor
# COPY monitor .
# RUN npm i --production

COPY supervisord.conf /etc/supervisord.conf
COPY nginx.conf /etc/nginx/

WORKDIR /
ENTRYPOINT ["supervisord", "--nodaemon", "--configuration", "/etc/supervisord.conf"]


