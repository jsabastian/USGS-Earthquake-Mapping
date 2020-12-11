# D3/Leaflet Mappping of USGS Data

1. The USGS GeoJSON Feed provides earthquake data in a number of different formats, updated every 5 minutes.(http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) I picked a data set to visualize, using the URL of this JSON to pull in the data for the visualization.

2. I created a map using Leaflet that plots all of the earthquakes from the data set based on their longitude and latitude.

   * The data markers reflect the magnitude of the earthquake by their size and and depth of the earth quake by color. Earthquakes with higher magnitudes appear          larger and earthquakes with greater depth appear darker in color.

   * Popups provide additional information about the earthquake when a marker is clicked.

   * A legend provided context for the map data.
