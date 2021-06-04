#!/bin/bash

welcome() {
    echo ""
    echo "Welcome to channel mirror's Linux launcher"
    echo "Please select an option to begin:"
    echo ""
    echo "   1. Start the bot normally"
    echo "   2. Start the bot with automatic restarts"
    echo ""
    echo "   3. Install the dependencies"
    echo "   4. Update the dependencies"
    echo "   9. Exit program"
    echo ""
    echo "Credits: Original launcher by AvaIre and modified by Kuna"

    echo "Enter your option: "

    read option

    if [ 1 -eq $option ]; then
        echo "Normal start has been selected, starting the bot..."
        echo ""

        startApplication

    elif [ 2 -eq $option ]; then
        echo "Starting the bot with automatic restarts..."
        echo ""

        startLoop
    elif [ 3 -eq $option ]; then
        echo "Debug start has been selected, starting the bot..."
        echo ""

        startDebug
    elif [ 4 -eq $option ]; then
        echo "Installing the bot dependencies..."
        echo ""

}

startLoop() {
    while true; do
        startApplication false

        echo ""
        echo "Restarting the application in 5 seconds!"
        echo "If you want to cancel the process, you can use CTRL + C now"
        sleep 5
    done
}

startApplication() {
    npm start

    if [ "$1" != "false" ]; then
        welcome
    fi
}

installDependencies() {
    npm i
    echo "Dependencies are succesfully installed. Ready to start."
     if [ "$1" != "false" ]; then
        welcome
    fi
}

updateDependencies() {
    npm update
    echo "Dependencies are succesfully updated. Ready to start."
     if [ "$1" != "false" ]; then
        welcome
    fi

welcome

