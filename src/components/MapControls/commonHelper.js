export const clearMapAndCloseShapeActionsPopup = (stateApp, setStateApp) => {
    const { draw, map, currentFeature } = stateApp;
    if (currentFeature?.id) {
        setFeatureProperty(stateApp.draw, currentFeature.id, 'shapeEdit', true)
        draw.delete(currentFeature?.id);
    }
    draw.deleteAll();

    draw.changeMode('simple_select');
    setStateApp((state) => ({
        ...state,
        editDraw: false,
        shapeEdit: false,
        currentFeature: undefined,
        isAbstractedLayersPolygon: false,
        multiSelectLandGrids: false,
        selectedAbstracts: [],
        showShapeActionsPopup: false,
        showDrawShapesPopup: false,
    }));
    drawShapeLayerToggle(stateApp, "visible")

    // unselecting the grids
    const featuresList = map.getSource("abstract_geo_source")._data.features;
    for (let i = 0; i < featuresList.length; i++) {
        const id = featuresList[i].properties.Id;
        map.setFeatureState({ source: "abstract_geo_source", id: id }, { click: false });
    }
};

export const setFeatureProperty = (draw, drawFeatureID, field, value) => {
    if (drawFeatureID !== '' && typeof draw === 'object') {
        draw.setFeatureProperty(drawFeatureID, field, value);
        var feat = draw.get(drawFeatureID);
        draw.add(feat)
    }
}

export const drawShapeLayerToggle = (stateApp, value) => {
    stateApp.map.setLayoutProperty('gl-draw-polygon-midpoint.cold', "visibility", value);
    stateApp.map.setLayoutProperty('gl-draw-polygon-midpoint.hot', "visibility", value);
    stateApp.map.setLayoutProperty('gl-draw-polygon-and-line-vertex-inactive.cold', "visibility", value);
    stateApp.map.setLayoutProperty('gl-draw-polygon-and-line-vertex-stroke-inactive.cold', "visibility", value);
    stateApp.map.setLayoutProperty('gl-draw-polygon-and-line-vertex-inactive.hot', "visibility", value);
    stateApp.map.setLayoutProperty('gl-draw-polygon-and-line-vertex-stroke-inactive.hot', "visibility", value);
}

export const drawShapeStyles = [
    {
        'id': 'gl-draw-polygon-fill-inactive',
        'type': 'fill',
        'filter': ['all', ['==', 'active', 'false'],
            ['==', '$type', 'Polygon'],
            ['!=', 'mode', 'static']
        ],
        'paint': {
            'fill-color': '#3bb2d0',
            'fill-outline-color': '#3bb2d0',
            'fill-opacity': 0.1
        }
    },
    {
        'id': 'gl-draw-polygon-fill-active',
        'type': 'fill',
        'filter': ['all', ['==', 'active', 'true'],
            ['==', '$type', 'Polygon'],
            ['any', ['==', 'user_shapeEdit', true], ['!has', 'user_shapeEdit']]
        ],
        'paint': {
            'fill-color': '#fbb03b',
            'fill-outline-color': '#fbb03b',
            'fill-opacity': 0.1
        }
    },
    {
        'id': 'gl-draw-polygon-midpoint',
        'type': 'circle',
        'filter': ['all', ['==', '$type', 'Point'],
            ['==', 'meta', 'midpoint'],
        ],
        'paint': {
            'circle-radius': 3,
            'circle-color': '#fbb03b'
        }
    },
    {
        'id': 'gl-draw-polygon-stroke-inactive',
        'type': 'line',
        'filter': ['all', ['==', 'active', 'false'],
            ['==', '$type', 'Polygon'],
            ['!=', 'mode', 'static']
        ],
        'layout': {
            'line-cap': 'round',
            'line-join': 'round'
        },
        'paint': {
            'line-color': '#3bb2d0',
            'line-width': 2
        }
    },
    {
        'id': 'gl-draw-polygon-stroke-active',
        'type': 'line',
        'filter': ['all', ['==', 'active', 'true'],
            ['==', '$type', 'Polygon'],
            ['any', ['==', 'user_shapeEdit', true], ['!has', 'user_shapeEdit']]
        ],
        'layout': {
            'line-cap': 'round',
            'line-join': 'round'
        },
        'paint': {
            'line-color': '#fbb03b',
            'line-dasharray': [0.2, 2],
            'line-width': 2
        }
    },
    {
        'id': 'gl-draw-line-inactive',
        'type': 'line',
        'filter': ['all', ['==', 'active', 'false'],
            ['==', '$type', 'LineString'],
            ['!=', 'mode', 'static']
        ],
        'layout': {
            'line-cap': 'round',
            'line-join': 'round'
        },
        'paint': {
            'line-color': '#3bb2d0',
            'line-width': 2
        }
    },
    {
        'id': 'gl-draw-line-active',
        'type': 'line',
        'filter': ['all', ['==', '$type', 'LineString'],
            ['==', 'active', 'true'],
            ['any', ['==', 'user_shapeEdit', true], ['!has', 'user_shapeEdit']]

        ],
        'layout': {
            'line-cap': 'round',
            'line-join': 'round'
        },
        'paint': {
            'line-color': '#fbb03b',
            'line-dasharray': [0.2, 2],
            'line-width': 2
        }
    },
    {
        'id': 'gl-draw-polygon-and-line-vertex-stroke-inactive',
        'type': 'circle',
        'filter': ['all', ['==', 'meta', 'vertex'],
            ['==', '$type', 'Point'],
            ['!=', 'mode', 'static']
        ],
        'paint': {
            'circle-radius': 5,
            'circle-color': '#fff'
        }
    },
    {
        'id': 'gl-draw-polygon-and-line-vertex-inactive',
        'type': 'circle',
        'filter': ['all', ['==', 'meta', 'vertex'],
            ['==', '$type', 'Point'],
            ['!=', 'mode', 'static']
        ],
        'paint': {
            'circle-radius': 3,
            'circle-color': '#fbb03b'
        }
    },
    {
        'id': 'gl-draw-point-point-stroke-inactive',
        'type': 'circle',
        'filter': ['all', ['==', 'active', 'false'],
            ['==', '$type', 'Point'],
            ['==', 'meta', 'feature'],
            ['!=', 'mode', 'static']
        ],
        'paint': {
            'circle-radius': 5,
            'circle-opacity': 1,
            'circle-color': '#fff'
        }
    },
    {
        'id': 'gl-draw-point-inactive',
        'type': 'circle',
        'filter': ['all', ['==', 'active', 'false'],
            ['==', '$type', 'Point'],
            ['==', 'meta', 'feature'],
            ['!=', 'mode', 'static']
        ],
        'paint': {
            'circle-radius': 3,
            'circle-color': '#3bb2d0'
        }
    },
    {
        'id': 'gl-draw-point-stroke-active',
        'type': 'circle',
        'filter': ['all', ['==', '$type', 'Point'],
            ['==', 'active', 'true'],
            ['!=', 'meta', 'midpoint'],
            ['any', ['==', 'user_shapeEdit', true], ['!has', 'user_shapeEdit']]
        ],
        'paint': {
            'circle-radius': 7,
            'circle-color': '#fff'
        }
    },
    {
        'id': 'gl-draw-point-active',
        'type': 'circle',
        'filter': ['all', ['==', '$type', 'Point'],
            ['!=', 'meta', 'midpoint'],
            ['==', 'active', 'true'],
            ['any', ['==', 'user_shapeEdit', true], ['!has', 'user_shapeEdit']]
        ],
        'paint': {
            'circle-radius': 5,
            'circle-color': '#fbb03b'
        }
    },
    {
        'id': 'gl-draw-polygon-fill-static',
        'type': 'fill',
        'filter': ['all', ['==', 'mode', 'static'],
            ['==', '$type', 'Polygon'],
            ['any', ['==', 'user_shapeEdit', true], ['!has', 'user_shapeEdit']]
        ],
        'paint': {
            'fill-color': '#404040',
            'fill-outline-color': '#404040',
            'fill-opacity': 0.1
        }
    },
    {
        'id': 'gl-draw-polygon-stroke-static',
        'type': 'line',
        'filter': ['all', ['==', 'mode', 'static'],
            ['==', '$type', 'Polygon'],
            ['any', ['==', 'user_shapeEdit', true], ['!has', 'user_shapeEdit']]
        ],
        'layout': {
            'line-cap': 'round',
            'line-join': 'round'
        },
        'paint': {
            'line-color': '#404040',
            'line-width': 2
        }
    },
    {
        'id': 'gl-draw-line-static',
        'type': 'line',
        'filter': ['all', ['==', 'mode', 'static'],
            ['==', '$type', 'LineString'],
            ['any', ['==', 'user_shapeEdit', true], ['!has', 'user_shapeEdit']]
        ],
        'layout': {
            'line-cap': 'round',
            'line-join': 'round'
        },
        'paint': {
            'line-color': '#404040',
            'line-width': 2
        }
    },
    {
        'id': 'gl-draw-point-static',
        'type': 'circle',
        'filter': ['all', ['==', 'mode', 'static'],
            ['==', '$type', 'Point'],
            ['any', ['==', 'user_shapeEdit', true], ['!has', 'user_shapeEdit']]
        ],
        'paint': {
            'circle-radius': 5,
            'circle-color': '#404040'
        }
    },
    // new styles
    {
        'id': 'gl-draw-polygon-shape-edit',
        'type': 'fill',
        'filter': ['all', ['==', '$type', 'Polygon'],
            ['==', 'user_shapeEdit', false]
        ],
        'paint': {
            'fill-color': '#3bb2d0',
            'fill-outline-color': '#3bb2d0',
            'fill-opacity': 0.1
        }
    },
    {
        'id': 'gl-draw-polygon-stroke-shape-edit',
        'type': 'line',
        'filter': ['all',
            ['==', '$type', 'Polygon'],
            // ['!=', 'mode', 'static'],
            ['==', 'user_shapeEdit', false]
        ],
        'layout': {
            'line-cap': 'round',
            'line-join': 'round'
        },
        'paint': {
            'line-color': '#3bb2d0',
            'line-width': 2
        }
    }
]