#!/bin/bash

function hasProgram {
    local programName=$1

    which $programName > /dev/null
    local exitCode=$?

    if [[ $exitCode == 0 ]]; then
        return 0
    fi

    # if return code is not zero
    >&2 echo "The program \"$programName\" is mandatory. Install it and try again."
    exit $exitCode
}

function cleanStaticFolder {
    rm -rf ./static/*
}