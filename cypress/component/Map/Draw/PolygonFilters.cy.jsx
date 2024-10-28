/* eslint-disable no-undef */
import MapProvider from 'components/Map/MapProvider';
import { basic_timeouts } from '../../../cypressUtils/data';
import * as turf from '@turf/turf';
import { drawController } from 'hookstate/drawStateController';

// Custom Cypress command to draw a shape and create it on the map
Cypress.Commands.add('testPolygonFilter', ({ type }) => {
  // Get the map edit icon and ensure it's visible, then click it
  cy.get('#mapEditIcon', { timeout: basic_timeouts.longTimeout })
    .should('be.visible')
    .click();

  // Draw a rectangle shape on the map
  cy.drawShape({
    drawType: 'rectangle',
    shapeType: 'unit',
    points: [
      { x: 846, y: 712 },
      { x: 1246, y: 612 },
    ],
  });

  // Wait for 5 seconds for the drawn shape to be processed
  cy.wait(5000);

  // Get query name according to the type
  const query = type === 'grid' ? 'getESSimpleSearch' : 'getESSimpleWells';

  // Intercept and wait for specified requests
  cy.interceptAndWait(
    [query, 'platformData:well'],
    alias => {
      // Click the filter button on the map
      cy.get(`[data-testid="filter-on-${type}"]`).click();

      // Wait for the intercepted requests to complete
      cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then(response => {
        // Extract data from the intercepted response
        const responseHits = response.response.body.data[query].hits;
        const geo_intersects = response.request.body.variables.filters.find(
          f => f.type === 'geo_intersects'
        );

        // Create polygons for filtered area and current drawn shape
        const filteredPolygon = turf.polygon(geo_intersects.value.coordinates);
        const currentPolygon = turf.polygon(
          drawController.getValue('currentFeature').geometry.coordinates
        );

        // Check if the filtered polygon and current drawn shape are equal
        expect(turf.booleanEqual(filteredPolygon, currentPolygon)).to.be.equal(true);

        // Check if there are at least some hits returned from the filter
        expect(responseHits.length).to.be.at.least(1);

        // Create points from the hits
        var points = turf.points(
          responseHits.map(hit => hit.geoJSON.geometries[0].coordinates)
        );

        // Check if all points fall within the filtered polygon
        var pointsWithin = turf.pointsWithinPolygon(points, filteredPolygon);
        expect(pointsWithin.features.length).to.be.equal(points.features.length);
      });
    },
    { wait: false } // Specify to not wait for the intercepted requests to complete
  );
});

describe('Map Component Polygon Filters', () => {
  beforeEach(() => {
    cy.interceptAndWait(['getAllLayerSettingsByUser'], () => {
      cy.viewport(1800, 1200).mount(<MapProvider match={{ params: {} }} />);
    });

    cy.waitUntilMapRefDefined().then(() => {
      window.mapRef.jumpTo({
        center: {
          lng: -99.13764727392922,
          lat: 31.819087912619537,
        },
        zoom: 12,
      });

      cy.wait(basic_timeouts.shorTimeout);
    });
  });

  it('User Layer Settings are updated', () => {
    cy.updateAllUserLayersVisibility({ layersToShow: ['Wells', 'Land Grid'] });
  });

  it('Polygon filter on map works', () => {
    cy.testPolygonFilter({ type: 'map' });
  });

  it('Polygon filter on snap grid works', () => {
    cy.testPolygonFilter({ type: 'grid' });
  });
});
