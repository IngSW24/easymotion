#!/usr/bin/env sh
set -e

if [ -d "node_modules" ]; then
    echo 'Installing dependencies...';
    npm i;
else
    echo 'Dependencies are not installed.';
    echo 'Attempting to install dependencies... (this may take a while)';
    npm ci;
fi

if [ ! -d "src/client" ]; then
    echo 'API client is missing.';
    echo 'Attempting to generate API client... (this may take a while)';
    npm run generate-client;
fi

exec "$@"
