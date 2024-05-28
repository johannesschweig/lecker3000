#!/usr/bin/env sh

# change env from dev to prod
cp dist/index.html dist/404.html
surge . https://savory-cuisine.surge.sh/