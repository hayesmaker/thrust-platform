#!/bin/bash
set -o errexit #Exit on error
echo Building Zip Bundle for deployment

usage()
{
    echo "usage: bundle [[-i]] | [-h]]"
}

rm -rf out
npm run create:out
cp -a ./public-cordova/* ./out/bundle/
while [ "$1" != "" ]; do
    case $1 in
        -i | --include )        include=1
                                ;;
        -h | --help )           usage
                                exit
                                ;;
        * )                     usage
                                exit 1
    esac
    shift
done
if [ "$include" = "1" ]; then
  echo "index.html is included"
  cp ./src/old/index.html ./out/bundle/
else
  echo "index.html is excluded"
fi
cd ./out/bundle/
zip -r ../bundle.zip ./
cd ../../