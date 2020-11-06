// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createMap function
    createFeatures(data.features);
  });

function createFeatures(earthquakeData) {

  function markerSize(mag) {
    if (mag <= 1) {
      return(1);
    } else if ((mag > 1) && (mag <= 2)) {
      return(3);
    } else if ((mag > 2) && (mag <= 3)) {
      return(6);
    } else if ((mag > 3) && (mag <= 4)) {
      return(12);
    } else if ((mag > 4) && (mag <= 5)) {
      return(24);
    } else {
      return(48);
    };
  }

  function markerColor(mag) {
    if (mag <= 1) {
      return("limegreen");
    } else if ((mag > 1) && (mag <= 2)) {
      return("yellowgreen");
    } else if ((mag > 2) && (mag <= 3)) {
      return("orange");
    } else if ((mag > 3) && (mag <= 4)) {
      return("darkorange");
    } else if ((mag > 4) && (mag <= 5)) {
      return("chocolate");
    } else {
      return("darkred");
    };
  }

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function popUp(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.mag + " Magnitude - " + new Date(feature.properties.time) +
      "</h3><hr><p>" + (feature.properties.place) + "</p>");
  }

  function getCircleMarkers(feature, latlng) {
    return new L.CircleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        color: markerColor(feature.properties.mag),
        fillOpacity: 0.85
    });
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: popUp,
      pointToLayer: getCircleMarkers
    });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
    layers: [darkmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

   // Set up the legend
   var legend = L.control({ position: "bottomright" });
   legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var limits = [0,1,2,3,4,5];
      varcolors = ["limegreen", "yellowgreen", "orange", "darkorange", "chocolate", "darkred"];
      var labels = [];
 
    // Add min & max
    var legendInfo = "<h1>Median Income</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };
 
   // Adding legend to the map
  legend.addTo(myMap);
}