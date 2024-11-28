FROM alpine

RUN apk add --no-cache openssl

COPY ./certgen.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT [ "sh", "-c", "/entrypoint.sh" ]
