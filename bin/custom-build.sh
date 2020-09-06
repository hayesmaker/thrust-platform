#!/bin/bash

set -o errexit #Exit on error
echo Custom Build env: $NODE_ENV

if [[ $NODE_ENV == "production" ]]; then
  echo "Production build - Bundling full game assets"
  curl -O $THRUST_ASSETS_PACK
  tar -xzf assets.tar.gz
  npm run build:fullgame
else
  echo "Non production build - Bundling demo assets"
  npm run build:demo
fi
npm run build:new

#  copy and paste for local levels
# curl -O $THRUST_ASSETS_PACK && tar -xzf assets.tar.gz