/* eslint-disable no-undef */
import MapProvider from 'components/Map/MapProvider';
import { basic_timeouts } from '../../../cypressUtils/data';
import { drawAreaGeometry, qtrCircle } from './data';

describe('Map Component Draw Tract', () => {
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
    cy.updateAllUserLayersVisibility({ layersToShow: ['Parcels', 'Land Grid'] });
    cy.deleteCypressCustomLayers({ shapeTypes: ['parcel'], geometry: drawAreaGeometry });
  });

  it('Tract is created using circle draw and correct popup opens', () => {
    cy.get('#mapEditIcon', { timeout: basic_timeouts.longTimeout })
      .should('be.visible')
      .click();

    cy.drawAndCreateShape({
      drawType: 'circle',
      shapeType: 'parcel',
      points: [
        { x: 1046, y: 612 },
        { x: 846, y: 712 },
      ],
    });
  });

  it('Quater Quater Shape Edit works', () => {
    cy.openAndEditShapeQuater({ x: 1000, y: 450, expectedShape: qtrCircle });
  });

  it('Tract created by circle draw opens correct popup on click & delete works', () => {
    cy.openAndDeleteShape({ x: 1000, y: 450, shapeType: 'parcel' });
  });
});
