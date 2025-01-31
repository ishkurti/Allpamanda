var map = L.map('map').setView([-1.85, -77.8], 7);

var OSM = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 1,
    maxZoom: 16,
    tms: false,
    attribution: 'Mapa Borrador por Ina Shkurti'
}).addTo(map).bringToBack();

var myTileLayer = L.tileLayer('https://cartocollective.blob.core.windows.net/deforestation/2001/{z}/{x}/{y}.png', {
    minZoom: 1,
    maxNativeZoom: 12,
    maxZoom: 16,
    tms: false
}).addTo(map);

function addTileLayer(year) {
    map.removeLayer(myTileLayer);
    var tileAddress = 'https://cartocollective.blob.core.windows.net/deforestation/' + year + '/{z}/{x}/{y}.png';
    myTileLayer = L.tileLayer(tileAddress, {
        maxNativeZoom: 12,
        maxZoom: 16,
        tms: false
    }).addTo(map);
    document.getElementById('year-text').textContent = year;
}

function mySlider(value) {
    addTileLayer(value);
}

var territories = {  
    "Siona Cuyabeno": {
        data: sionaCuyabeno,
        center: [-0.1, -76.0], // Example coordinates
        zoom: 10, // Example zoom level
        label: "Siona Cuyabeno, Traslape: 130.000ha",
        imageUrl: './charts/sionaCuyabeno.png'
    },
    "Siekopai Aguarico": {  
        data: siekopaiAguarico,
        center: [-0.33052,-76.35], 
        zoom: 11,
        label: "Siekopai Aguarico, Traslape: Por Definir",
        imageUrl: './charts/siekopaiAguarico.png'
    },
    "Waorani": {
        data: waoraniTitulado,
        center: [-1.1434,-76.75],
        zoom: 9,
        label: "Waorani, Traslape: Por Definir",
        imageUrl: './charts/waorani.png'
    },
    "Cofan Sinangoe": {
        data: cofanSinangoe,
        center: [0.1,-77.5],
        zoom: 10,
        label: "Cofan Sinangoe, Traslape: 63.000ha",
        imageUrl: './charts/cofanSinangoe.png'
    },
    "Cofan Bermejo": {
        data: cofanBermejo,
        center: [0.3,-77.29118],
        zoom: 11,
        label: "Cofan Bermejo, Traslape: 52.000ha",
        imageUrl: './charts/cofanBermejo.png'
    },
    // "Cofan Dureno": {
    //     data: cofanDureno,
    //     center: [0.005,-76.7],
    //     zoom: 12,
    //     label: "Cofan Dureno Territory",
    //     imageUrl: './charts/cofanDureno.png'
    // },
    // "Cofan Duvuno": {
    //     data: cofanDuvuno,
    //     center: [0.00696,-77.11630],
    //     zoom: 11,
    //     label: "Cofan Duvuno Territory",
    //     imageUrl: './charts/cofanDuvuno.png'
    // },
    "Shuar Arutam": {
        data: shuarArutam,
        center: [-3.25,-78.1],
        zoom: 10,
        label: "Shuar Arutam Territory",
        imageUrl: './charts/shuarArtuam.png'
    },
  "Indigenous Territories (RAISG)": {
        data: territoriosRAISG,
        center: [-1.7, -77.5], // Example coordinates
        zoom: 7, // Example zoom level
        label: "Indigenous Territories (RAISG)"
    },
    "Zona Intangible Tagaeri-Taromenani": {
        data: zonaITT,
        center: [-1.35103,-75.7],
        zoom: 9,
        label: "Zona Intangible Tagaeri-Taromenani"
    }
};

var territoryLayers = {};

// Function to add territories, including custom behavior for territoriosRAISG layer
function addTerritories() {
    Object.keys(territories).forEach(key => {
        var territory = territories[key];
        var layer = L.geoJSON(territory.data, {
            style: function(feature) {
                // For territoriosRAISG layer, apply custom style
                if (territory.label === "Indigenous Territories (RAISG)") {
                    return {
                        color: 'green',
                        fillColor: 'green',
                        fillOpacity: 0.2, // Transparent fill
                        weight: 2
                    };
                } else {
                    // For other layers, use the default style
                    return {
                        color: 'darkgreen',
                        fillColor: 'green',
                        fillOpacity: 0, // No fill
                        weight: 3
                    };
                }
            },
            onEachFeature: function(feature, layer) {
                // For territoriosRAISG layer, bind popup to each feature with the "nombre" property as label
                if (territory.label === "Indigenous Territories (RAISG)") {
                    layer.bindPopup(feature.properties.nombre);
                }
            }
        });

        // Store the layer within the same territory object for easy reference
        territory.layer = layer;
    });
}

// function toggleTileLayer(territoryName) {
//     var territory = territories[territoryName];
//     if (!territory) {
//         console.error("Territory not found:", territoryName);
//         return; // Stop execution if the territory is not found
//     }

//     map.closePopup(); // Close any open popups
//     Object.values(territories).forEach(t => {
//         if (map.hasLayer(t.layer)) {
//             map.removeLayer(t.layer); // Remove all other layers
//         }
//     });

//     map.addLayer(territory.layer); // Add the required layer
//     map.setView(territory.center, territory.zoom); // Set view to center and zoom without animation

//     // Add click event for all layers
//     territory.layer.on('click', function(event) {
//         var feature = event.layer.feature;
//         var label = feature.properties.nombre; // For RAISG layer
//         if (territory.label !== "Indigenous Territories (RAISG)") {
//             label = territory.label; // For other layers
//         }
//         var latlng = event.latlng;

//         // Create a popup with the label and open it at the clicked location
//         L.popup()
//             .setLatLng(latlng)
//             .setContent(label)
//             .openOn(map);
//     });
// }

function toggleTileLayer(territoryName) {
  console.log();
  var territory = territories[territoryName];
  if (!territory) {
      console.error("Territory not found:", territoryName);
      return; // Stop execution if the territory is not found
  }

  map.closePopup(); // Close any open popups
  Object.values(territories).forEach(t => {
      if (map.hasLayer(t.layer)) {
          map.removeLayer(t.layer); // Remove all other layers
      }
  });

  map.addLayer(territory.layer); // Add the required layer
  map.setView(territory.center, territory.zoom); // Set view to center and zoom without animation

  // Add click event for all layers
  territory.layer.on('click', function(event) {
      var feature = event.layer.feature;
      var label = feature.properties.nombre; // For RAISG layer
      if (territory.label !== "Indigenous Territories (RAISG)") {
          label = territory.label; // For other layers
      }
      var latlng = event.latlng;

      // Create a popup with the label and open it at the clicked location
      L.popup()
          .setLatLng(latlng)
          .setContent(label)
          .openOn(map);

      // Display the corresponding image if the territory is not "Indigenous Territories (RAISG)"
      if (territory.label !== "Indigenous Territories (RAISG)") {
          var imageUrl = territory.imageUrl;
          // Remove any existing image
          if (document.getElementById('territory-image')) {
              document.getElementById('territory-image').remove();
          }
          // Create a new image element and append it to the map container
          var img = document.createElement('img');
          img.src = imageUrl;
          img.id = 'territory-image';
          img.style.position = 'absolute';
          img.style.bottom = '10px';
          img.style.right = '10px';
          img.style.width = '200px'; // Adjust image width as needed
          img.style.height = 'auto'; // Maintain aspect ratio
          map.getContainer().appendChild(img);
      }
  });
}

var customControl = L.control({position: 'topleft'});

customControl.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'custom-buttons');
    
    // Create the reset button with a specific class for styling
    var resetBtn = L.DomUtil.create('button', 'territory-button reset-view-button', div);
    resetBtn.innerHTML = "Reset View";
    resetBtn.onclick = function() {
        Object.values(territories).forEach(t => {
            if (map.hasLayer(t.layer)) {
                map.removeLayer(t.layer);  // Turn off all territory layers
            }
        });

        map.setView([-1.7, -77.5], 7);  // Resetting to the initial view

        // Turn off all layers in overlayMaps
        Object.values(overlayMaps).forEach(layer => {
            if (map.hasLayer(layer)) {
                map.removeLayer(layer);
            }
        });
    };

    // Add buttons for each territory
    Object.keys(territories).forEach(key => {
        var btn = L.DomUtil.create('button', 'territory-button', div);
        btn.innerHTML = key;
        btn.onclick = function() {
            toggleTileLayer(key);
        };
    });

    return div;
};


addTerritories();
customControl.addTo(map);


// add the layers for the layer control menu on the top right showing threats and conservation areas 

var oilBlocks = L.geoJSON(bloquesPetro, {
    style: {
      fillColor: 'orange',   // Fill color
      fillOpacity: 0.1,
      color: 'black',        // Border color
      weight: 2              // Increased border width
    },
    onEachFeature: function (feature, layer) {
      // Display additional information in a popup when clicked
      layer.on('click', function (event) {
        var popupContent = '<strong>Block Name:</strong> ' + feature.properties.nombre + '</strong><br>' +
        '<strong>Block Operator:</strong> ' + feature.properties.operad + '<br>' +
        '<strong>Block Number:</strong> ' + feature.properties.num_bq;
        layer.bindPopup(popupContent).openPopup();
      });
    }
  });
  oilBlocks.addTo(map);


var nationalParks = L.geoJSON(areasProtegidas, {
    style: {
      fillColor: '#b2be25',    // Fill color for protected areas
      fillOpacity: 0.5,      // Opacity of the fill
      color: '#94a006',    // Border color
      weight: 2              // Border weight
    },
    onEachFeature: function (feature, layer) {
      // Add a popup to each protected area
      layer.on('click', function (event) {
        var popupContent = '<strong>Protected Area:</strong> ' + feature.properties.nam + '</strong><br>' +
          '<strong>Type:</strong> ' + feature.properties.ttm + '<br>' +
          '<strong>Founding:</strong> ' + feature.properties.map + '<br>' + // Added '+' operator here
          '<strong>Landscape:</strong> ' + feature.properties.psj;
        layer.bindPopup(popupContent).openPopup();
      });
    }
  }).addTo(map);  

  var protectedForests = L.geoJSON(bosquesProtectores, {
    style: {
      fillColor: '#D29E4D',   // Fill color for protected forests
      fillOpacity: 0.2,       // Opacity of the fill
      color: '#987654',       // Border color
      weight: 2               // Border weight
    },
    onEachFeature: function (feature, layer) {
      // Add a popup to each protected forest
      layer.on('click', function (event) {
        var popupContent = '<strong>Protected Forest Name:</strong> ' + feature.properties.nombre + '</strong><br>' +
          '<strong>Type of Forest:</strong> ' + feature.properties.tipo_de_bo + '<br>' +
          '<strong>Validation status:</strong> ' + feature.properties.validacion + '<br>' + // Added '+' operator here
          '<strong>Founding:</strong> ' + feature.properties.registro_o;
        layer.bindPopup(popupContent).openPopup();
      });
    }
  }).addTo(map); 

  var oilFields = L.geoJSON(camposPetro, {
    style: {
      fillColor: 'grey',      // Fill color
      fillOpacity: 0.5,       // Grey fill with 50% opacity
      color: 'black',         // Border color
      weight: 2               // Increased border width
    },
    onEachFeature: function (feature, layer) {
      // Display additional information in a popup when clicked
      layer.on('click', function (event) {
        var popupContent = '<strong>Oil Field Name:</strong> ' + feature.properties.campo + '</strong><br>';
        layer.bindPopup(popupContent).openPopup();
      });
    }
  });
  oilFields.addTo(map); 
  
  var mining = L.geoJSON(catastroMinero, {
    style: {
      fillColor: 'pink',    // Fill color set to orange
      fillOpacity: 0.2,       // Orange fill with 50% opacity
      color: 'magenta',         // Border color
      weight: 2               // Increased border width
    },
    onEachFeature: function (feature, layer) {
      // Display additional information in a popup when clicked
      layer.on('click', function (event) {
        var popupContent = '<strong>Consession Name:</strong> ' + feature.properties.com + '</strong><br>' +
                            '<strong>Concession Holder:</strong> ' + feature.properties.ttm + '<br>' +
                            '<strong>Concession Representative:</strong> ' + feature.properties.rep + '<br>' +
                            '<strong>Concession Type:</strong> ' + feature.properties.sol;
        layer.bindPopup(popupContent).openPopup();
      });
    }
  });
  mining.addTo(map);


  
  var palmOil = L.geoJSON(palmaAfricana, {
    style: {
      fillColor: 'orange',    // Fill color set to orange
      fillOpacity: 0.3,       // Orange fill with 50% opacity
      color: 'orange',        // Border color set to orange
      weight: 2               // Increased border width
    },
    onEachFeature: function (feature, layer) {
      // Display additional information in a popup when clicked
      layer.on('click', function (event) {
        var popupContent = '<strong>Consession Name:</strong> ' + feature.properties.com + '</strong><br>' +
                            '<strong>Concession Holder:</strong> ' + feature.properties.ttm + '<br>' +
                            '<strong>Concession Representative:</strong> ' + feature.properties.rep + '<br>' +
                            '<strong>Concession Type:</strong> ' + feature.properties.sol;
        layer.bindPopup(popupContent).openPopup();
      });
    }
  });
  palmOil.addTo(map); 
  
  var pipelines = L.geoJSON(oleoductos, {
    style: function (feature) {
      // Define different colors based on some property value
      var color;
      if (feature.properties.OLEODUCTO === 'OCP') {
        color = 'brown';   // Pipeline 1 color
      } else if (feature.properties.OLEODUCTO === 'SOTE') {
        color = 'red';    // Pipeline 2 color
      } else if (feature.properties.OLEODUCTO === 'Poliducto') {
        color = 'purple';  // Pipeline 3 color
      } else {
        color = 'black';  // Default color
      }
      return {
        color: color,
        weight: 3,
        opacity: 0.8
      };
    },
    onEachFeature: function (feature, layer) {
      // Add a popup to the line
      layer.bindPopup('<strong>Pipeline Name:</strong> ' + feature.properties.OLEODUCTO);
    }
  }).addTo(map);
   

var pozosLayer = L.geoJSON(pozosPetro, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
            radius: 4, // Adjust the radius as needed
            color: 'black', // Set the stroke color to white
            fillColor: '#ECECEC',
            fillOpacity: .7
        });
    },
    onEachFeature: function (feature, layer) {
        var popupContent = '<strong>Well Name:</strong> ' + feature.properties.NOM_REG + '</strong><br>' +
                           '<strong>Block Number:</strong> ' + feature.properties.BLOQUE_1 + '<br>' +
                           '<strong>Block Name:</strong> ' + feature.properties.NOM_BLOQ;
        layer.bindPopup(popupContent);
    }
});
pozosLayer.addTo(map);

var overlayMaps = {
    "Áreas Protegidas (SNAP)": nationalParks,
    "Bosques Protectores": protectedForests,
    "Bloques Petroleros": oilBlocks,
    "Campos Petroleros": oilFields,
    "Pozos Petroleros": pozosLayer,
    "Tuberías": pipelines,
    "Catastro Minero": mining,
    "Palma Africana": palmOil
  };
  
 // new legend control on the top right 
 var layerControl = L.control.layers(null, overlayMaps, {
    position: 'topright',
    collapsed: false
  }).addTo(map);

  map.removeLayer(oilBlocks);
  map.removeLayer(oilFields);
  map.removeLayer(pozosLayer);
  map.removeLayer(pipelines);
  map.removeLayer(mining);
  map.removeLayer(palmOil);
  map.removeLayer(nationalParks);
  map.removeLayer(protectedForests);

// Remove the default zoom control
map.zoomControl.remove();

// Add a new zoom control at the top right
L.control.zoom({
    position: 'topright'
}).addTo(map);

L.control.scale({ 
    position: 'bottomleft', 
    metric: true,
    imperial: false,
}).addTo(map);
