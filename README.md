## **BEFORE RUN**
Make sure you have install openjdk

```
sudo apt-get install git openjdk-8-jre-headless -y
```

## **START SERVER**

```
./start.sh
```

## FRESH INSTALLATION:

```
wget https://raw.githubusercontent.com/TheRemote/MinecraftBedrockServer/master/SetupMinecraft.sh
chmod +x SetupMinecraft.sh
./SetupMinecraft.sh 
```

## PIN VERSION
IF YOU WANT TO START SPESIFIC VERSION, YOU CAN START AFTER YOU CREATE A PIN FILE LIKE THIS. EX YOU WANT TO STAY AT VERSION `1.18.33.02`.
```
echo "bedrock-server-1.18.33.02.zip" > version_pin.txt
./start.sh
```

## REFERENCE
- https://github.com/TheRemote/MinecraftBedrockServer
- https://minecraftpe-mods.com/load/minecraft_pe_maps_1_14_1_1_13_1_1_12_1/3
- https://minecraft.fandom.com/wiki/Category:Bedrock_Edition_versions
- https://apexminecrafthosting.com/add-a-bedrock-world/
