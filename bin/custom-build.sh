#!/bin/bash

set -o errexit #Exit on error
echo Custom Build env: $NODE_ENV

if [[ $NODE_ENV == "production" ]]; then
  echo "Production build - Bundling full game assets"
  curl -O $THRUST_ASSETS_PACK
  tar -xzf assets.tar.gz
  #npm run tweet:deploy
else
  echo "Non production build - Bundling demo assets"
fi
npm run build

#  copy and paste for local levels
  #  curl -O $THRUST_ASSETS_PACK && tar -xzf assets.tar.gz