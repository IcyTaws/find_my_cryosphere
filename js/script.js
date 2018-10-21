$(function(){
	$('.open-sidebar').on('click', function(e){
		e.preventDefault();
		openNav();
	});
	$('.close-sidebar').on('click', function(e){
		e.preventDefault();
		closeNav($(this));
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
	    		wwd.redraw();
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
	    		wwd.redraw();
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
	polygonGeoJSON.load(null, shapeConfigurationCallback, glaciars_layer);
	wwd.addLayer(glaciars_layer);
	// Permafrost Layer
	var permafrost_layer = new WorldWind.RenderableLayer('permafrost');
	permafrost_layer.enabled = false;
	var permafrostGeoJSON = new WorldWind.GeoJSONParser('../data/permafrost_all.geojson');
	permafrostGeoJSON.load(null, shapeConfigurationCallback, permafrost_layer);
	wwd.addLayer(permafrost_layer);
});
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
    wwd.addLayer(layer);
    layerManager.synchronizeLayerList();
};