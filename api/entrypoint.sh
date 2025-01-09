#!/bin/sh
set -e

if [ ! -d "node_modules" ]; then
    echo 'Dependencies are not installed.';
    echo 'Attempting to install dependencies... (this may take a while)';
    npm ci;
fi

exec "$@"