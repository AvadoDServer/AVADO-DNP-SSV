#!/bin/sh

echo "Preparing node to start"

PUBLIC_KEY_FILE=/data/public_key.txt
PRIVATE_KEY_FILE=/data/private_key.txt
KEY_GEN_OUTPUT=/data/KEY_TEXT

if [ ! -f PUBLIC_KEY_FILE ]; then
    /go/bin/ssvnode generate-operator-keys > ${KEY_GEN_OUTPUT}
    cat ${KEY_GEN_OUTPUT} | grep "public key" | sed -n 's/.*\({.*}\)/\1/p' | yq '.pk' > ${PUBLIC_KEY_FILE}
    cat $KEY_GEN_OUTPUT | grep "private key" | sed -n 's/.*\({.*}\)/\1/p' | yq '.sk' > ${PRIVATE_KEY_FILE}
fi

mkdir -p /usr/local/wizard/build/
mkdir -p /data/db
cp ${PUBLIC_KEY_FILE} /usr/local/wizard/build/
# cp ${PRIVATE_KEY_FILE} /usr/local/wizard/build/

OPERATOR_PRIVATE_KEY=`cat ${PRIVATE_KEY_FILE}`

yq e '.OperatorPrivateKey = "'${OPERATOR_PRIVATE_KEY}'"' ./config.yml

#echo "---config"
#cat ./config.yml
#echo "config---"

CONFIG_PATH=/config.yml make BUILD_PATH=/go/bin/ssvnode start-node