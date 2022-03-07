// MAPBOX API

mapboxgl.accessToken = mapBoxToken;

// Create a map centered to location of current user
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    // center: userCurrentLocation,
    center: [13.245896979766258, 30.48167704510781], // centers the map in the 'middle' of the atlas
    zoom: 1.8
});

const nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'bottom-right');

if ("geolocation" in navigator) { 
    navigator.geolocation.getCurrentPosition(position => {
        // Get user current location
        const userCurrentLocation =  [position.coords.longitude, position.coords.latitude];

        new mapboxgl.Marker({scale: 1}) // size of the marker
            .setLngLat(userCurrentLocation)
            .setPopup(
                new mapboxgl.Popup({offset: 40, className: 'my-class'})
                    .setHTML('<h3>Home</h3>')
                    .setMaxWidth("200px")
            )
            .addTo(map);
    })
}


// Add search control to the map.
const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    placeholder: "Search for Location"
});

document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
// document.querySelector('.mapboxgl-ctrl-geocoder--button').onclick = () => {
//     document.querySelector('.mapboxgl-ctrl-geocoder--input').style = 'width: 25vw';
// }
 
map.on('load', function () {
    
    // Add a new source from our GeoJSON data and
    // set the 'cluster' option to true. GL-JS will
    // add the point_count property to your source data.
    map.addSource('sessions', {
        type: 'geojson',
        data: sessions,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    });
    
    map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'sessions',
        filter: ['has', 'point_count'],
        paint: {
            // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
            // with three steps to implement three types of circles:
            //   * Blue, 20px circles when point count is less than 100
            //   * Yellow, 30px circles when point count is between 100 and 750
            //   * Pink, 40px circles when point count is greater than or equal to 750
            'circle-color': [
                'step',
                ['get', 'point_count'],
                '#51bbd6',
                5, // number of sessions displayed in circle
                '#f1f075',
                20,
                '#f28cb1'
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                15, // size of a circle
                10, // number of sessions displayed in circle
                20, // ...
                20, // ...
                25  // ...
            ]
        }
    });
    
    map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'sessions',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        }
    });
    
    map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'sessions',
        filter: ['!', ['has', 'point_count']],
        paint: {
            'circle-color': '#11b4da',
            'circle-radius': 5,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
        }
    });
    
    // inspect a cluster on click
    map.on('click', 'clusters', async function (e) {
        const features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters']
        });
        const clusterId = features[0].properties.cluster_id;
        await map.getSource('sessions').getClusterExpansionZoom(
            clusterId,
            function (err, zoom) {
            if (err) return;
            
            map.easeTo({
                    center: features[0].geometry.coordinates,
                    zoom: zoom
                });
            }
        );
        // if there is PopUp for new session close it
        const newSesPopup = document.querySelector('.new-session-popup');
        if ( newSesPopup ) {
            newSesPopup.style.display = 'none';
        }
    });
    

    // When a click event occurs on a feature in
    // the unclustered-point layer, open a popup at
    // the location of the feature, with
    // description HTML from its properties.
    
    map.on('click', 'unclustered-point', async function (e) {
        console.log(e.features[0]);
        const { popupMarkup } = e.features[0].properties; // properties.popupMarkup creted in session.js model
        const coordinates = e.features[0].geometry.coordinates.slice();
        
        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        
        await new mapboxgl.Popup({offset: 10})
            .setLngLat(coordinates)
            .setHTML(popupMarkup)
            .addTo(map);

        // if there is PopUp for new session close it
        // before opening unclustered-point
        const newSesPopup = document.querySelector('.new-session-popup');
        if ( newSesPopup ) {
            newSesPopup.style.display = 'none';
        }
    });
    
    map.on('mouseenter', 'clusters', function () {
    map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', function () {
    map.getCanvas().style.cursor = '';
    });

    map.on('click', function(e) {
        const coordinates = e.lngLat;  
        new mapboxgl.Popup({className: 'new-session-popup'})
            .setLngLat(coordinates)
            .setHTML(`<a href="/sessions/new/${coordinates}" class="new-session-popup--link">New Session</a>`)
            .addTo(map);
    });
    
});