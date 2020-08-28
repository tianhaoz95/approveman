#!/bin/bash

set -o pipefail

CRED_LOCATION=$HOME/project-temp/approveman-credentials

if [ -d "$CRED_LOCATION" ]
then
  echo "$CRED_LOCATION exists, remove first"
  rm -rf "$CRED_LOCATION"
fi

git clone "https://${GITHUB_TOKEN}@github.com/tianhaoz95/approveman-credentials.git" "$CRED_LOCATION"

source "$CRED_LOCATION/set_dev_environment_variables.sh"

echo "Please source this file instead of executing since it sets environment variables."
