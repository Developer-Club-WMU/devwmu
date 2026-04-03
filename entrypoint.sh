#!/bin/sh
# Setup script for environment variables from Docker Secrets inside the container
#set -e

export DATABASE_URL=$(cat /run/secrets/db_url)
export BETTER_AUTH_URL=$(cat /run/secrets/better_auth_url)
export BETTER_AUTH_SECRET=$(cat /run/secrets/better_auth_secret)
export GOOGLE_CLIENT_ID=$(cat /run/secrets/google_client_id)
export GOOGLE_CLIENT_SECRET=$(cat /run/secrets/google_client_secret)

# Ignore this trying to test the jenkins build

exec "$@"