function layerAdded(layer){
	if(layer.type == "WMS"){
		console.log("WMS hinzugefügt");
	} 
	else if(layer.type == "CSV"){
		console.log("CSV hinzugefügt");
	} 
	else if(layer.type == "GeoJSON"){
		console.log("GeoJSON hinzugefügt");
	} 
	else if(layer.type == "Shapefile"){
		console.log("Shapefile hinzugefügt");
	}
	else {
		console.log("fehler!");
	}
}

function layerModified(name, url, type){
	console.log("layerAdded: " + name + ", " + url + ", " + type);
}

function layerUpdated(id){
	
}