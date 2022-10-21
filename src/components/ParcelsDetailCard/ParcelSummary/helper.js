import * as turf from "@turf/turf";
import { getDrawAdustedShape, getNewShapeFromSelectedQuarters } from "components/MapControls/components/DrawShapes/drawShapesHelpers"
import { copy } from "components/Shared/functions"
import { calculateLandArea } from "components/Shared/functions/shapeLayer";

const quaterLookup = [
    {
        "quater": [],
        "value": ["NWNW", "NENW", "SWNW", "SENW", "NWNE", "NENE", "SWNE", "SENE", "NWSW", "NESW", "SWSW", "SESW", "NWSE", "NESE", "SWSE", "SESE"]
    },
    {
        "quater": ["N2"],
        "value": ["NWNW", "NENW", "SWNW", "SENW", "NWNE", "NENE", "SWNE", "SENE"]
    },
    {
        "quater": ["S2"],
        "value": ["NWSW", "NESW", "SWSW", "SESW", "NWSE", "NESE", "SWSE", "SESE"]
    },
    {
        "quater": ["E2"],
        "value": ["NWNE", "NENE", "SWNE", "SENE", "NWSE", "NESE", "SWSE", "SESE"]
    },
    {
        "quater": ["W2"],
        "value": ["NWNW", "NENW", "SWNW", "SENW", "NWSW", "NESW", "SWSW", "SESW"]
    },
    {
        "quater": ["NE"],
        "value": ["NWNE", "NENE", "SWNE", "SENE"]
    },
    {
        "quater": ["SE"],
        "value": ["NWSE", "NESE", "SWSE", "SESE"]
    },
    {
        "quater": ["SW"],
        "value": ["NWSW", "NESW", "SWSW", "SESW"]
    },
    {
        "quater": ["NW"],
        "value": ["NWNW", "NENW", "SWNW", "SENW"]
    },
    {
        "quater": ["N2", "E2"],
        "value": ["NWNE", "NENE", "SWNE", "SENE"]
    },
    {
        "quater": ["S2", "E2"],
        "value": ["NWSE", "NESE", "SWSE", "SESE"]
    },
    {
        "quater": ["S2", "W2"],
        "value": ["NWSW", "NESW", "SWSW", "SESW"]
    },
    {
        "quater": ["N2", "W2"],
        "value": ["NWNW", "NENW", "SWNW", "SENW"]
    },
    {
        "quater": ["E2", "N2"],
        "value": ["NWNE", "NENE", "SWNE", "SENE"]
    },
    {
        "quater": ["E2", "S2"],
        "value": ["NWSE", "NESE", "SWSE", "SESE"]
    },
    {
        "quater": ["W2", "S2"],
        "value": ["NWSW", "NESW", "SWSW", "SESW"]
    },
    {
        "quater": ["W2", "N2"],
        "value": ["NWNW", "NENW", "SWNW", "SENW"]
    },
    {
        "quater": ["E2", "NE"],
        "value": ["NENE", "SENE"]
    },
    {
        "quater": ["W2", "NE"],
        "value": ["NWNE", "SWNE"]
    },
    {
        "quater": ["N2", "NE"],
        "value": ["NWNE", "NENE"]
    },
    {
        "quater": ["S2", "NE"],
        "value": ["SWNE", "SENE"]
    },
    {
        "quater": ["E2", "SE"],
        "value": ["NESE", "SESE"]
    },
    {
        "quater": ["W2", "SE"],
        "value": ["NWSE", "SWSE"]
    },
    {
        "quater": ["N2", "SE"],
        "value": ["NWSE", "NESE"]
    },
    {
        "quater": ["S2", "SE"],
        "value": ["SWSE", "SESE"]
    },
    {
        "quater": ["E2", "SW"],
        "value": ["NESW", "SESW"]
    },
    {
        "quater": ["W2", "SW"],
        "value": ["NWSW", "SWSW"]
    },
    {
        "quater": ["N2", "SW"],
        "value": ["NWSW", "NESW"]
    },
    {
        "quater": ["S2", "SW"],
        "value": ["SWSW", "SESW"]
    },
    {
        "quater": ["E2", "NW"],
        "value": ["NENW", "SENW"]
    },
    {
        "quater": ["W2", "NW"],
        "value": ["NWNW", "SWNW"]
    },
    {
        "quater": ["N2", "NW"],
        "value": ["NWNW", "NENW"]
    },
    {
        "quater": ["S2", "NW"],
        "value": ["SWNW", "SENW"]
    },
    {
        "quater": ["NW", "NE"],
        "value": ["NWNE"]
    },
    {
        "quater": ["NE", "NE"],
        "value": ["NENE"]
    },
    {
        "quater": ["SW", "NE"],
        "value": ["SWNE"]
    },
    {
        "quater": ["SE", "NE"],
        "value": ["SENE"]
    },
    {
        "quater": ["NW", "SE"],
        "value": ["NWSE"]
    },
    {
        "quater": ["NE", "SE"],
        "value": ["NESE"]
    },
    {
        "quater": ["SW", "SE"],
        "value": ["SWSE"]
    },
    {
        "quater": ["SE", "SE"],
        "value": ["SESE"]
    },
    {
        "quater": ["NW", "SW"],
        "value": ["NWSW"]
    },
    {
        "quater": ["NE", "SW"],
        "value": ["NESW"]
    },
    {
        "quater": ["SW", "SW"],
        "value": ["SWSW"]
    },
    {
        "quater": ["SE", "SW"],
        "value": ["SESW"]
    },
    {
        "quater": ["NW", "NW"],
        "value": ["NWNW"]
    },
    {
        "quater": ["NE", "NW"],
        "value": ["NENW"]
    },
    {
        "quater": ["SW", "NW"],
        "value": ["SWNW"]
    },
    {
        "quater": ["SE", "NW"],
        "value": ["SENW"]
    }
]

export const getQtrFilterData = (qtr) => {
    let qtrFilterData = []
    if (qtr && qtr[2] && qtr[3]) {
        qtrFilterData = [`${qtr[2]}${qtr[3]}`]
    } else if (qtr && qtr[1] && qtr[2]) {
        qtrFilterData = [`${qtr[1]}${qtr[2]}`]
    } else if (qtr && qtr[0] && qtr[1]) {
        const lookup = quaterLookup.find(lookup => lookup.quater.length === 2 && lookup.quater[0] === qtr[0] && lookup.quater[1] === qtr[1])
        qtrFilterData = lookup?.value
    } else if (qtr && qtr[0]) {
        const lookup = quaterLookup.find(lookup => lookup.quater.length === 1 && lookup.quater[0] === qtr[0])
        qtrFilterData = lookup?.value
    } else if (qtr) {
        const lookup = quaterLookup.find(lookup => lookup.quater.length === 0)
        qtrFilterData = lookup?.value
    }
    return qtrFilterData
}

export const getQtrQtrFromQtr = (qtr, qtrQtr) => {
    const values = getQtrFilterData(qtr)
    if (values) {
        Object.keys(qtrQtr).forEach((key) => {
            qtrQtr[key] = false
        })
        values.forEach((value) => {
            qtrQtr[value.toLowerCase()] = true
        })
    }
    return qtrQtr
}

export const handleLayerChangeOnQtr = (stateApp, layerData, qtrQtr, qtr) => {
    const values = Object.keys(qtrQtr).filter((key) => qtrQtr[key]).map((key) => key.toUpperCase())
    const feature = copy(layerData.shape)
    let layerDataCopy = copy(layerData)

    let newShape = {}
    const drawFeature = stateApp?.draw?.getAll()?.features[0]
    if (drawFeature) {
        feature.geometry = drawFeature.geometry
        newShape = getDrawAdustedShape(feature, values)
    } else {
        if (layerDataCopy?.qtrQtrSelection?.originalGeometry) {
            feature.geometry = layerDataCopy.qtrQtrSelection.originalGeometry
        }
        newShape = getNewShapeFromSelectedQuarters(feature, values)
    }

    if (!layerDataCopy.qtrQtrSelection) layerDataCopy.qtrQtrSelection = {}
    if (!layerDataCopy?.qtrQtrSelection?.originalGeometry) {
        layerDataCopy.qtrQtrSelection.originalGeometry = layerDataCopy.shape.geometry
    }
    layerDataCopy.qtrQtrSelection.qtrQtr = qtrQtr;
    layerDataCopy.qtrQtrSelection.selectedQtr = qtr;
    newShape = turf.intersect(layerDataCopy.shape.geometry, newShape.geometry);
    if (newShape) {
        layerDataCopy.shape.geometry = newShape.geometry;
        layerDataCopy.shape.properties.shapeArea = calculateLandArea(newShape);
    }
    return layerDataCopy
};