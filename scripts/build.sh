#!/bin/bash

CURRENT_DIRECTORY=$(pwd | rev | cut -d '/' -f 1 | rev)

if [[ $CURRENT_DIRECTORY == 'scripts' ]]; then
    source ./utils.sh
else
    source ./scripts/utils.sh
fi

hasProgram 'npx'

cleanStaticFolder

sleep 0.1

npx sass --verbose --no-quiet --no-source-map src/styles:static/styles
npx tsc --build --verbose --force