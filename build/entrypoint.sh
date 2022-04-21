#!/bin/sh

echo "Preparing node to start"

PUBLIC_KEY_FILE=/data/public_key.txt
PRIVATE_KEY_FILE=/data/private_key.txt
KEY_GEN_OUTPUT=/data/KEY_TEXT

if [ ! -f PUBLIC_KEY_FILE ]; then
    /go/bin/ssvnode generate-operator-keys > ${KEY_GEN_OUTPUT}
    cat ${KEY_GEN_OUTPUT} | grep "public key" | sed -n 's/.*\({.*}\)/\1/p' | jq '.pk' | tr -d '"' > ${PUBLIC_KEY_FILE}
    cat $KEY_GEN_OUTPUT | grep "private key" | sed -n 's/.*\({.*}\)/\1/p' | jq '.sk' | tr -d '"' > ${PRIVATE_KEY_FILE}
fi

mkdir -p /usr/local/wizard/build/
cp ${PUBLIC_KEY_FILE} /usr/local/wizard/build/
cp ${PRIVATE_KEY_FILE} /usr/local/wizard/build/

# TODO create configuration file

# Start SSV

sleep infinity
