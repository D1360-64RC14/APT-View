#!/bin/bash
# ----------------------------------
# Shell Script made to execute both
# SASS transpiller and TypeScript
# compiler with 'screen'.
# ----------------------------------

CURRENT_DIRECTORY=$(pwd | rev | cut -d '/' -f 1 | rev)

if [[ $CURRENT_DIRECTORY == 'scripts' ]]; then
    source ./utils.sh
else
    source ./scripts/utils.sh
fi

# Check if screen and npx are installed
hasProgram 'npx'
hasProgram 'screen'

SESSION_NAME='APT#View-Development'

# Extract the PID of sessions named $SESSION_NAME
# Steps:
# - Get running sessions
# - Get only the sessions with name $SESSION_NAME
# - Get the PID of the sessions
# - Remove trailling spaces
SESSION_PIDS=$(screen -ls                \
    | grep -E "$SESSION_NAME.*Detached"  \
    | cut -d . -f 1                      \
    | sed -E 's/[[:space:]]//g'          \
)

# If there are PIDs...
if [[ ! -z $SESSION_PIDS ]]; then
    # Kill all sessions from extracted PIDs
    echo $SESSION_PIDS | xargs kill
fi

sleep 0.1

cleanStaticFolder

sleep 0.1

# Create a session
screen -dmS $SESSION_NAME

sleep 0.1

# Append commands to the existing session
screen -S $SESSION_NAME -X screen -t 'SASS Transpiler'      npx sass -w --no-source-map src/styles:static/styles
screen -S $SESSION_NAME -X screen -t 'TypeScript Compiler'  npx tsc -w

screen -ls