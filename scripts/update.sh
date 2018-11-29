#!/bin/bash

cd ~
wget https://github.com/woutervddn/scoreboard/archive/master.zip

unzip master.zip
rm master.zip

echo "All Updated"
echo ""
echo "Start db by using: json-server /home/pi/scoreboard-master/database/db.json"
echo "Launch web scoreboard by visiting: http://localhost/"
echo "Launch web admin by visiting: http://localhost/admin/"

