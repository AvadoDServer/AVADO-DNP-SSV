#!/bin/sh

echo "Preparing node to start up"

PASSWORD_FILE=/data/password.txt
PRIVATE_KEY_FILE=/data/encrypted_private_key.json
CONFIG_FILE=/data/config.yml
DB_FOLDER=/data/db

if [ ! -f ${CONFIG_FILE} ]; then
    echo "### Creating initial configuration"

    mkdir -p ${DB_FOLDER}
    touch ${CONFIG_FILE}

    # Generate password
    awk -v n=12 'BEGIN{srand(); while (n--) printf "%c", int(rand()*93+33)}' > ${PASSWORD_FILE}

    /go/bin/ssvnode generate-operator-keys -p ${PASSWORD_FILE}
    mv encrypted_private_key.json ${PRIVATE_KEY_FILE}

    yq eval --inplace '.ssv.Network = "'${NETWORK}'"' ${CONFIG_FILE}

    yq eval --inplace '.db.Path = "'${DB_FOLDER}'"' ${CONFIG_FILE}
    yq eval --inplace '.KeyStore.PrivateKeyFile = "'${PRIVATE_KEY_FILE}'"' ${CONFIG_FILE}
    yq eval --inplace '.KeyStore.PasswordFile = "'${PASSWORD_FILE}'"' ${CONFIG_FILE}

    yq eval --inplace '.eth2.BeaconNodeAddr = "http://teku.my.ava.do:5051"' ${CONFIG_FILE}
    yq eval --inplace '.eth1.ETH1Addr = "ws://ethchain-geth.my.ava.do:8546"' ${CONFIG_FILE}
else
    echo "### Config file already exists"
fi

if [ "$NETWORK" = "mainnet" ]; then 
    echo "--> using $NETWORK endpoints"
    yq eval --inplace '.eth2.BeaconNodeAddr = "http://teku.my.ava.do:5051"' ${CONFIG_FILE}
    yq eval --inplace '.eth1.ETH1Addr = "ws://ethchain-geth.my.ava.do:8546"' ${CONFIG_FILE}
fi

if [ "$NETWORK" = "holesky" ]; then 
    echo "--> using $NETWORK endpoints"
    yq eval --inplace '.eth2.BeaconNodeAddr = "http://teku-holesky.my.ava.do:5051"' ${CONFIG_FILE}
    yq eval --inplace '.eth1.ETH1Addr = "ws://holesky-geth.my.ava.do:8546"' ${CONFIG_FILE}
fi

echo "---config"
cat ${CONFIG_FILE}
echo "config---"

# Start SSV-Node
CONFIG_FILE=${CONFIG_FILE} /go/bin/ssvnode start-node -c ${CONFIG_FILE}

sleep 10