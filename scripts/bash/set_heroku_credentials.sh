#!/bin/bash

set -o pipefail

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

source $SCRIPT_DIR/get_credentials.sh

heroku config:set -a approveman\
    APP_ID=$APP_ID \
    WEBHOOK_SECRET=$WEBHOOK_SECRET \
    PRIVATE_KEY="$(cat $PRIVATE_KEY_PATH)"