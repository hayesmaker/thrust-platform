#!/bin/bash

set -o errexit #Exit on error
echo Copying new assets

rm -rf $THRUST_ASSETS_PATH/public
mkdir $THRUST_ASSETS_PATH/public/
cp -a ./public/assets $THRUST_ASSETS_PATH/public/