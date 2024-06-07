#!/usr/bin/env sh

# change env from dev to prod
npm run build
cp dist/index.html dist/404.html
surge . https://lecker3000.surge.sh/