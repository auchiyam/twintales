cd %~dp0\..
robocopy ".\src\html" ".\bin" /S /E /MIR
tsc
pause