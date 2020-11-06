// Earthquakes Custome Search
// https://earthquake.usgs.gov/earthquakes/search/


// Earthquake data link
var EarthquakeLink = "https://earthquake.usgs.gov/fdsnws/event/1/query.geojson?starttime=2010-08-27%2000:00:00&endtime=2018-09-03%2023:59:59&maxlatitude=42.294&minlatitude=32.064&maxlongitude=-113.862&minlongitude=-124.893&minmagnitude=4.5&orderby=time"

// Tectonic plates link
var TectonicPlatesLink = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// Performing a GET request to the Earthquake query URL
d3.json(EarthquakeLink, function (data) {
    // Once there is a response, sending the data.features object to the createFeatures function
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    // Creating a GeoJSON layer containing the features array on the earthquakeData object
    // Runing the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJson(earthquakeData, {
        onEachFeature: function (feature, layer) {
            var newDate = new Date(feature.properties.time);

            layer.bindPopup("<h3>Location: " + feature.properties.place + "<br>Magnitude: " + feature.properties.mag +
                "</h3><hr><h4>Date & Time: " + newDate + "</h4>");

            // var newYear = newDate.getFullYear()
            // console.log(newYear);
        },
       
        pointToLayer: function (feature, latlng) {
            var newDate = new Date(feature.properties.time);
            var newYear = new Date(newDate.getFullYear());
            return new L.circle(latlng,
                {   
                    radius: getRadius(feature.properties.mag),
                    fillColor: getColor(newYear),
                    fillOpacity: .7,
                    stroke: true,
                    color: "black",
                    weight: .5
                })        
        }      
    });
    
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes)
}

function createMap(earthquakes) {
    // Creating map layers
    var streetsatellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets-satellite",
        accessToken: API_KEY
    });

     var streetsmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });

    // Defining a baseMaps object to hold base layers
    var baseMaps = {
        "Satelite Map": streetsatellitemap,
        "Street Map": streetsmap,
        "Dark Map": darkmap
    };

    // Adding a tectonic plate layer
    var tectonicPlates = new L.LayerGroup();

    // Creating overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes,
        "Tectonic Plates": tectonicPlates
    };

    // Creating our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [37, -119],
        zoom: 5.5,
        layers: [streetsatellitemap, earthquakes, tectonicPlates]
    });

    // Adding Techtonic lines data
    d3.json(TectonicPlatesLink, function (plateData) {
        // Adding our geoJSON data, along with style information, to the tectonicplates layer.
        L.geoJson(plateData, {
            color: "red",
            weight: 3.5
        })
        .addTo(tectonicPlates);
    });

    // Creating a layer control
    // Passing in our baseMaps and overlayMaps
    // Adding the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Creating legend
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (myMap) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018],
            labels = [];

        // Looping through density intervals and generate a label with a colored square for each interval
        grades.forEach((value, index) => {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[index]) + '"></i> ' +
            grades[index] + (grades[index] ?'<br>' : '+');
        })
        return div;
    };

    legend.addTo(myMap);
}

function getColor(d) {
    return d > 2017 ? '#FF3333' :
        d > 2016 ? '#FF9933' :
            d > 2015 ? '#FFFF33' :
                d > 2014 ? '#99FF33' :
                    d > 2013 ? '#33FF33' :
                        d > 2012 ? '#33FFFF' :
                            d > 2011 ? '#3399FF' :
                                d > 2010 ? '#3333FF' : '#9933FF';
}

function getRadius(value) {
    return value * 10000
}




// // datasets:
// var significantEarthquakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"
// var m4_5PlusEarthquakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson"
// var m2_5PlusEarthquakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson"
// var m1PlusEarthquakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson"
// var allEarthquakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
// var tectonicPlates = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"


// var significantEarthquakesData = getData(significantEarthquakes);
// var m4_5PlusEarthquakesData = getData(m4_5PlusEarthquakes);
// var m2_5PlusEarthquakesData = getData(m2_5PlusEarthquakes);
// var m1PlusEarthquakesData = getData(m1PlusEarthquakes);
// var allEarthquakesData = getData(allEarthquakes);
// var tectonicPlatesData = getData(tectonicPlates);


// function getData(queryUrl) {
//     d3.json(queryUrl, function(data) {
//         console.log(data.features)
//         return data.features
//     });
// }

// var significantEarthquakesLayer = new L.LayerGroup();
// var m4_5PlusEarthquakesLayer = new L.LayerGroup();
// var m2_5PlusEarthquakesLayer = new L.LayerGroup();
// var m1PlusEarthquakesLayer = new L.LayerGroup();
// var tectonicPlatesLayer = new L.LayerGroup();
// var allEarthquakesLayer = new L.LayerGroup();



// function createLayer(data) {
//     var initialLayer = L.geoJSON(data, {
//         onEachFeature: (feature, layer) => {
//             var dateOcurrence = new Date(feature.properties.time);
//             layer.bindPopup("<h3>" + feature.properties.title +
//             "</h3><hr><p>" + dateOcurrence + "</p>");
//         },
//         pointToLayer: (feature, coordinate) => {
//             return new L.Circle(coordinate,
//                 {
//                     radius: getSize(feature.properties.mag * 10000),
//                     fillColor: getColor(feature.properties.mag),
//                     fillOpacity: 0.5,
//                     stroke: true,
//                     color: "black",
//                     weight: 0.5
//                 })
//         }
//     });
//     return initialLayer
// }

// significantEarthquakesLayer = createLayer(significantEarthquakesData);
// m4_5PlusEarthquakesLayer = createLayer(m4_5PlusEarthquakesData);
// m2_5PlusEarthquakesLayer = createLayer(m2_5PlusEarthquakesData);
// m1PlusEarthquakesLayer = createLayer(m1PlusEarthquakesData);
// tectonicPlatesLayer = createLayer(tectonicPlatesData);
// allEarthquakesLayer = createLayer(allEarthquakesData);




// console.log(m4_5PlusEarthquakesLayer); //addTo(myMap);
// // console.log(overlayMaps["Significant Earthquakes"]); //addTo(myMap);


// function createMap(earthquakes) {
//     var pencil = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//         attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//         maxZoom: 18,
//         id: "mapbox.pencil",
//         accessToken: API_KEY
//         });
        
//     var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//         attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//         maxZoom: 18,
//         id: "mapbox.light",
//         accessToken: API_KEY
//         });
        
//     var dark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//         attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//         maxZoom: 18,
//         id: "mapbox.dark",
//         accessToken: API_KEY
//         });

//     var myMap = L.map("map", {
//         center: [
//             37.09, -95.71
//         ],
//         zoom: 5,
//         layers: [earthquakes,pencil]
//         });
   
//     var baseMaps = {
//         Pencil: pencil,
//         Light: light,
//         Dark: dark
//         };
    
//     var overlayMaps = {
//         "Significant Earthquakes": significantEarthquakesLayer,
//         "M4.5+ Earthquakes": m4_5PlusEarthquakesLayer,
//         "M2.5+ Earthquakes": m2_5PlusEarthquakesLayer,
//         "M1.0+ Earthquakes": m1PlusEarthquakesLayer,
//         "All Earthquakes": allEarthquakesLayer,
//         "Tectonic Plates": tectonicPlatesLayer
//         };
        
//     // Overlays that may be toggled on or off
//     tectonicPlatesData.addTo(tectonicPlatesLayer);
//     significantEarthquakesData.addTo(significantEarthquakesLayer);
//     m4_5PlusEarthquakesData.addTo(m4_5PlusEarthquakesLayer);
//     m2_5PlusEarthquakesData.addTo(m2_5PlusEarthquakesLayer);
//     m1PlusEarthquakesData.addTo(m1PlusEarthquakesLayer);

//     L.control.layers(baseMaps, overlayMaps, {
//             collapsed: false
//         }).addTo(myMap);

//     var legend = L.control({position:'bottomright'});
//     legend.onAdd = (myMap) => {
//         var div = L.DomUtil.create('div','legend'),
//         grades = [0,1,2.5,3.5,4.5,5.5,6,7,8]
//         grades.forEach((value,index) => {
//             div.innerHTML +=
//                 '<i style="background:' + getColor(grades[index]) + '"></i>' + grades[index] +(grades[index] ? '<br>' : '+');
//         })
//         return div;
//     };

//     legend.addTo(myMap);
// }

// function getColor(mag) {
//     return mag > 8 ? '#7f2704':
//            mag > 7 ? '#a63603':
//            mag > 5.5 ? '#f16913':
//            mag > 4.5 ? '#fd8d3c':
//            mag > 3.5 ? '#fdae6b':
//            mag > 2.5 ? '#fdd0a2':
//            mag > 1 ? '#fee6ce':
//            '#fff5eb'
// }
// createMap(allEarthquakesLayer)