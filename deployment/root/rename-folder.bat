@echo off
REM Run this script if you close any IDE or terminal instances locking grok-dupe
cd /d "%~dp0\..\..\.."
echo Current directory: %CD%
if exist "mokko" (
  rmdir "mokko" 2>nul
)
if exist "grok-dupe" (
  rename "grok-dupe" "mokko"
  mklink /J "grok-dupe" "mokko" 2>nul
  echo Successfully renamed folder to mokko!
) else (
  echo grok-dupe folder not found. Already renamed to mokko.
)
pause
