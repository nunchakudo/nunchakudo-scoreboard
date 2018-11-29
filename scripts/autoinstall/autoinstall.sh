#!/bin/bash

cd ~
wget https://github.com/woutervddn/scoreboard/archive/master.zip

unzip master.zip
rm master.zip

cd scoreboard-master

$(which bash) ./scripts/install.sh
