#!/bin/sh
set -e

CERT_DIR=/etc/nginx/certs

if [ -f "$CERT_DIR/server.crt" ] && [ -f "$CERT_DIR/server.key" ]; then
    echo "generate-cert: using existing certificate in $CERT_DIR"
    exit 0
fi

mkdir -p "$CERT_DIR"
openssl req -x509 -nodes -newkey rsa:2048 -days 365 \
    -keyout "$CERT_DIR/server.key" \
    -out "$CERT_DIR/server.crt" \
    -subj "/CN=${SERVER_NAME:-localhost}" \
    -addext "subjectAltName=DNS:${SERVER_NAME:-localhost},DNS:localhost,IP:127.0.0.1" \
    2>/dev/null
echo "generate-cert: generated self-signed certificate for ${SERVER_NAME:-localhost}"
