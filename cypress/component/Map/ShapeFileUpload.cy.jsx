/* eslint-disable no-undef */
import { v4 as uuid } from 'uuid';
import * as turf from '@turf/turf';
import MapProvider from 'components/Map/MapProvider';
import { getUdLayerCardTitle } from 'components/UdLayerCard/UdLayerCard';
import { popupController } from 'hookstate/popupStateController';
import { basic_timeouts } from '../../cypressUtils/data';

const { midTimeout, longTimeout, partialLongTimeout } = basic_timeouts;

const fileName = 'surv025.zip';

const sourceName = 'surv025' + uuid();

describe('Map Component Shape File Upload', () => {
  beforeEach(() => {
    cy.viewport(1800, 1200).mount(<MapProvider match={{ params: {} }} />);

    cy.wait(midTimeout);
  });

  it('Shapefile upload works', () => {
    cy.get('#managerButton', { timeout: longTimeout }).should('be.visible').click();

    cy.get('#sourceManagerDiv', { timeout: longTimeout }).should('be.visible');

    cy.get('input[type=file]', { force: true })
      .scrollIntoView()
      .selectFile(`cypress/files/${fileName}`, {
        force: true,
      });

    cy.get(`input#groupName`, { timeout: longTimeout }).clear().type(sourceName);

    cy.interceptAndWait(
      ['getDatasets'],
      alias => {
        cy.get('#createSourceButton', { timeout: longTimeout }).click();
        cy.get('#createSourceButton', { timeout: longTimeout }).should('not.be.visible');

        cy.wait(alias, { timeout: longTimeout }).then(result => {
          const sourceNames = result.response?.body?.data?.getDatasets.map(
            hit => hit.sourceName
          );

          expect(sourceNames).to.include(sourceName);
        });
      },
      { wait: false }
    );
  });

  it('Data exits in dataset grid', () => {
    cy.wait(partialLongTimeout);

    cy.interceptAndWait(['getESSimpleSearch', 'shapefile_flat'], () => {
      cy.get(`[id='grid-icon-${sourceName}']`, { timeout: longTimeout })
        .scrollIntoView()
        .click({ force: true });
    });

    cy.get('tbody').should('not.contain', 'No results found');
    cy.get('tbody').should('not.contain', 'No records to display');

    cy.get('.MuiButtonBase-root[aria-label="Close"]').click();

    cy.wait(1000);
  });

  it('Shapefile grid flyto works', () => {
    cy.interceptAndWait(['getESSimpleSearch', 'shapefile_flat'], () => {
      cy.get(`[id='grid-icon-${sourceName}']`, { timeout: longTimeout })
        .scrollIntoView()
        .click({ force: true });
    });

    cy.get('[data-testid="mrt-fly-to-map"]').eq(0).click();

    cy.wait(basic_timeouts.shorTimeout).then(() => {
      const { selectedShapeFile, selectedUserDefinedLayer } = popupController.getValues([
        'selectedShapeFile',
        'selectedUserDefinedLayer',
      ]);

      expect(!!selectedShapeFile).to.be.equal(true);

      const bounds = window.mapRef.getBounds();
      const bbox = [
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ];
      const bboxPolygon = turf.bboxPolygon(bbox);

      let isGeometryWithinBbox = false;

      if (selectedShapeFile.geometry.type === 'MultiPolygon')
        for (let i = 0; i < selectedShapeFile.geometry.coordinates.length; i++) {
          let polygon = turf.polygon(selectedShapeFile.geometry.coordinates[i]);
          if (turf.booleanWithin(polygon, bboxPolygon)) {
            isGeometryWithinBbox = true;
            break;
          }
        }
      else
        isGeometryWithinBbox = turf.booleanWithin(
          selectedShapeFile.geometry,
          bboxPolygon
        );

      expect(isGeometryWithinBbox).to.be.equal(true);

      cy.get('[data-testid="ud-layer-card-header"] .MuiCardHeader-title').contains(
        getUdLayerCardTitle(selectedUserDefinedLayer)
      );

      cy.get('[data-testid="ud-layer-card-header"] .MuiCardHeader-subheader').contains(
        selectedUserDefinedLayer.layer.groupName
          ? selectedUserDefinedLayer.layer.layerName
          : ''
      );

      cy.get('.MuiButtonBase-root[aria-label="Close"]').click();

      cy.wait(1000);
    });
  });

  it('Does not delete the group when a sub dataset is deleted', () => {
    cy.get('#managerButton', { timeout: longTimeout }).should('be.visible').click();

    cy.get('#sourceManagerDiv', { timeout: longTimeout }).should('be.visible');

    cy.get(`[data-testid='source-${sourceName}']`, { timeout: longTimeout })
      .scrollIntoView()
      .click();

    cy.get(`[data-testid='source-ul-${sourceName}']`, {
      timeout: longTimeout,
    }).scrollIntoView();
    cy.get(`[data-testid='source-ul-${sourceName}']`)
      .find('[aria-controls="more-source-menu"]')
      .eq(0)
      .invoke('show')
      .click({ force: true });

    cy.get('#deleteSource', { timeout: longTimeout }).click();

    cy.interceptAndWait(['getDatasets'], () => {
      cy.get('#deleteConfirmation', { timeout: longTimeout }).click();
    });

    cy.get(`[data-testid="group-${sourceName}"]`);
  });

  it('Shapefile delete works', () => {
    cy.get('#managerButton', { timeout: longTimeout }).should('be.visible').click();

    cy.get('#sourceManagerDiv', { timeout: longTimeout }).should('be.visible');

    cy.get(`[id='source-checkbox-${sourceName}']`, { timeout: longTimeout })
      .scrollIntoView()
      .trigger('mouseover');
    cy.get(`[id='more-horiz-${sourceName}']`, { timeout: longTimeout })
      .scrollIntoView()
      .invoke('show')
      .click({ force: true });

    cy.get('#deleteSource', { timeout: longTimeout }).click();

    cy.interceptAndWait(
      ['getDatasets'],
      alias => {
        cy.get('#deleteConfirmation', { timeout: longTimeout }).click();

        cy.wait(alias, { timeout: longTimeout }).then(result => {
          const sourceNames = result.response?.body?.data?.getDatasets.map(
            hit => hit.sourceName
          );

          expect(sourceNames).to.not.include(sourceName);
        });
      },
      { wait: false }
    );
  });
});
