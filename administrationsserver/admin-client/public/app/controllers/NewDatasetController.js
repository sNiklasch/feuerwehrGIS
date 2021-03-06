var app = angular.module("admin");


app.controller("NewDatasetController", function($scope, $http, $location){
	//url of the db-server:
	$scope.url = $location.absUrl().split(":")[0] + ":" + $location.absUrl().split(":")[1] + ":3000/";
	
	$scope.varWindow = {};
	$scope.varWindow.WMStemplate1 = "/app/templates/admin/_WMS-chooseLayer.html"
	$scope.varWindow.WMStemplate2 = "/app/templates/admin/_WMS-chooseArea.html"
	$scope.varWindow.WMStemplate3 = "/app/templates/admin/_WMS-chooseZoom.html"
	$scope.varWindow.GeoJSONtemplate = "/app/templates/admin/_geojson-preview.html"

	//show-values for the steps
	$scope.show = {};
	$scope.show.chooseSource = true;
	$scope.show.CSVDelimiter = false;
	$scope.show.CSVFields = false;
	$scope.show.DataPreview = false;
	$scope.show.WMSLayer = false;
	$scope.show.chooseArea = false;
	$scope.show.dataPreview = false;
	$scope.show.dataPreviewJSON = false;
	$scope.show.WMSZoom = false;
	$scope.show.importData = false;

	//attributes of the dataset:
	$scope.datasetInfo = {};
	$scope.datasetInfo.name = "";
	$scope.datasetInfo.url = "";

	//ENTER LINK OR FILE
	$scope.source = "none";
	$scope.showFileInput = false;
	$scope.showLinkInput = false;

	$scope.setSource = function(){
		if($scope.source == "link"){
			$scope.showFileInput = false;
			$scope.showLinkInput = true;
		}
		else if($scope.source == "file"){
			$scope.showFileInput = true;
			$scope.showLinkInput = false;
		}
		console.log($scope.source);
	}

	/***********************************************
	********************* Link:*********************
	************************************************/

	//Funktion für den Absenden-Button in Schritt 1 (Link)
	$scope.submitLink = function(){
		console.log("Es wird folgender Link ueberprueft: " + $scope.datasetInfo.url);
		$scope.checkWMS();
	}

	$scope.checkWMS = function(){
		$scope.datasetInfo.type = "WMS";
        $http.post($scope.url + "layers", $scope.datasetInfo)
            .success(function(response){
            	console.log(response);
            	$scope.getWMSCapabilities(response._id, function(){
	            	if($scope.WMS.capabilities.hasOwnProperty("WMS_Capabilities")){
	            		//Link ist WMS, also fortfahren
	            		console.log($scope.WMS.capabilities.WMS_Capabilities);
	            		$scope.datasetInfo._id = response._id;
	            		$scope.WMS.step1();
	            	}
	            	else {
	            		//Link ist kein WMS, also wird weiter geprueft
	            		$http.delete($scope.url + 'layers/' + response._id)
						.success(function(deleteResponse){ 
						});
						$scope.checkSHP();
	            	}
            	});
            });
	}

	//TODO
	$scope.checkSHP = function(){
		$scope.datasetInfo.type = "Shapefile";
		var _urlParts = $scope.datasetInfo.url.split('.');
		var _fileEnding = _urlParts[_urlParts.length-1];
		if(_fileEnding == "zip"){
			console.log("TODO: check shp");
    		$scope.invalidInput();
			//TODO: validate Shapefile

		} else if(_fileEnding == "csv"){
			$scope.checkCSV();
		} else  if(_fileEnding == "json"){
			$scope.checkJSON();
		} else {
			$scope.checkGeoJSON();
		}
	}

	$scope.checkCSV = function(){
		$scope.datasetInfo.type = "CSV";
		//get string der quelle
		$.get($scope.datasetInfo.url, function(response){
			var _string = response;
			$scope.CSV.step1(_string);
		}).fail(function(response){
    		console.log("error: bitt url überprüfen");
    		$scope.invalidInput();
        });/*
		$http.get($scope.datasetInfo.url).success(function(response){
			var _string = response;
			$scope.CSV.step1(_string);
		}).error(function(response){
    		console.log("error: bitt url überprüfen");
    		$scope.invalidInput();
        });*/
	}

	$scope.checkGeoJSON = function(){
		console.log("check geojson");
		$scope.datasetInfo.type = "GeoJSON";

		//get string der quelle
		$http.get($scope.datasetInfo.url).success(function(response){
			var _features = response;
			if(_features.hasOwnProperty("type")){
				$http.post($scope.url + "geojson", _features)
		            .success(function(response){
		            	if (response == false) {
		            		//
		            		console.log("not valid");
		            		$scope.invalidInput();
		            	} else {
		            		console.log("valid");
            				$scope.GeoJSON.dataPreview(response);
		            	}
		            });
            }
		}).error(function(response){
    		console.log("error: bitt url überprüfen");
    		$scope.invalidInput();
        });

	}

	//TODO
	$scope.checkJSON = function(){
		$.get($scope.datasetInfo.url, function(response){
			var _string = response;
			$scope.JSON.dataPreview(_string);
			$scope.datasetInfo.type = "JSON";
		}).fail(function(response){
    		console.log("error: bitt url überprüfen");
    		$scope.invalidInput();
        });
		
	}

	$scope.invalidInput = function(){
		console.log("invalid input");
	}

	/***********************************************
	********************* CSV:**********************
	************************************************/

	$scope.CSV = {};
	$scope.CSV.delimiter = "";
	$scope.CSV.string = "";
	$scope.CSV.fields = ["lat", "lon", "pi", "de"];

	$scope.CSV.step1 = function(string){
		console.log("CSV");
		//choose delimiter
		$scope.CSV.string = string;
		$scope.show.CSVDelimiter = true;
		document.getElementById("CSVdelimiterPanel").className = "panel panel-default";
		$("#collapse2").collapse({
			parent: '#accordion',
			toggle: true
		});
	}

	$scope.CSV.step2 = function(){
		//choose lat/lon fields
		$scope.CSV.getFields();
		$scope.CSV.lat = $scope.CSV.fields[0];
		$scope.CSV.lon = $scope.CSV.fields[1];
		console.log($scope.CSV.fields);
		$scope.show.CSVFields = true;
		$("#collapse2a").collapse({
			parent: '#accordion',
			toggle: true
		});
	}

	$scope.CSV.setDelimiter = function(delimiter){
		$scope.CSV.delimiter = delimiter;
		$scope.CSV.step2();
	}

	$scope.CSV.setLat = function(field){
		$scope.CSV.lat = field;
	}

	$scope.CSV.setLon = function(field){
		$scope.CSV.lon = field;
	}

	$scope.CSV.getFields = function(){
		var _head = $scope.CSV.string.split("\n")[0];
		var _fields = _head.split($scope.CSV.delimiter);
		$scope.CSV.fields = _fields;
	}

	$scope.CSV.saveData = function(){
		var _options = {
				"content": $scope.CSV.string,
				"lat": $scope.CSV.lat,
				"lon": $scope.CSV.lon,
				"delimiter": $scope.CSV.delimiter,
				"crs": 4326
			};

		$http.post($scope.url + "geojson/csv", _options)
            .success(function(response){
            	if (response == false) {
            		//
            		console.log("not valid");
            		$scope.invalidInput();
            	} else {
            		console.log("valid");
            		$scope.GeoJSON.dataPreview(response);
            	}
			});
    }

    $scope.CSV.notSpatial = function(){
    	$scope.CSV.toJSON();
    }

    $scope.CSV.toJSON = function(){
		var lines = $scope.CSV.string.split("\n");

		var result = [];

		var headers=lines[0].split($scope.CSV.delimiter);

		for(var i = 1; i < lines.length;i++){

			var obj = {};
			var currentline=lines[i].split($scope.CSV.delimiter);

			for(var j=0;j<headers.length;j++){
				obj[headers[j]] = currentline[j];
			}

			result.push(obj);

		}

		//return result; //JavaScript object
		$scope.JSON.dataPreview(JSON.parse(JSON.stringify(result))); //JSON
    }

	/***********************************************
	******************* GeoJSON:********************
	************************************************/

	$scope.GeoJSON = {};

	$scope.GeoJSON.dataPreview = function(geojson){
		console.log("geojson preview");
		$scope.datasetInfo.info = geojson._id;
		console.log($scope.datasetInfo);
		$scope.show.DataPreview = true;
		$("#collapse2b").collapse({
			parent: '#accordion',
			toggle: true
		});
		$("#collapse2b").on('shown.bs.collapse', function(){
			if(datamap != null){
				datamap.remove();
			}
			initDataMap();
			addGeoJSON(geojson);
	    });
	}

	$scope.GeoJSON.submit = function(){
		console.log($scope.datasetInfo);
		$http.post($scope.url + "layers", $scope.datasetInfo)
            .success(function(response){
            	window.location.href = '#';
            });
	}

	/***********************************************
	********************* JSON: ********************
	************************************************/

	$scope.JSON = {};

	$scope.JSON.dataPreview = function(json){
		$scope.datasetInfo.info = json;
		console.log($scope.datasetInfo.info);
		document.getElementById("JSONpreviewPanel").className = "panel panel-default";
		$("#collapse2c").collapse({
			parent: '#accordion',
			toggle: true
		});
		$scope.show.DataPreviewJSON = true;
	}

	$scope.JSON.submit = function(){
		$http.post($scope.url + "layers", $scope.datasetInfo)
            .success(function(response){
            	window.location.href = '#';
            });
	}

	/***********************************************
	********************* WMS:**********************
	************************************************/

	$scope.WMS = {};
	$scope.WMS.fileSizeMin = 0;
	$scope.WMS.fileSizeMax = 0;

	$scope.WMS.options = {
		"name": "",
		"url": "",
		"bbox": {"xmin":7.5967, "xmax":7.6465, "ymin":51.9418, "ymax":51.9708},
		"zoom": {
			"min": 12,
			"max": 14
		},
		"layer": "",
		"EPSG": 4326
	};

	$scope.getWMSCapabilities = function(id, callback){
		$scope.WMS.capabilities = "";
		console.log(id);
		$http.get($scope.url + "WMS/" + id).success(function(response){
			$scope.WMS.capabilities = response;
			callback();
		}).error(function(data, status, headers, config){
			console.log("error");
		});
		
	};

	//Schritt1: Layer des WMS auswaehlen
	$scope.WMS.step1 = function(){
		console.log("WMS gefunden: " + $scope.datasetInfo._id + ", bitte nun Layer auswaehlen");
		$scope.getLayerNames();
		$scope.show.WMSLayer = true;
		$("#collapse3").collapse({
			parent: '#accordion',
			toggle: true
		});
	}

	//Schritt2: Bereich auswaehlen
	$scope.WMS.step2 = function(){
		$scope.show.chooseArea = true;
		$("#collapse4").collapse({
			parent: '#accordion'
		});
		$("#collapse4").on('shown.bs.collapse', function(){
			if(map != null){
				map.remove();
			}
			initBBMap();
			console.log(map);
			addLayer($scope.WMS.options.layer, $scope.WMS.options.url, map); //add layer to the maps (function from addWms.js)
	    });
	}

	//Schritt3: Zoomstufen auswaehlen
	$scope.WMS.step3 = function(){
		$scope.WMS.fileSizeMin = estimateFilesize($scope.WMS.options)[0];
		$scope.WMS.fileSizeMax = estimateFilesize($scope.WMS.options)[1];
		$scope.show.WMSZoom = true;
		$("#collapse5").collapse({
			parent: '#accordion'
		});
		$("#collapse5").on('shown.bs.collapse', function(){
			if(map1 != null){
				map1.remove();
				map2.remove();
			}
			initZoomMaps();
			addLayer($scope.WMS.options.layer, $scope.WMS.options.url, map1); //add layer to the maps (function from addWms.js)
	    	addLayer($scope.WMS.options.layer, $scope.WMS.options.url, map2); //add layer to the maps (function from addWms.js)
	    	console.log($scope.WMS.options);
	    	var bounds = [[	$scope.WMS.options.bbox.ymin,
	    			 		$scope.WMS.options.bbox.xmin
			 			], 
	    				[	$scope.WMS.options.bbox.ymax,
	    					$scope.WMS.options.bbox.xmax
	    				]];
			L.rectangle(bounds).addTo(map1);
			L.rectangle(bounds).addTo(map2);
	    });
	}

	$scope.WMS.step4 = function(){
		$scope.downloadWms();
        window.location.href = '#';
	}

	$scope.getLayerNames = function(){
		$scope.WMS.layers = new Array();
		if($scope.WMS.capabilities.WMS_Capabilities.Capability.Layer.Layer.length > 0){
			for (var i = 0; i < $scope.WMS.capabilities.WMS_Capabilities.Capability.Layer.Layer.length; i++) {
				var currentLayer = $scope.WMS.capabilities.WMS_Capabilities.Capability.Layer.Layer[i];
				$scope.WMS.layers.push({
					"titles":  currentLayer.Title,
					"names": currentLayer.Name
				});
			};
		}
		else {
			$scope.WMS.layers.push({
				"titles":  $scope.WMS.capabilities.WMS_Capabilities.Capability.Layer.Layer.Title,
				"names": $scope.WMS.capabilities.WMS_Capabilities.Capability.Layer.Layer.Name
			});
		}
		console.log($scope.WMS.layers.titles);
	};

	$scope.addLayer = function(name){
		$scope.WMS.options.layer = name;
		$scope.WMS.options.url = $scope.datasetInfo.url;
		$scope.WMS.options.name = $scope.datasetInfo.name;
		$scope.WMS.step2();
	};

	$scope.downloadWms = function(){
		console.log("WMS herunterladen:");
		console.log($scope.WMS.options);
		$http.post($scope.url + "WMS", $scope.WMS.options)
			.success(function(response){
				console.log("WMS download erfolgreich");
			});
		
	};

	$scope.updateZoom = function(){
		map1.setZoom($scope.WMS.options.zoom.min);
		map2.setZoom($scope.WMS.options.zoom.max);
		$scope.WMS.fileSizeMin = estimateFilesize($scope.WMS.options)[0];
		$scope.WMS.fileSizeMax = estimateFilesize($scope.WMS.options)[1];
	};

	$scope.updateBbox = function(minmax){
		if (minmax == 'min') {
			if ($scope.WMS.options.bbox.xmin > $scope.WMS.options.bbox.xmax) {
				$scope.WMS.options.bbox.xmin = $scope.WMS.options.bbox.xmax;
			};
			if ($scope.WMS.options.bbox.ymin > $scope.WMS.options.bbox.ymax) {
				$scope.WMS.options.bbox.ymin = $scope.WMS.options.bbox.ymax;
			};
		};
		if (minmax == 'max') {
			if ($scope.WMS.options.bbox.xmin > $scope.WMS.options.bbox.xmax) {
				$scope.WMS.options.bbox.xmax = $scope.WMS.options.bbox.xmin;
			};
			if ($scope.WMS.options.bbox.ymin > $scope.WMS.options.bbox.ymax) {
				$scope.WMS.options.bbox.ymax = $scope.WMS.options.bbox.ymin;
			};
		};
		insertRectangle(
			$scope.WMS.options.bbox.ymax,
			$scope.WMS.options.bbox.xmax,
			$scope.WMS.options.bbox.ymin,
			$scope.WMS.options.bbox.xmin
			);
		$scope.WMS.fileSizeMin = estimateFilesize($scope.WMS.options)[0];
		$scope.WMS.fileSizeMax = estimateFilesize($scope.WMS.options)[1];
	};

	/***********************************************
	******************** File:**********************
	************************************************/

	$scope.handleFileUpload = function(evt){
		var _file = evt.target.files;

		if (_file.length == 1){
			var _filenameparts = _file[0].name.split(".");
			var _ending = _filenameparts[_filenameparts.length-1];
			var _content = "";

			var _reader = new FileReader();
			_reader.readAsText(_file[0], "UTF-8");

			_reader.onload = function(e){
				_content = e.target.result;
				console.log(_content);

				if(_ending == "csv"){
					$scope.datasetInfo.type = "CSV";
					$scope.datasetInfo.url = "lokale Datei";
					$scope.CSV.step1(_content);
				}
				else if(_ending == "geojson"){
					_content = JSON.parse(_content);
					$scope.datasetInfo.type = "GeoJSON";
					if(_content.hasOwnProperty("type")){
						$http.post($scope.url + "geojson", _content)
				            .success(function(response){
				            	if (response == false) {
				            		//
				            		console.log("not valid");
				            		$scope.invalidInput();
				            	} else {
				            		console.log("valid");
									$scope.datasetInfo.url = "lokale Datei";
		            				$scope.GeoJSON.dataPreview(response);
				            	}
				            });
		            }
				}
				else if(_ending == "json"){
					_content = JSON.parse(_content);
					$scope.JSON.dataPreview(_content);
				}
			}

		}


	}
	document.getElementById('fileInput').addEventListener('change', $scope.handleFileUpload, false);
	

});

function estimateFilesize(options){
	var tiles = 0;
	for (var i = options.zoom.min; i <= options.zoom.max; i++) {
		var nx = - xCoordToTile(options.bbox.xmin, i) + xCoordToTile(options.bbox.xmax, i);
		var ny = - yCoordToTile(options.bbox.ymax, i) + yCoordToTile(options.bbox.ymin, i);
		console.log(nx + "/" + ny);
		tiles = tiles + ((nx+3) * (ny+3));
	};
	console.log("tiles: " + tiles);
	var sizeMin = Math.floor(tiles * 20 / 1000); //ca. 20KB pro Tile minimum
	var sizeMax = Math.floor(tiles * 170 / 1000); //ca. 170KB pro Tile maximum
	console.log([sizeMin, sizeMax]);
	return [sizeMin, sizeMax];
}

function xCoordToTile(xCoord, zoom){
	return Math.floor(((xCoord + 180) / 360) * Math.pow(2, zoom));
}


function yCoordToTile(yCoord, zoom){
	return Math.floor((1 - Math.log(Math.tan(deg2rad(yCoord)) + 1 / Math.cos(deg2rad(yCoord))) / Math.PI) / 2 * Math.pow(2, zoom));
}

function deg2rad(x){
	return x * Math.PI / 180;
}
