@echo off
@title Gaia Windows Launcher

setlocal enabledelayedexpansion
set Looping=False

cls

:START
echo.
echo Welcome to Channel mirror's windows launcher
echo Please select an option to begin:
echo.
echo    1. Start the bot normally.
echo    2. Start with automatic restarts.
echo.
echo    3. Install the dependencies.
echo    4. Update the dependencies.
echo    9. Exit program
echo.
echo Credits: Original launcher by AvaIre and modified by Kuna (uurgothat)

set /p in="Enter your option: "

if !in! == 1 (
    goto START_BOT
)
if !in! == 2 (
    goto RESTART_LOOP
)
if !in! == 3 (
    goto INSTALL_DEPENDENCY
)
if !in! == 4 (
    goto UPDATE_DEPENDENCY
)


if !in! == 9 (
    goto EOF
) else (
    echo.
    echo     Invalid option given
    goto START
)

:RESTART_LOOP
goto START_WEB

:START_BOT
    npm start
if !Looping! == False (
    goto START
)

:START_WEB
echo     Starting the kronos web...
   cd kronos-example-web
   npm start

:INSTALL_DEPENDENCY
echo     Starting to install the dependencies...
npm i

:UPDATE_DEPENDENCY
echo     Starting to update the dependencies...
npm update

echo.
echo Restarting the bot in 5 second, press CTRL + C to cancel the process.
echo.

choice /d y /t 5 > nul
goto START_BOT

:EOF
exit
