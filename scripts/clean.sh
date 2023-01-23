#!/bin/bash

CURRENT_DIRECTORY=$(pwd | rev | cut -d '/' -f 1 | rev)

if [[ $CURRENT_DIRECTORY == 'scripts' ]]; then
    source ./utils.sh
else
    source ./scripts/utils.sh
fi

cleanStaticFolder