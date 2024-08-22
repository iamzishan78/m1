/* eslint-disable no-undef */
import MapProvider from 'components/Map/MapProvider';
import { basic_timeouts } from '../../../cypressUtils/data';
import { drawAreaGeometry } from './data';

describe('Map Component Draw Surface', () => {
  beforeEach(() => {
    cy.interceptAndWait(['getAllLayerSettingsByUser'], () => {
      cy.viewport(1800, 1200).mount(<MapProvider match={{ params: {} }} />, {
        testCase: 'AgreementDraw',
      });
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
    cy.updateAllUserLayersVisibility({ layersToShow: ['Surfaces', 'Land Grid'] });
    cy.deleteCypressCustomLayers({
      shapeTypes: ['surface'],
      geometry: drawAreaGeometry,
    });
  });

  it('Surface is created using rectangle draw and correct popup opens', () => {
    cy.get('#mapEditIcon', { timeout: basic_timeouts.longTimeout })
      .should('be.visible')
      .click();

    cy.drawAndCreateShape({
      drawType: 'rectangle',
      shapeType: 'surface',
      points: [
        { x: 846, y: 712 },
        { x: 1246, y: 612 },
      ],
    });
  });

  it('Surface created by rectangle draw opens correct popup on click & delete works', () => {
    cy.openAndDeleteShape({ x: 1200, y: 650, shapeType: 'surface' });
  });
});
