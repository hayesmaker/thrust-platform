#!/bin/bash

set -o errexit #Exit on error
echo Custom Build env: $NODE_ENV

if [[ $NODE_ENV == "production" ]]; then
  echo "Production build"

else
  echo "Non production build"

fi
curl --proto =http,https --header 'Authorization: token $THRUST_DEV_TOKEN' \
     --header 'Accept: application/vnd.github.v3.raw' \
     --remote-name \
     --location $THRUST_DEV_FILE

npm run build