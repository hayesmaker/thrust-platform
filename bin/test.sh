#!/bin/bash

set -o errexit #Exit on error
echo Test Sweep env: $NODE_ENV
npm run mocha

if [[ $NODE_ENV == "production" ]]; then
  echo "Production build: Launch browserstack tests"
  npm run e2e:travis
else
  echo "Local testing: Ensure selenium server is running"
  npm run nightwatch
fi