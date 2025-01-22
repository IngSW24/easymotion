FROM nginx:mainline-alpine

RUN apk add --no-cache openssl

COPY ./entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh
RUN sed -i 's/\r$//g' /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]
CMD ["nginx", "-g", "daemon off;"]
