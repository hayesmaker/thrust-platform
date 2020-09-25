#!/bin/bash

set -o errexit #Exit on error
echo Building Zip Bundle for deployment

rm -rf out
npm run create:out
cp -a ./public/* ./out/bundle/
cp ./src/old/index.html ./out/bundle/
cd ./out/bundle/
zip -r ../bundle.zip ./
cd ../../