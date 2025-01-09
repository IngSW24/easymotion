#!/bin/sh
set -e

if [ ! -d "node_modules" ]; then
    echo 'Dependencies are not installed.';
    echo 'Attempting to install dependencies... (this may take a while)';
    npm ci;
fi

if [ ! -d "client" ]; then
    echo 'API client is missing.';
    echo 'Attempting to generate API client';
    npm run generate-client;
fi

exec "$@"
