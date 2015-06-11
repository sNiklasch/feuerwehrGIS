# feuerwehrGIS

## Installationsanleitung

* Kopiere foldende Bibliotheken in die entsprechnenden Ordner:
  * in Ordner /administrationsserver/admin-client/public/lib
    * angular
    * angular-route
    * bootstrap
    * jQuery
    * Leaflet.draw
  * in Ordner /administrationsserver/admin-client/node_modules
    * express
  * in Ordner /administrationsserver/db-server/node_modules
    * csv2geojson
    * express
    * geojson-validation
    * mkdirp
    * mongoose
    * mongoose-geojson-schema
    * underscore
    * validator
    * xml2json
  * in Ordner /webgis/node_modules
    * express
  * in Ordner /webgis/public/lib
    * angular
    * angular-route
    * bootstrap
    * jQuery
    * Leaflet-0.7.3
    * Leaflet.draw
    * Leaflet.GeometryUtil

## Startanleitung

* Starte deine MongoDB (Befehl 'mongod')
* Starte den db-server (Befehl 'node app.js' im Ordner /administrationsserver/db-server/)
* Starte den Administrationsclient (Befehl 'node index.js' im Ordner /administrationsserver/admin-client/)
* Starte das WebGIS (Befehl 'node index.js' im Ordner /webgis/)