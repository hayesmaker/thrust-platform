#!/bin/bash

set -o errexit #Exit on error
echo Custom Build env: $NODE_ENV

if [[ $NODE_ENV == "production" ]]; then
  echo "Production build - Bundling full game assets"
  curl $THRUST_ASSETS_PACK
  tar -xzf assets.tar.gz
else
  echo "Non production build - Bundling demo assets"
fi
npm run build