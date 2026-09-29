@echo off
setlocal enabledelayedexpansion
title Inven2 Connect - Demo

rem Kjor alltid fra mappen der denne filen ligger
cd /d "%~dp0"

set "PORT=5174"
set "URL=http://localhost:%PORT%/"

echo(
echo   Inven2 Connect - starter demo...
echo(

where npm >nul 2>nul
if not %errorlevel%==0 (
  echo   Fant ikke 'npm'. Installer Node.js ^(https://nodejs.org^) og prov igjen.
  echo(
  pause
  exit /b 1
)

rem Installer avhengigheter forste gang
if not exist "node_modules" (
  echo   Installerer avhengigheter - dette skjer bare forste gang...
  call npm install
  if errorlevel 1 (
    echo   Installasjonen feilet. Se meldingene over.
    pause
    exit /b 1
  )
)

rem Aapne nettleseren automatisk naar serveren svarer paa porten
start "" powershell -NoProfile -WindowStyle Hidden -Command "$p=%PORT%; for($i=0;$i -lt 120;$i++){ if((Test-NetConnection -ComputerName localhost -Port $p -WarningAction SilentlyContinue).TcpTestSucceeded){ Start-Process '%URL%'; break }; Start-Sleep -Seconds 2 }"

echo(
echo   Demoen aapnes i nettleseren paa %URL% saa snart serveren er klar.
echo   La dette vinduet staa aapent mens du presenterer.
echo   Lukk vinduet ^(eller trykk Ctrl+C^) for aa stoppe demoen.
echo(

call npm run dev -- --port %PORT% --strictPort

endlocal
