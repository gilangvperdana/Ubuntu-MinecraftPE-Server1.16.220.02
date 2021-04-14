#!/bin/bash
# Minecraft Server Permissions Fix Script - James A. Chambers - https://jamesachambers.com

# Takes ownership of server files to fix common permission errors such as access denied
# This is very common when restoring backups, moving and editing files, etc.

# If you are using the systemd service (sudo systemctl start MCPE) it performs this automatically for you each startup

echo "Taking ownership of all server files/folders in /home/gilang/minecraftbe/MCPE"
sudo chown -Rv gilang /home/gilang/minecraftbe/MCPE
sudo chmod 755 /home/gilang/minecraftbe/MCPE/bedrock_server
sudo chmod -R 755 /home/gilang/minecraftbe/MCPE/*.sh
echo "Complete"