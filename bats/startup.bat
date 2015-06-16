echo starting max patch
:: start C:\Users\OCR\Documents\GitHub\timeofthegame\audio\timeofthegame_2/timeofthegame_2.exe

echo starting the osc bridge
start cmd /k "node C:\Users\OCR\Documents\GitHub\timeofthegame\sketches\osc-web-master\bridge.js"
echo starting the main server
:: throw a little delay in there so everything can get setup
timeout 2
start cmd /k "cd C:\Users\OCR\Documents\GitHub\timeofthegame\NFM\ && http-server -p 8000"
echo starting chrome
:: throw a little delay in there so everything can get setup
timeout 2
start chrome --kiosk http://localhost:8000