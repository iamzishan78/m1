import {
  booleanPointInPolygon,
  booleanWithin,
  combine,
  featureCollection,
  point,
  polygon,
  lineString,
  bbox,
} from '@turf/turf';
import { convertBBoxToPolygon } from 'components/Shared/Hooks/useOnMouseMoveWells';
import { popupController } from 'hookstate/popupStateController';
import { copy } from 'utils/helper';
import udLayerClickHandler from './udLayerClickHandler';
import pointClickHandler from './pointClickHandler';
import {
  deckGlLandGridIdentifiers,
  ifDeckGlDataLayerIdentifiers,
  ifDeckGlLayerIdentifiers,
} from 'components/Shared/functions/shapeLayer';
import { globalStateController } from 'hookstate/globalStateController';
import landgridLayerClickHandler from './landgridLayerClickHandler';
import { drawWellBoundary } from 'components/MapControls/components/DrawShapes/drawShapesHelpers';

const onWellClick = (object, layerId) => {
  if (!object) return;

  const feature = copy(object);

  feature.layer = {
    id: layerId,
    type: 'custom',
  };
  feature.geometry = feature.geometry.geometries.find(
    geometry => geometry.type === 'Point'
  );
  // feature.source = `${feature.properties.type}s_source`;

  const currentPolygon = convertBBoxToPolygon(window.mapRef?.getBounds());

  if (
    !booleanPointInPolygon(
      point(feature.geometry.coordinates),
      polygon(currentPolygon.geometry.coordinates)
    )
  ) {
    window.mapRef?.jumpTo({
      center: {
        lng: feature.geometry.coordinates[0],
        lat: feature.geometry.coordinates[1],
      },
    });
  }

  if (feature) {

    drawWellBoundary([
      feature?.geometry?.coordinates[0],
      feature?.geometry?.coordinates[1],
    ]);

    popupController.setState({
      selectedWellId: feature.properties.id.toLowerCase(),
      wellSelectedCoordinates: feature.geometry.coordinates,
      data: {
        ...feature.properties,
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1],
      },
    });
  }

  return true;
};

const onDataLayerClick = (object, layerId, layer) => {
  if (!object || !layer) return;

  const feature = copy(object);

  feature.identifier = layer.identifier;
  feature.layer = {
    id: layerId,
    type: 'custom',
  };

  return feature && udLayerClickHandler(feature, layer);
};

const onPointClick = (object, layerId, layer) => {
  if (!object || !layer) return;

  const feature = copy(object);

  if (feature.geometry.geometries)
    feature.geometry = feature.geometry.geometries.find(
      geometry => geometry.type === 'Point'
    );

  feature.layer = {
    id: layerId,
    type: 'custom',
  };
  feature.identifier = layer.identifier;

  return feature && pointClickHandler(feature);
};

const onFileLayerClick = (object, layerId, layer) => {
  if (!object || !layer) return;

  const feature = copy(object);

  feature.layer = {
    id: layerId,
    type: 'custom',
  };

  const bboxPolygon = convertBBoxToPolygon(window.mapRef?.getBounds());

  let isGeometryWithinBbox = false;

  switch (feature.geometry.type) {
    case 'Polygon':
      isGeometryWithinBbox = booleanWithin(feature.geometry, bboxPolygon);
      break;

    case 'MultiPolygon':
      for (let i = 0; i < feature.geometry.coordinates.length; i++) {
        let polygonObj = polygon(feature.geometry.coordinates[i]);
        if (booleanWithin(polygonObj, bboxPolygon)) {
          isGeometryWithinBbox = true;
          break;
        }
      }
      break;

    case 'LineString':
      let polygonObj = lineString(feature.geometry.coordinates);
      if (booleanWithin(polygonObj, bboxPolygon)) {
        isGeometryWithinBbox = true;
      }
      break;

    default:
      isGeometryWithinBbox = true;
      break;
  }

  if (!isGeometryWithinBbox) {
    const combined = combine(featureCollection([feature]));
    const bboxObj = bbox(combined);
    window.mapRef?.fitBounds(
      [
        [bboxObj[0], bboxObj[1]], // southwestern corner of the bounds
        [bboxObj[2], bboxObj[3]], // northeastern corner of the bounds
      ],
      { padding: { top: 40, bottom: 40, left: 40, right: 40 }, easing: () => 1 }
    );
  }

  return feature && udLayerClickHandler(feature, layer);
};

const onLandGridClick = (object, layerId, layer) => {
  if (!object || !layer) return;

  const feature = copy(object);

  feature.identifier = layer.identifier;
  feature.layer = {
    id: layerId,
    type: 'custom',
  };

  return feature && landgridLayerClickHandler(feature);
};

const onFeatureClick = (feature, layer) => {
  if (!layer) {
    const layers = globalStateController.getValue('layers');

    layer = layers.find(l => {
      return (
        l.layerSettings?.showable &&
        l.layerSettings?.visiable &&
        feature.layer.id.startsWith(l.identifier)
      );
    });
  }

  if (deckGlLandGridIdentifiers.some(prefix => feature.layer.id.startsWith(prefix))) {
    onLandGridClick(feature.object, feature.layer.id, layer);
    return;
  }

  if (feature.layer.id.startsWith('Wells')) {
    onWellClick(feature.object, feature.layer.id, layer);

    return;
  }

  if (ifDeckGlDataLayerIdentifiers(feature.layer.id)) {
    switch (feature.featureType || feature.object?.geometry?.type) {
      case 'MultiPolygon':
      case 'Polygon':
      case 'polygons':
        onDataLayerClick(feature.object, feature.layer.id, layer);
        break;

      case 'LineString':
      case 'Point':
      case 'points':
        onPointClick(feature.object, feature.layer.id, layer);
        break;

      default:
        break;
    }

    return;
  }

  if (ifDeckGlLayerIdentifiers(feature.layer.id)) {
    switch (feature.featureType || feature.object?.geometry?.type) {
      case 'MultiPolygon':
      case 'Polygon':
      case 'polygons':
        break;

      case 'LineString':
      case 'GeometryCollection':
      case 'Point':
      case 'points':
        onPointClick(feature.object, feature.layer.id, layer);
        break;

      default:
        break;
    }

    return;
  }

  onFileLayerClick(feature.object, feature.layer.id, layer);
};

export default onFeatureClick;
