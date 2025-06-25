#!/bin/sh
set -e

# Generates self signed SSL certificates for *.dev.easymotion.it

mkdir -p $CERT_PATH

if [ ! -f $CERT_PATH/dev.key ] || [ ! -f $CERT_PATH/dev.crt ]; then
  echo 'Generating development SSL certificates...';
  openssl req -x509 -newkey rsa:2048 -nodes \
    -keyout dev.key -out dev.crt -days 3650 \
    -subj "/C=XX/ST=EM/L=EM/O=EM/OU=EM/CN=*.dev.easymotion.it" \
    -extensions SAN \
    -config <(cat <<EOF
  [req]
  distinguished_name=req
  x509_extensions=SAN
  prompt=no

  [req_distinguished_name]
  CN=*.dev.easymotion.it

  [SAN]
  subjectAltName=DNS:*.dev.easymotion.it,DNS:dev.easymotion.it
  EOF
  )
else
  echo 'Certificates already exist, skipping generation.';
fi

exec "$@"
