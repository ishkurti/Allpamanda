var map = L.map('map').setView([-1.85, -77.8], 7);

var OSM = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 1,
    maxZoom: 16,
    tms: false,
    attribution: 'Mapa por Ina Shkurti y Fundación TIAM'
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
    
  "Cofan Bermejo": {
   //data: cofanBermejo,
    center: [0.3,-77.29118],
    zoom: 11,
    label: "Cofan Bermejo, Traslape: 52.000ha",
},
    "Siona Cuyabeno": {
        //data: sionaCuyabeno,
        center: [-0.1, -76.0], // Example coordinates
        zoom: 10, // Example zoom level
        label: "Siona Cuyabeno, Traslape: approx. 130.000ha",
    },
    "Santa Clara": {
        //data: santaClara,
        center: [-1.24383,-78.05378], 
        zoom: 10,
        label: "Llanganates, Traslape: approx. 23.000ha",
    },
    "Atacapi": {
      //data: atacapi,
      center: [-0.96643,-77.87597],
      zoom: 11,
      label: "Reserva Colonso-Chalupas, Traslape: 2.500-5.000ha",
  },

  "Sumaco": {
    //data: comunasSumaco,
    center: [-0.08762,-77.22154],
    zoom: 11,
    label: "Sumaco Napo-Galeras, Traslape: n/a",
},
  // "Indigenous Territories (RAISG)": {
  //       data: territoriosRAISG,
  //       center: [-1.7, -77.5], // Example coordinates
  //       zoom: 7, // Example zoom level
  //       label: "Indigenous Territories (RAISG)"
  //   },
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

    // ✅ Create the reset button
    var resetBtn = L.DomUtil.create('button', 'territory-button reset-view-button', div);
    resetBtn.innerHTML = "Reiniciar Mapa";
    resetBtn.onclick = function() {
        // Turn off all custom territory layers
        Object.values(territories).forEach(t => {
            if (t.layer && map.hasLayer(t.layer)) {
                map.removeLayer(t.layer);
            }
        });

        // Reset map view
        map.setView([-1.7, -77.5], 7);

        // Remove all overlay layers
        Object.values(overlayMaps).forEach(layer => {
            if (map.hasLayer(layer)) {
                map.removeLayer(layer);
            }
        });

        // ✅ Re-add default layers
        map.addLayer(territoriosAllpamanda);
        map.addLayer(nationalParks);

        // ✅ Only add conflictosLayer if zoom level is 9+
        if (map.getZoom() >= 9 && !map.hasLayer(conflictosLayer)) {
            map.addLayer(conflictosLayer);
        }
    };

    // Add buttons for each defined territory
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
      fillColor: '#39FF14',    // Fill color for protected areas
      fillOpacity: 0.2,      // Opacity of the fill
      color: '#13d624',    // Border color
      weight: 2              // Border weight
    },
    onEachFeature: function (feature, layer) {
      // Add a popup to each protected area
      layer.on('click', function (event) {
        var popupContent = '<strong>Nombre:</strong> ' + feature.properties.nam + '</strong><br>' +
          '<strong>Tipo de Area Protegida:</strong> ' + feature.properties.map + '<br>'
        layer.bindPopup(popupContent).openPopup();
      });
    }
  }).addTo(map);  

  var territoriosAllpamanda = L.geoJSON(territoriosAllpamanda, {
    style: {
      color: '#cc5500',         // Border color (Dark Orange)
      fillColor: '#cc5500',     // Fill color
      fillOpacity: 0.2,         // Transparent fill
      weight: 2
    },
    onEachFeature: function (feature, layer) {
      var props = feature.properties;
      var popupContent = '<strong>Comunidad:</strong> ' + props.Comunidad + '<br>' +
                         '<strong>Descripción:</strong> ' + props.Descripcion + '<br>' +
                         '<strong>Área (ha):</strong> ' + props.area_sig_h.toLocaleString() + '<br>' +
                         '<strong>Etnias:</strong> ' + props.etnias + '<br>' +
                         '<strong>Status:</strong> ' + props.status + '<br>' +
                         '<strong>Fuente:</strong> ' + props.fuente + '<br>' +
                         '<strong>Fecha Actualización:</strong> ' + props.fecha_atua;
      layer.bindPopup(popupContent);
    }
  }).addTo(map);
  

  var territoriosRAISG = L.geoJSON(territoriosRAISG, {
    style: {
        color: 'orange',
        fillColor: 'orange',
        fillOpacity: 0.2, 
        weight: 2
    },
    onEachFeature: function (feature, layer) {
        var popupContent = '<strong>Nombre:</strong> ' + feature.properties.nombre + '<br>' +
                           '<strong>Etnias:</strong> ' + feature.properties.etnias + '<br>' +
                           '<strong>Área (ha):</strong> ' + feature.properties.area_sig_h.toLocaleString() + '<br>' +
                           '<strong>Fuente:</strong> ' + feature.properties.fuente;
        layer.bindPopup(popupContent);
    }
}).addTo(map);

  var protectedForests = L.geoJSON(bosquesProtectores, {
    style: {
      fillColor: '#94a006',   // Fill color for protected forests
      fillOpacity: 0.2,       // Opacity of the fill
      color: '#94a006',       // Border color
      weight: 2               // Border weight
    },
    onEachFeature: function (feature, layer) {
      // Add a popup to each protected forest
      layer.on('click', function (event) {
        var popupContent = '<strong>Nombre:</strong> ' + feature.properties.nombre + '</strong><br>' +
          '<strong>Tipo de Bosque:</strong> ' + feature.properties.tipo_de_bo + '<br>' +
          '<strong>Validacion:</strong> ' + feature.properties.validacion + '<br>' + // Added '+' operator here
          '<strong>Registro:</strong> ' + feature.properties.registro_o;
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

// Define this FIRST
function getConflictColor(descripcion) {
  if (!descripcion) return "gray"; // safeguard for undefined

  descripcion = descripcion.toLowerCase(); // normalize input

  if (descripcion.includes("conflicto con colindantes")) return "red";
  if (descripcion.includes("actividad extractiva")) return "orange";
  if (descripcion.includes("amenaza territorial")) return "yellow";
  if (descripcion.includes("conflicto con el snap")) return "purple";

  return "gray"; // fallback/default
}

// THEN use it here
var conflictosLayer = L.geoJSON(conflictosTerritoriales, {
  pointToLayer: function (feature, latlng) {
      var color = getConflictColor(feature.properties.Descripcion);
      return L.circleMarker(latlng, {
          radius: 6,
          fillColor: color,
          color: "black",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
      });
  },
  onEachFeature: function (feature, layer) {
      var popupContent = `<strong>Nombre Comunidad:</strong> ${feature.properties.NombreComunidad}<br>
                          <strong>Descripción:</strong> ${feature.properties.Descripcion}<br>
                          <strong>Tipo de Conflicto:</strong> ${feature.properties.TipoDeConflicto}<br>
                          <strong>Apuntes:</strong> ${feature.properties.Apuntes}`;
      layer.bindPopup(popupContent);
  }
}).addTo(map);

// Initially remove it if zoom < 9
if (map.getZoom() < 9) {
  map.removeLayer(conflictosLayer);
}

// Toggle conflictosLayer on zoom
map.on("zoomend", function () {
  if (map.getZoom() >= 9) {
    if (!map.hasLayer(conflictosLayer)) {
      map.addLayer(conflictosLayer);
    }
  } else {
    if (map.hasLayer(conflictosLayer)) {
      map.removeLayer(conflictosLayer);
    }
  }
});


var overlayMaps = {
    "Territorios parte del informe Allpamanda": territoriosAllpamanda,  
    "Áreas Protegidas (SNAP)": nationalParks,
    "Conflictos y Amenazas": conflictosLayer,
    "Bosques Protectores": protectedForests,
    "Territorios Indigenas en Ecuador (RAISG)": territoriosRAISG,
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
  //map.removeLayer(nationalParks);
  map.removeLayer(protectedForests);
  map.removeLayer(territoriosRAISG);
  //map.removeLayer(conflictosLayer);

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
