#!/bin/bash

set -o pipefail

BASH_SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
SCRIPT_DIR="$(dirname "$BASH_SCRIPT_DIR")"
PROJ_ROOT="$(dirname "$SCRIPT_DIR")"

DOC_README="$PROJ_ROOT/docs/README.md"
MAIN_README="$PROJ_ROOT/README.md"

DOC_DEV="$PROJ_ROOT/docs/development.md"
CONTRIB_README="$PROJ_ROOT/CONTRIBUTING.md"

if cmp -s "$MAIN_README" "$DOC_README"
then
  echo "Content in $MAIN_README and $DOC_README are the same. Done."
else
  echo "ERROR: content in $MAIN_README and $DOC_README are different."
  echo "Found option $1."
  if [ "$1" == "--fix" ]
  then
    echo "The --fix option found. Copy $MAIN_README to $DOC_README."
    cp "$MAIN_README" "$DOC_README"
  else
    echo "No --fix option given. Abort."
    exit 1
  fi
fi

if cmp -s "$CONTRIB_README" "$DOC_DEV"
then
  echo "Content in $CONTRIB_README and $DOC_DEV are the same. Done."
else
  echo "ERROR: content in $CONTRIB_README and $DOC_DEV are different."
  echo "Found option $1."
  if [ "$1" == "--fix" ]
  then
    echo "The --fix option found. Copy $CONTRIB_README to $DOC_DEV."
    cp "$CONTRIB_README" "$DOC_DEV"
  else
    echo "No --fix option given. Abort."
    exit 1
  fi
fi
