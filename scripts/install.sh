#!/bin/bash

# update repo's
sudo apt update

# Upgrade OS
sudo apt -y upgrade

# install node (for DB) & apache (for Scoreboard)
sudo apt -y install node npm apache2

# install n and update to latest
sudo npm i -g n
sudo n latest

# install json-server
sudo npm i -g json-server

# Make file changes
sudo rm -rf /var/www/html # remove default apache folder
sudo ln -s /home/pi/scoreboard-master/web/ /var/www/html # make a symbolic link from default apache folder to project folder
sudo chown www-data:www-data -R /var/www/html

# info

echo "Start db by using: json-server /home/pi/scoreboard-master/database/db.json"
echo "Launch web scoreboard by visiting: http://localhost/"
echo "Launch web admin by visiting: http://localhost/admin/"
