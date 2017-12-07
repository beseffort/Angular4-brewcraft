#!/bin/bash
sudo npm install -g @angular/cli
sudo npm install -g pm2
cd /home/ec2-user/brewcraft/client
sudo npm install
sudo npm install node-sass
sudo ng build
cd /home/ec2-user/brewcraft/server
sudo npm install
sudo pm2 delete all
sudo pm2 start server.js
