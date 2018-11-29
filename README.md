# DESCRIPTION

This repository hosts a scoreboard for Nunchaku Competitions to be hosted and viewed on a Raspberry Pi.

This scoreboard is in pre-alpha.

DISCLAIMER: Wifi, browser startup, full screen browser,... are not available yet.


# DEPENDENCIES

## WEB

The web front-end uses Bootstrap4 and requires a server to run.

## DB

The database is using json-server. A Node.js+ Express.js based database server without programming.
(you just need to write a json file)

# Installation

## ONE LINE FULL INSTALL

`bash <(curl -s https://raw.githubusercontent.com/woutervddn/scoreboard/master/scripts/autoinstall/autoinstall.sh)`

## System

- This scoreboard is meant to be ran on a Raspberry Pi. Start by installing Rasbian on your Raspberry Pi.
- Connnect to the internet
- Copy this repository to your RPi home folder:
  - open terminal
  - `wget https://github.com/woutervddn/scoreboard/archive/master.zip`
  - `unzip master.zip`
  - `rm master.zip`
- Navigate to the scoreboard folder:
  - `cd scoreboard`
- Run the installer:
  - `bash ./scripts/install.sh`

# Usage

- Start the DBServer:
  - `json-server /home/pi/scoreboard/data/db.json`
  - use the following for interactive manual editing of db `json-server --watch /home/pi/scoreboard/data/db.json`

- Display scoreboard:
  - Open browser
  - Go to: `http://localhost/`
