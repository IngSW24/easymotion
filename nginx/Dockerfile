FROM alpine

RUN apk add --no-cache openssl

COPY ./certgen.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT [ "sh", "-c", "sed -i 's/\r//g' /entrypoint.sh && /entrypoint.sh" ]
