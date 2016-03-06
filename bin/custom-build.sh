#!/bin/bash

set -o errexit #Exit on error
echo Custom Build env: $NODE_ENV

if [[ $NODE_ENV == "production" ]]; then
  echo "Production build"

else
  echo "Non production build"

fi
curl $THRUST_ASSETS_PACK