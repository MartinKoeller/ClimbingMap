@echo off 
set path=..\wget\

wget -O target1.osm "http://overpass-api.de/api/interpreter?data=[out:json];node[\"sport\"=\"climbing\"];out;way[\"sport\"=\"climbing\"];out;>;out;"

echo var addressPoints= >data1.js
type target1.osm >>data1.js
echo ; >>data1.js


wget -O target2.osm "http://overpass-api.de/api/interpreter?data=[out:json];node[\"climbing:sport\"];out;way[\"climbing:sport\"];out;>;out;"

echo var addressPoints= >data2.js
type target2.osm >>data2.js
echo ; >>data2.js
rem pause