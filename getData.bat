@echo off 
rem set path=..\wget\

git.exe checkout data-update
git.exe fetch

wget -O target1.osm "http://overpass-api.de/api/interpreter?data=[out:json];node[\"sport\"=\"climbing\"];out;way[\"sport\"=\"climbing\"];out;>;out;"

echo var addressPoints= >data1.js
type target1.osm >>data1.js
echo ; >>data1.js
del target1.osm
git.exe add data1.js


wget -O target2.osm "http://overpass-api.de/api/interpreter?data=[out:json];node[\"climbing:sport\"];out;way[\"climbing:sport\"];out;>;out;"

echo var addressPoints= >data2.js
type target2.osm >>data2.js
echo ; >>data2.js
del target2.osm
git.exe add data2.js

SET /P AREYOUSURE=Do you really want to commit(Y/[N])?
IF /I "%AREYOUSURE%" NEQ "Y" GOTO END

git.exe commit -m "updated map data %date:~-4%-%date:~3,2%-%date:~0,2% %time:~0,2%:%time:~3,2%:%time:~6,2%"

:END
rem pause
