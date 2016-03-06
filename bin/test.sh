#!/bin/bash

set -o errexit #Exit on error
echo Test Sweep env: $npm_config_production
npm run mocha

if [[ $npm_config_production == "production" ]]; then
  echo "Production build: Launch browserstack tests"
  npm run e2e:travis
else
  echo "Local testing: Ensure selenium server is running"
  npm run nightwatch
fi