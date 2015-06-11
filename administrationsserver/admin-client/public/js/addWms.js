var map, map1, map2;
var rectangleLayer;
var currentBB = [0, 0, 0, 0];

function initZoomMaps(){

	var zoommin = 12;
	var zoommax = 14;

	map1 = L.map('map1', {
		crs: L.CRS.EPSG4326
	}).setView([51.955, 7.62], zoommin);

	map2 = L.map('map2', {
		crs: L.CRS.EPSG4326
	}).setView([51.955, 7.62], zoommax);

	//sync the maps panning:
	map1.on('moveend', function (e){
		map1.panTo(map1.getCenter());
		map2.panTo(map1.getCenter());
	})
	map2.on('moveend', function (e){
		map1.panTo(map2.getCenter());
		map2.panTo(map2.getCenter());
	})

	//zoomstufen anpassen:

	map1.on('zoomend', function (e){
		if (map1.getZoom() > map2.getZoom()) {
			map2.setZoom(map1.getZoom());
		};
		updateZoom(map1.getZoom(), map2.getZoom());
	})
	map2.on('zoomend', function (e){
		if (map2.getZoom() < map1.getZoom()) {
			map1.setZoom(map2.getZoom());
		};
		updateZoom(map1.getZoom(), map2.getZoom());
	})
}

function initBBMap(){

	map = L.map('map', {
		crs: L.CRS.EPSG4326
	}).setView([51.955, 7.62], 10);
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', 
	{
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
		key: 'BC9A493B41014CAABB98F0471D759707'
	}).addTo(map);
	//addLayer("OSM", "http://wms.openstreetmap.de/wms?", map);

	// Initialise the FeatureGroup to store editable layers
	var drawnItems = new L.FeatureGroup();
	map.addLayer(drawnItems);

	//options for the drawing
	var options = {
	    position: 'topright',
	    draw: {
	        polyline: false,
	        polygon: false,
	        circle: false,
	        rectangle: true,
	        marker: false
	    },
	    edit: {
	        featureGroup: drawnItems, //REQUIRED!!
	        edit: true,
	        remove: false
	    }
	};

	// Initialise the draw control and pass it the FeatureGroup of editable layers
	var drawControl = new L.Control.Draw(options);
	map.addControl(drawControl);


	map.on('draw:created', function (e) {
	    insertRectangle(
	    	e.layer.getBounds().getNorth(),
	    	e.layer.getBounds().getEast(),
	    	e.layer.getBounds().getSouth(),
	    	e.layer.getBounds().getWest()
	    	);
	    updateBoundingBox(
	    	e.layer.getBounds().getNorth(),
	    	e.layer.getBounds().getEast(),
	    	e.layer.getBounds().getSouth(),
	    	e.layer.getBounds().getWest()
	    	);
	});

	map.on('draw:drawstart', function (e) {
		try {
			map.removeLayer(rectangleLayer);
		} catch(e){}
	});
}


function addLayer(name, url, mymap){
	console.log(name + " / " + url);
	mymap.eachLayer(function (layer) {
		mymap.removeLayer(layer);
	});
	var newTiles = L.tileLayer.wms(url, {
	    layers: name,
	    format: 'image/png',
	    transparent: false
	});
	newTiles.addTo(mymap);
}

function updateZoom(min, max){
	var scope = angular.element($("#wms-layers")).scope();
	scope.$apply(function(){
		scope.WMS.options.zoom.min = min;
		scope.WMS.options.zoom.max = max;
	});
}

function updateBoundingBox(n, e, s, w){
	var scope = angular.element($("#wms-layers")).scope();
	scope.$apply(function(){
		scope.WMS.options.bbox.xmin = w;
		scope.WMS.options.bbox.xmax = e;
		scope.WMS.options.bbox.ymin = s;
		scope.WMS.options.bbox.ymax = n;
	});
	currentBB = [n, e, s, w];
}

function insertRectangle(n, e, s, w){
	try {
		map.removeLayer(rectangleLayer);
	} catch(e){}
	var southWest = L.latLng(s, w);
    var northEast = L.latLng(n, e);
    var bounds = L.latLngBounds(southWest, northEast);
	rectangleLayer = L.rectangle(bounds);

    map.addLayer(rectangleLayer);
}