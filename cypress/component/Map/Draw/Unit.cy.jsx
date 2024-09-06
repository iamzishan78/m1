/* eslint-disable no-undef */
import MapProvider from 'components/Map/MapProvider';
import { basic_timeouts } from '../../../cypressUtils/data';
import {
  drawAreaGeometry,
  editedPolygon,
  relocatedPolygon,
  resizedPolygon,
} from './data';

let createdLandGridName = 'T007N R023E — Section 06';
let customLayerByRectangle = {};
let customLayerByLandGrid = {};

describe('Map Component Draw Unit', () => {
  beforeEach(() => {
    cy.interceptAndWait(['getAllLayerSettingsByUser'], () => {
      cy.viewport(1800, 1200).mount(<MapProvider match={{ params: {} }} />);
    });

    cy.waitUntilMapRefDefined().then(() => {
      window.mapRef.jumpTo({
        center: {
          lng: -104.55022961850318,
          lat: 34.84921034658842,
        },
        zoom: 12.9,
      });

      cy.wait(basic_timeouts.shorTimeout);
    });
  });

  it('User Layer Settings are updated', () => {
    cy.updateAllUserLayersVisibility({ layersToShow: ['Units', 'Land Grid'] });
    cy.deleteCypressCustomLayers({ shapeTypes: ['unit'], geometry: drawAreaGeometry });
  });

  it('Unit is created using rectangle draw and correct popup opens', () => {
    cy.get('#mapEditIcon', { timeout: basic_timeouts.longTimeout })
      .should('be.visible')
      .click();

    cy.drawAndCreateShape({
      drawType: 'rectangle',
      shapeType: 'unit',
      points: [
        { x: 846, y: 712 },
        { x: 1246, y: 612 },
      ],
    }).then(({ customLayer }) => {
      customLayerByRectangle = customLayer;
    });
  });

  it('Shape edit works', () => {
    cy.openAndEditShape({
      x: 900,
      y: 700,
      points: [
        { x: 846, y: 712 },
        { x: 700, y: 812 },
      ],
      type: 'edit',
      shapeType: 'unit',
      expectedShape: editedPolygon,
      openPoint: { x: 846, y: 712 },
      newCustomLayer: customLayerByRectangle,
    }).then(({ customLayer }) => {
      customLayerByRectangle = customLayer;
    });
  });

  it('Shape resize works', () => {
    cy.openAndEditShape({
      x: 900,
      y: 700,
      points: [
        { x: 700, y: 812 },
        { x: 550, y: 912 },
      ],
      type: 'resize',
      shapeType: 'unit',
      expectedShape: resizedPolygon,
      openPoint: { x: 701, y: 811 },
      newCustomLayer: customLayerByRectangle,
    }).then(({ customLayer }) => {
      customLayerByRectangle = customLayer;
    });
  });

  it('Shape relocate works', () => {
    cy.openAndEditShape({
      x: 900,
      y: 700,
      points: [
        { x: 700, y: 812 },
        { x: 1000, y: 450 },
      ],
      type: 'relocate',
      shapeType: 'unit',
      expectedShape: relocatedPolygon,
      openPoint: { x: 1200, y: 400 },
      newCustomLayer: customLayerByRectangle,
    }).then(({ customLayer }) => {
      customLayerByRectangle = customLayer;
    });
  });

  it('Unit is created using landgrid and correct popup opens', () => {
    cy.get('#mapEditIcon', { timeout: basic_timeouts.longTimeout })
      .should('be.visible')
      .click();

    cy.drawAndCreateShape({
      drawType: 'landgrid',
      shapeType: 'unit',
      points: [
        { x: 1000, y: 450 },
        { x: 1200, y: 450 },
      ],
    }).then(({ createdShapeName, customLayer }) => {
      createdLandGridName = createdShapeName;
      customLayerByLandGrid = customLayer;
    });
  });

  it('Right click works and click on landgrid layer opens correct popup & delete works', () => {
    cy.rightClickAndDeleteShape({
      x: 1200,
      y: 400,
      groupName: 'Units',
      shapeName: createdLandGridName?.createdShapeName || createdLandGridName,
      shapeType: 'unit',
      newCustomLayer: customLayerByLandGrid,
    });
  });

  it('Unit created by rectangle draw opens correct popup on click & delete works', () => {
    cy.openAndDeleteShape({ x: 1200, y: 400, shapeType: 'unit', newCustomLayer: customLayerByRectangle });
  });
});
