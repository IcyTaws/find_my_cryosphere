

$(function(){
	$('.open-sidebar').on('click', function(e){
		e.preventDefault();
		openNav();
	});
	$('.close-sidebar').on('click', function(e){
		e.preventDefault();
		closeNav($(this));
	});
	$('.impact').on('click', function(e){
		e.preventDefault();
		if ($(this).hasClass('navbar-toggled')) {
			$('.well').fadeOut();
			$(this).removeClass('navbar-toggled');
			
		} else {
			$('.well').fadeIn();
			$(this).addClass('navbar-toggled');
		}
	});
	$('.location').on('click', function(e){
		e.preventDefault();
		if ($(this).hasClass('navbar-toggled')) {
			$(this).removeClass('navbar-toggled');
			wwd.layers.forEach(function(layer){
				if (layer.displayName == 'placemark') {
					layer.enabled = false;
					wwd.redraw();
				}
			});
		} else {
			$(this).addClass('navbar-toggled');
			wwd.layers.forEach(function(layer){
				if (layer.displayName == 'placemark') {
					layer.enabled = true;
					wwd.redraw();
				}
			});
		}
	});
	$.fn.TinyToggle.palettes['custom'] = {
	    check: '#22A7F0',
	    uncheck: '#f39c12'
	};
	$('#glaciars-toggle').tinyToggle({
	    type: 'toggle',
	    palette: 'custom', 
	    size: 'medium',
	    onChange: function(obj, val){
	    	if (val) {
	    		wwd.layers.forEach(function(layer){
	    			if (layer.displayName == 'glaciares') {
	    				layer.enabled = true;
	    				wwd.redraw();
	    			}
	    		});
	    	} else {
	    		wwd.layers.forEach(function(layer){
	    			if (layer.displayName == 'glaciares') {
	    				layer.enabled = false;
	    				wwd.redraw();
	    			}
	    		});
	    	}
	    }
	});
	$('#permafrost-toggle').tinyToggle({
	    type: 'toggle',
	    palette: 'custom', 
	    size: 'medium',
	    onChange: function(obj, val){
	    	if (val) {
	    		wwd.layers.forEach(function(layer){
	    			if (layer.displayName == 'permafrost') {
	    				layer.enabled = true;
	    				wwd.redraw();
	    			}
	    		});
	    	} else {
	    		wwd.layers.forEach(function(layer){
	    			if (layer.displayName == 'permafrost') {
	    				layer.enabled = false;
	    				wwd.redraw();
	    			}
	    		});
	    	}
	    }
	});
	$('#snow-toggle').tinyToggle({
	    type: 'toggle',
	    palette: 'custom', 
	    size: 'medium',
	    onChange: function(obj, val){
	    	if (val) {
	    		wwd.layers.forEach(function(layer){
	    			if (layer.displayName == 'snow_Jan') {
	    				layer.enabled = true;
	    				wwd.redraw();
	    			}
	    		});
	    	} else {
	    		wwd.layers.forEach(function(layer){
	    			if (layer.displayName == 'snow_Jan' || layer.displayName == 'snow_Feb') {
	    				layer.enabled = false;
	    				wwd.redraw();
	    			}
	    		});
	    	}
	    }
	});
	$('#month-control').on('change', function(){
		/*if ($(this).val() == 'Jan') {
			wwd.layers.forEach(function(layer){
				if (layer.displayName == 'snow_Jan') {
					layer.enabled = false;
				}
				if (layer.displayName == 'snow_Feb') {
					layer.enabled = true;
				}
				wwd.redraw();
			});
		} else {
			wwd.layers.forEach(function(layer){
				if (layer.displayName == 'snow_Jan') {
					layer.enabled = true;
				}
				if (layer.displayName == 'snow_Feb') {
					layer.enabled = false;
				}
				wwd.redraw();
			});
		}*/
		if ($(this).val() == 'Jan') {
			console.log($(this).val());
			$('.well1 ul').html('<li>Mota</li><li>Striper</li>');
			$('.well2 ul').html('<li>Papa</li>');
		} else if($(this).val() == 'Feb') {
			$('.well1 ul').html('<li>Mota</li><li>Striper</li><li>Lubina</li>');
			$('.well2 ul').html('<li>Papa</li>');
		} else if($(this).val() == 'Mar') {
			$('.well1 ul').html('<li>Mota</li>');
			$('.well2 ul').html('<li>Papa</li><li>Alcachofa</li>');
		}
	});
});
$(window).on('load', function(){
	// Create a WorldWindow object for the canvas.
	wwd = new WorldWind.WorldWindow("canvasOne");
	// Add some image layers to the WorldWindow's globe.
	wwd.addLayer(new WorldWind.BMNGOneImageLayer());
	wwd.addLayer(new WorldWind.BMNGLandsatLayer());
	// Add a compass, a coordinates display and some view controls to the WorldWindow.
	// wwd.addLayer(new WorldWind.CompassLayer());
	wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd));
	wwd.addLayer(new WorldWind.ViewControlsLayer(wwd));
	set_current_location();

	// Tell the WorldWindow that we want deep picking.
	wwd.deepPicking = true;
	// The common pick-handling function.
	var handlePick = function (o) {
	    // The input argument is either an Event or a TapRecognizer. Both have the same properties for determining
	    // the mouse or tap location.
	    var x = o.clientX,
	        y = o.clientY;

	    // Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
	    // relative to the upper left corner of the canvas rather than the upper left corner of the page.
	    var pickList = wwd.pick(wwd.canvasCoordinates(x, y));


	    pickList.objects.forEach(function(o){
	    	if (o.parentLayer != null && o.parentLayer.displayName =='countries') {
    			$('.well').fadeIn();
    			$('.impact').addClass('navbar-toggled');
	    	}
	    });
	};
	// Listen for mouse moves and highlight the placemarks that the cursor rolls over.
	wwd.addEventListener("mousemove", handlePick);

	// GEOJSON TEST
	var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
	placemarkAttributes.imageScale = 0.05;
	placemarkAttributes.imageColor = WorldWind.Color.WHITE;
	placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
	    WorldWind.OFFSET_FRACTION, 0.5,
	    WorldWind.OFFSET_FRACTION, 1.5);
	placemarkAttributes.imageSource = "../img/white-dot.png";
	// Glaciars Layer
	var glaciars_layer = new WorldWind.RenderableLayer('glaciares');
	glaciars_layer.enabled = false;
	var polygonGeoJSON = new WorldWind.GeoJSONParser('../data/ne_glaciated_areas.geojson');
	polygonGeoJSON.load(null, glacierCallback, glaciars_layer);
	wwd.addLayer(glaciars_layer);
	// Permafrost Layer
	var permafrost_layer = new WorldWind.RenderableLayer('permafrost');
	permafrost_layer.enabled = false;
	var permafrostGeoJSON = new WorldWind.GeoJSONParser('../data/permafrost_all.geojson');
	permafrostGeoJSON.load(null, permafrost_layerCallback, permafrost_layer);
	wwd.addLayer(permafrost_layer);
	// USA Layer
	var countries_layer = new WorldWind.RenderableLayer('countries');
	countries_layer.enabled = true;
	var countriesGeoJSON = new WorldWind.GeoJSONParser('../data/usa_poly.json');
	countriesGeoJSON.load(parserCompletionCallback, shapeConfigurationCallback, countries_layer);
	wwd.addLayer(countries_layer);
	// SnowCover Layer
	var snow_layer = new WorldWind.RenderableLayer('snow_Jan');
	snow_layer.enabled = false;
	var snow_layerGeoJSON = new WorldWind.GeoJSONParser('../data/merged.geojson');
	snow_layerGeoJSON.load(null, snow_layerConfCallback_jan,snow_layer);
	wwd.addLayer(snow_layer);
	var snow_layer = new WorldWind.RenderableLayer('snow_Feb');
	snow_layer.enabled = false;
	var snow_layerGeoJSON = new WorldWind.GeoJSONParser('../data/merged.geojson');
	snow_layerGeoJSON.load(null, snow_layerConfCallback_feb,snow_layer);
	wwd.addLayer(snow_layer);
});
function set_current_location () {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			var placemark_layer = new WorldWind.RenderableLayer('placemark');
			placemark_layer.enabled = false;
			wwd.addLayer(placemark_layer);
			var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
			placemarkAttributes.imageOffset = new WorldWind.Offset(
			    WorldWind.OFFSET_FRACTION, 0.3,
			    WorldWind.OFFSET_FRACTION, 0.0);
			placemarkAttributes.labelAttributes.color = WorldWind.Color.YELLOW;
			placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
			            WorldWind.OFFSET_FRACTION, 0.5,
			            WorldWind.OFFSET_FRACTION, 1.0);
			placemarkAttributes.imageSource = '../img/castshadow-orange.png';
			var position = new WorldWind.Position(pos.lat, pos.lng, 100.0);
			var placemark = new WorldWind.Placemark(position, false, placemarkAttributes);
			placemark.label = "Usted está aquí\n" +
			    "Lat " + placemark.position.latitude.toPrecision(4).toString() + "\n" +
			    "Lon " + placemark.position.longitude.toPrecision(5).toString();
			placemark.alwaysOnTop = true;
			placemark_layer.addRenderable(placemark);
		}, function() {
			handleLocationError(true, infoWindow, map.getCenter());
		});
	} else {
		// Browser doesn't support Geolocation
		handleLocationError(false, infoWindow, map.getCenter());
	}
}

permafrost_layerCallback = function (geometry,properties){
	var configuration = {};
	configuration.attributes = new WorldWind.ShapeAttributes(null);

	// Fill the polygon with a custom color
	configuration.attributes.interiorColor = new WorldWind.Color(
		218/255, 
		237/255,
		254/255,
		0.8);
	// Paint the outline in a darker variant of the interior color.
	configuration.attributes.outlineColor = new WorldWind.Color(
		0.5 * configuration.attributes.interiorColor.red,
		0.5 * configuration.attributes.interiorColor.green,
		0.5 * configuration.attributes.interiorColor.blue,
		1.0);
	return configuration;
}

snow_layerConfCallback_jan = function (geometry,properties){
	var configuration = {}
	configuration.attributes = new WorldWind.ShapeAttributes(null);
	var mm_snow = properties.resumen_data_Jan
	configuration.attributes.interiorColor = new WorldWind.Color(
		1, // Red
		1, // Green
		1, // Blue
		mm_snow/255)
        
    // Paint the outline in a darker variant of the interior color.
	configuration.attributes.outlineColor = new WorldWind.Color(
    0.5 * configuration.attributes.interiorColor.red,
    0.5 * configuration.attributes.interiorColor.green,
    0.5 * configuration.attributes.interiorColor.blue,
    1.0);
    return configuration;
}

snow_layerConfCallback_feb = function (geometry,properties){
	var configuration = {}
	configuration.attributes = new WorldWind.ShapeAttributes(null);
	var mm_snow = properties.resumen_data_Feb
	configuration.attributes.interiorColor = new WorldWind.Color(
		1, // Red
		1, // Green
		1, // Blue
		mm_snow/255)
        
    // Paint the outline in a darker variant of the interior color.
	configuration.attributes.outlineColor = new WorldWind.Color(
    0.5 * configuration.attributes.interiorColor.red,
    0.5 * configuration.attributes.interiorColor.green,
    0.5 * configuration.attributes.interiorColor.blue,
    1.0);
    return configuration;
}

glacierCallback = function (geometry,properties){
	var configuration = {};
	configuration.attributes = new WorldWind.ShapeAttributes(null);

        // Fill the polygon with a custom color
        configuration.attributes.interiorColor = new WorldWind.Color(
			201/255, 
			255/255,
			252/255,
            0.5);
        // Paint the outline in a darker variant of the interior color.
        configuration.attributes.outlineColor = new WorldWind.Color(
            0.5 * configuration.attributes.interiorColor.red,
            0.5 * configuration.attributes.interiorColor.green,
            0.5 * configuration.attributes.interiorColor.blue,
			1.0);
	return configuration;
}
shapeConfigurationCallback = function (geometry, properties) {
    var configuration = {};

    if (geometry.isPointType() || geometry.isMultiPointType()) {
        configuration.attributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);

        if (properties && (properties.name || properties.Name || properties.NAME)) {
            configuration.name = properties.name || properties.Name || properties.NAME;
        }
        if (properties && properties.POP_MAX) {
            var population = properties.POP_MAX;
            configuration.attributes.imageScale = 0.01 * Math.log(population);
        }
    }
    else if (geometry.isLineStringType() || geometry.isMultiLineStringType()) {
        configuration.attributes = new WorldWind.ShapeAttributes(null);
        configuration.attributes.drawOutline = true;
        configuration.attributes.outlineColor = new WorldWind.Color(
            0.1 * configuration.attributes.interiorColor.red,
            0.3 * configuration.attributes.interiorColor.green,
            0.7 * configuration.attributes.interiorColor.blue,
            1.0);
        configuration.attributes.outlineWidth = 2.0;
    }
    else if (geometry.isPolygonType() || geometry.isMultiPolygonType()) {
        configuration.attributes = new WorldWind.ShapeAttributes(null);
        // Fill the polygon with a random pastel color.
        
    	configuration.attributes.interiorColor = new WorldWind.Color(
            0.375 + 0.5 * Math.random(),
            0.375 + 0.5 * Math.random(),
            0.375 + 0.5 * Math.random(),
            0.5);
        
        // Paint the outline in a darker variant of the interior color.
    	configuration.attributes.outlineColor = new WorldWind.Color(
    	    0.5 * configuration.attributes.interiorColor.red,
       		0.5 * configuration.attributes.interiorColor.green,
        	0.5 * configuration.attributes.interiorColor.blue,
        	1.0);	
        
        
    }

    return configuration;
};

parserCompletionCallback = function (layer) {
	console.log(layer);
    // wwd.addLayer(layer);
    // layerManager.synchronizeLayerList();
};