#!/bin/bash

NETWORK=$1

case ${NETWORK} in
"mainnet" | "holesky") ;;
*)
  echo "Invalid network"
  exit
  ;;
esac

for file in \
  docker-compose.yml \
  dappnode_package.json \
  avatar.png; do
  BASENAME=build/${file%.*}
  EXT=${file##*.}
  echo $BASENAME
  echo $EXT
  echo $file
  rm -f $file
  ln ${BASENAME}-${NETWORK}.${EXT} $file
done

rm -f build/wizard/config.js
ln build/wizard/config-${NETWORK}.js build/wizard/config.js

