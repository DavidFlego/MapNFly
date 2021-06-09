
mapboxgl.accessToken = mapBoxToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/satellite-v9', // style URL
    center: session.geometry.coordinates, // starting position [lng, lat]
    zoom: 13 // starting zoom
});

const nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'bottom-right');

// new mapboxgl.Marker()
//     .setLngLat(session.geometry.coordinates)
//     .setPopup(
//         new mapboxgl.Popup({offset: 40, className: 'my-class'})
//             .setHTML(
//                 `<h3>${session.title}</h3>
//                 <p>${session.duration} min</p>`
//             )
//             .setMaxWidth("200px")
//     )
//     .addTo(map);