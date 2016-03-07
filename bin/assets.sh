#!/bin/bash

set -o errexit #Exit on error
echo Copying new assets

cp ./src/app/properties.js $THRUST_ASSETS_PATH/src/app/
cp -a ./public/assets $THRUST_ASSETS_PATH/public/assets