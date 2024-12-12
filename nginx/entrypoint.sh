#!/bin/sh
set -e

# Generates self signed SSL certificates for development
# An entry for DOMAIN should be added to /etc/hosts

mkdir -p $CERT_PATH

if [ ! -f $CERT_PATH/dev.key ] || [ ! -f $CERT_PATH/dev.crt ]; then
  echo 'Generating development SSL certificates...';
  apk add --no-cache openssl;
  openssl req -x509 -newkey rsa:4096 -keyout $CERT_PATH/dev.key -out $CERT_PATH/dev.crt -sha256 -days 3650 -nodes -subj "/C=XX/ST=EM/L=EM/O=EM/OU=EM/CN=$DOMAIN";
else
  echo 'Certificates already exist, skipping generation.';
fi

exec "$@"
