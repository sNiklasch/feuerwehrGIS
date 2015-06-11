var datamap;

function initDataMap(){

	datamap = L.map('datamap', {
		crs: L.CRS.EPSG4326
	}).setView([51.955, 7.62], 10);
	
	var wmsLayer = L.tileLayer.wms("http://www.wms.nrw.de/geobasis/wms_nw_dtk", {
	    layers: "nw_dtk_col",
	    format: 'image/png',
	    transparent: false
	});
	wmsLayer.addTo(datamap);
	//addLayer("OSM", "http://wms.openstreetmap.de/wms?", map);

	// Initialise the FeatureGroup to store editable layers

}
function addGeoJSON(geojson){
	L.geoJson(geojson).addTo(datamap);
}


