#!/usr/bin/env sh
set -e

if [ -d "node_modules" ]; then
    if [ "${AUTO_INSTALL_DEPS:-true}" = "true" ]; then
        echo 'Installing additional dependencies...'
        npm i
    else
        echo 'Skipping additional dependency installation.'
    fi
else
    echo 'Dependencies are not installed.'
    echo 'Attempting to install dependencies... (this may take a while)'
    npm ci
fi

exec "$@"