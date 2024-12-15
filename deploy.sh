#!/usr/bin/env sh

# change env from dev to prod
npm run build
cp dist/index.html dist/404.html
cd dist
surge . https://lecker3000.surge.sh/
# chagne env back to dev