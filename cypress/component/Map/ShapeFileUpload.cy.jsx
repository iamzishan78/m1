/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { v4 as uuid } from 'uuid';
import * as turf from '@turf/turf';
import MapProvider from 'components/Map/MapProvider';
import { getUdLayerCardTitle } from 'components/UdLayerCard/UdLayerCard';
import { popupController } from 'hookstate/popupStateController';
import { UPDATE_DATASET } from 'graphQL/useMutationDataset';
import { UPDATE_MANY_LAYER } from 'graphQL/useMutationUpdateManyLayer';
import { UPDATEMANYLAYERSETTINGS } from 'graphQL/useMutationUpdateManyLayerSettings';
import { UPDATE_USER_MAP_SETTINGS } from 'graphQL/useMutationUserMapSettings';
import { basic_timeouts } from '../../cypressUtils/data';
import ldata from '../../fixtures/ldata.json';
import { headers } from '../../cypressUtils/cypressHeaders';
import { isEqual } from 'lodash';

const { midTimeout, longTimeout, partialLongTimeout } = basic_timeouts;

const fileName = 'surv025.zip';

const sourceName = 'surv02595913792-9e19-47e6-ba40-ea35479a215d';
// const sourceName = 'surv025' + uuid();

const getBBox = map => {
  const bounds = map.getBounds();
  const bbox = [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()];
  const bboxPolygon = turf.bboxPolygon(bbox);

  return bboxPolygon;
};

const getIsGeometryWithinBbox = selectedUserDefinedLayer => {
  // Getting the bounds of the map
  const bboxPolygon = getBBox(window.mapRef);

  let isGeometryWithinBbox = false;

  // Checking if the selectedUserDefinedLayer's geometry is within the bboxPolygon
  if (selectedUserDefinedLayer.geometry.type === 'MultiPolygon') {
    for (let i = 0; i < selectedUserDefinedLayer.geometry.coordinates.length; i++) {
      let polygon = turf.polygon(selectedUserDefinedLayer.geometry.coordinates[i]);
      if (turf.booleanWithin(polygon, bboxPolygon)) {
        isGeometryWithinBbox = true;
        break;
      }
    }
  } else {
    isGeometryWithinBbox = turf.booleanWithin(
      selectedUserDefinedLayer.geometry,
      bboxPolygon
    );
  }

  return isGeometryWithinBbox;
};

const dataset = {
  _id: '65cb5de3f20df7cc41118dc4',
  sourceName: 'surv02595913792-9e19-47e6-ba40-ea35479a215d',
  fileName: 'surv025.zip',
  types: [
    'Point',
    'Point',
    'LineString',
    'Point',
    'Point',
    'LineString',
    'Polygon',
    'Polygon',
  ],
  public: true,
  createBy: '659ce7cf97935e0ffa857858',
  file: '65cb5de2f20df7cc41118dbb',
  originalFile: '65cb5de0f20df7cc41118db2',
  IsDeleted: false,
  categories: [
    {
      name: 'surv025Abspt - Point',
      layerGeometry: 'Point',
      layerShapeName: 'surv025Abspt - Point',
      file: '65cb5de2f20df7cc41118dbb',
      originalFile: '65cb5de0f20df7cc41118db2',
      layerName: 'surv025Abspt - Point',
    },
    {
      name: 'surv025Abspt_ - Point',
      layerGeometry: 'Point',
      layerShapeName: 'surv025Abspt_ - Point',
      file: '65cb5de2f20df7cc41118dbb',
      originalFile: '65cb5de0f20df7cc41118db2',
      layerName: 'surv025Abspt_ - Point',
    },
    {
      name: 'surv025l - LineString',
      layerGeometry: 'LineString',
      layerShapeName: 'surv025l - LineString',
      file: '65cb5de2f20df7cc41118dbb',
      originalFile: '65cb5de0f20df7cc41118db2',
      layerName: 'surv025l - LineString',
    },
    {
      name: 'surv025Labpt - Point',
      layerGeometry: 'Point',
      layerShapeName: 'surv025Labpt - Point',
      file: '65cb5de2f20df7cc41118dbb',
      originalFile: '65cb5de0f20df7cc41118db2',
      layerName: 'surv025Labpt - Point',
    },
    {
      name: 'surv025Labpt_ - Point',
      layerGeometry: 'Point',
      layerShapeName: 'surv025Labpt_ - Point',
      file: '65cb5de2f20df7cc41118dbb',
      originalFile: '65cb5de0f20df7cc41118db2',
      layerName: 'surv025Labpt_ - Point',
    },
    {
      name: 'surv025l_ - LineString',
      layerGeometry: 'LineString',
      layerShapeName: 'surv025l_ - LineString',
      file: '65cb5de2f20df7cc41118dbb',
      originalFile: '65cb5de0f20df7cc41118db2',
      layerName: 'surv025l_ - LineString',
    },
    {
      name: 'surv025p - Polygon',
      layerGeometry: 'Polygon',
      layerShapeName: 'surv025p - Polygon',
      file: '65cb5de2f20df7cc41118dbb',
      originalFile: '65cb5de0f20df7cc41118db2',
      layerName: 'surv025p - Polygon',
    },
    {
      name: 'surv025p_ - Polygon',
      layerGeometry: 'Polygon',
      layerShapeName: 'surv025p_ - Polygon',
      file: '65cb5de2f20df7cc41118dbb',
      originalFile: '65cb5de0f20df7cc41118db2',
      layerName: 'surv025p_ - Polygon',
    },
  ],
  name: 'surv02595913792-9e19-47e6-ba40-ea35479a215d',
  categoryCount: 8,
  visibility: true,
};

const layerIds = [
  '65cb5df5f4c7b713ede6fac5',
  '65cb5df3f20df7cc41118dd5',
  '65cb5e08f4c7b713ede6facd',
  '65cb5df3f4c7b713ede6fac1',
  '65cb5dfbf4c7b713ede6fac8',
  '65cb5df2f4c7b713ede6faba',
  '65cb5df2f4c7b713ede6fabc',
  '65cb5df4f4c7b713ede6fac3',
];
const layerSettings = [
  '65cb5e0df4c7b713ede6fad8',
  '65cb5e0df4c7b713ede6fad9',
  '65cb5e0df4c7b713ede6fada',
  '65cb5e0df4c7b713ede6fadb',
  '65cb5e0df4c7b713ede6fadc',
  '65cb5e0df4c7b713ede6fadd',
  '65cb5e0df4c7b713ede6fade',
  '65cb5e0df4c7b713ede6fadf',
];

const layers = layerIds.map(layerId => ({
  _id: layerId,
  IsDeleted: false,
}));
const manySettings = layerSettings.map(layerSetting => ({
  _id: layerSetting,
  layerSettings: {
    interaction: {
      interactionAble: true,
      interactionDetail: {
        hover: true,
        click: true,
      },
    },
    colorable: true,
    showable: true,
    visiable: true,
  },
}));

describe('Map Component Shape File Upload', () => {
  beforeEach(() => {
    cy.interceptAndWait(['getAllLayerSettingsByUser'], () => {
      cy.viewport(1800, 1200).mount(<MapProvider match={{ params: {} }} />);
    });

    cy.wait(midTimeout);
  });

  it('Layer Settings are updated', () => {
    cy.updateAllUserLayersVisibility({
      layersToShow: ['Land Grid'],
    });
  });

  it('Restores deleted data', () => {
    // Payload for updating the dataset
    const updateDatasetPayload = {
      operationName: 'updateDataset',
      variables: { dataset },
      query: UPDATE_DATASET.loc.source.body,
    };

    // Payload for updating multiple layers
    const updatelayersPayload = {
      operationName: 'updateManyLayer',
      variables: { layers },
      query: UPDATE_MANY_LAYER.loc.source.body,
    };

    // Payload for updating multiple layer settings
    const updateLayerSettingsPayload = {
      operationName: 'UpdateManyLayerSettings',
      variables: { manySettings },
      query: UPDATEMANYLAYERSETTINGS.loc.source.body,
    };

    // Payload for updating user map settings
    const updateMapSettingsPayload = {
      operationName: 'updateUserMapSettings',
      variables: {
        settings: {
          user: '659ce7cf97935e0ffa857858',
          type: 'DatasetVisibility',
          settings: {
            '65cb5de3f20df7cc41118dc4': true,
          },
        },
      },
      query: UPDATE_USER_MAP_SETTINGS.loc.source.body,
    };

    // Making HTTP requests to update dataset, layers, map settings, and layer settings
    cy.request({
      method: 'POST',
      url: ldata.url,
      headers: headers,
      body: updateDatasetPayload,
    }).then(() => {
      // Upon successful update of dataset, updating layers
      cy.request({
        method: 'POST',
        url: ldata.url,
        headers: headers,
        body: updatelayersPayload,
      });

      // Updating user map settings
      cy.request({
        method: 'POST',
        url: ldata.url,
        headers: headers,
        body: updateMapSettingsPayload,
      });

      // Updating layer settings
      cy.request({
        method: 'POST',
        url: ldata.url,
        headers: headers,
        body: updateLayerSettingsPayload,
      });
    });
  });

  // it('Shapefile upload works', () => {
  //   cy.get('#managerButton', { timeout: longTimeout }).should('be.visible').click();

  //   cy.get('#sourceManagerDiv', { timeout: longTimeout }).should('be.visible');

  //   cy.get('input[type=file]', { force: true })
  //     .scrollIntoView()
  //     .selectFile(`cypress/files/${fileName}`, {
  //       force: true,
  //     });

  //   cy.get(`input#groupName`, { timeout: longTimeout }).clear().type(sourceName);

  //   cy.interceptAndWait(
  //     ['getDatasets'],
  //     alias => {
  //       cy.get('#createSourceButton', { timeout: longTimeout }).click();
  //       cy.get('#createSourceButton', { timeout: longTimeout }).should('not.be.visible');

  //       cy.wait(alias, { timeout: longTimeout }).then(result => {
  //         const sourceNames = result.response?.body?.data?.getDatasets.map(
  //           hit => hit.sourceName
  //         );

  //         expect(sourceNames).to.include(sourceName);
  //       });
  //     },
  //     { wait: false }
  //   );
  // });

  // Test case to ensure that data exists in the dataset grid
  it('Data exists in dataset grid', () => {
    // Intercepting requests for 'getESSimpleSearch' and 'shapefile_flat' and waiting for them to complete
    cy.interceptAndWait(['getESSimpleSearch', 'shapefile_flat'], () => {
      // Clicking on the grid icon corresponding to the given sourceName after scrolling into view
      cy.get(`[id='grid-icon-${sourceName}']`, { timeout: longTimeout })
        .scrollIntoView()
        .click({ force: true });
    });

    // Verifying that the tbody does not contain messages indicating no results or no records to display
    cy.get('tbody').should('not.contain', 'No results found');
    cy.get('tbody').should('not.contain', 'No records to display');

    // Closing the modal with class '.MuiButtonBase-root' and aria-label "Close"
    cy.get('.MuiButtonBase-root[aria-label="Close"]').click();

    // Waiting for 1000 milliseconds
    cy.wait(1000);
  });

  // Test case to verify that the shapefile grid flyto functionality works
  it('Shapefile grid flyto works', () => {
    // Intercepting requests for 'getESSimpleSearch' and 'shapefile_flat' and waiting for them to complete
    cy.interceptAndWait(['getESSimpleSearch', 'shapefile_flat'], () => {
      // Clicking on the grid icon corresponding to the given sourceName after scrolling into view
      cy.get(`[id='grid-icon-${sourceName}']`, { timeout: longTimeout })
        .scrollIntoView()
        .click({ force: true });
    });

    // Clicking on the first element with data-testid "mrt-fly-to-map"
    cy.get('[data-testid="mrt-fly-to-map"]').eq(0).click();

    // Waiting for a short timeout before executing assertions
    cy.wait(basic_timeouts.shorTimeout).then(() => {
      // Getting values from the popup controller for selectedShapeFile and selectedUserDefinedLayer
      const { selectedShapeFile, selectedUserDefinedLayer } = popupController.getValues([
        'selectedShapeFile',
        'selectedUserDefinedLayer',
      ]);

      // Expecting selectedShapeFile to be truthy
      expect(!!selectedShapeFile).to.be.equal(true);

      const isGeometryWithinBbox = getIsGeometryWithinBbox(selectedShapeFile);

      // Expecting the geometry to be within the bbox
      expect(isGeometryWithinBbox).to.be.equal(true);

      // Verifying the title and subheader of the ud-layer-card-header
      cy.get('[data-testid="ud-layer-card-header"] .MuiCardHeader-title').contains(
        getUdLayerCardTitle(selectedUserDefinedLayer)
      );

      cy.get('[data-testid="ud-layer-card-header"] .MuiCardHeader-subheader').contains(
        selectedUserDefinedLayer.layer.groupName
          ? selectedUserDefinedLayer.layer.layerName
          : ''
      );

      // Closing the modal with class '.MuiButtonBase-root' and aria-label "Close"
      cy.get('.MuiButtonBase-root[aria-label="Close"]').click();

      // Waiting for 1000 milliseconds
      cy.wait(1000);
    });
  });

  // Test case to ensure that deleting a sub dataset does not delete the group
  it('Does not delete the group when a sub dataset is deleted', () => {
    // Clicking on the manager button and ensuring it is visible
    cy.get('#managerButton', { timeout: longTimeout }).should('be.visible').click();

    // Ensuring the source manager division is visible
    cy.get('#sourceManagerDiv', { timeout: longTimeout }).should('be.visible');

    // Clicking on the specific source to manage
    cy.get(`[data-testid='source-${sourceName}']`, { timeout: longTimeout })
      .scrollIntoView()
      .click();

    // Scrolling to the source-ul element related to the sourceName
    cy.get(`[data-testid='source-ul-${sourceName}']`, {
      timeout: longTimeout,
    }).scrollIntoView();

    // Finding and clicking on the delete option for the source
    cy.get(`[data-testid='source-ul-${sourceName}']`)
      .find('[aria-controls="more-source-menu"]')
      .eq(0)
      .invoke('show')
      .click({ force: true });

    // Clicking on the deleteSource option and intercepting getDatasets request
    cy.get('#deleteSource', { timeout: longTimeout }).click();
    cy.interceptAndWait(['getDatasets'], () => {
      cy.get('#deleteConfirmation', { timeout: longTimeout }).click();
    });

    // Verifying that the group related to the sourceName still exists
    cy.get(`[data-testid="group-${sourceName}"]`);
  });

  it('Shapefile click works & boundary appears', () => {
    cy.wait(100).then(() => {
      window.mapRef.jumpTo({
        center: {
          lng: -97.75524486665434,
          lat: 28.553817655727713,
        },
        zoom: 15.2,
      });

      cy.wait(basic_timeouts.shorTimeout).then(() => {
        cy.get('.mapboxgl-canvas').first().click(1000, 500);

        cy.wait(5000).then(() => {
          const sourceLine = window.mapRef.getSource('boundary-line-source')?._data;

          // Getting values from the popup controller for selectedShapeFile and selectedUserDefinedLayer
          const { selectedUserDefinedLayer } = popupController.getValues([
            'selectedShapeFile',
            'selectedUserDefinedLayer',
          ]);

          const boundaryLine = {
            type: 'Feature',
            properties: {},
            geometry: {
              type: selectedUserDefinedLayer.geometry.type,
              coordinates: selectedUserDefinedLayer.geometry.coordinates,
            },
          };

          if (sourceLine) expect(isEqual(sourceLine, boundaryLine)).to.be.equal(true);

          // Expecting selectedUserDefinedLayer to be truthy
          expect(!!selectedUserDefinedLayer).to.be.equal(true);

          const isGeometryWithinBbox = getIsGeometryWithinBbox(selectedUserDefinedLayer);

          // Expecting the geometry to be within the bbox
          expect(isGeometryWithinBbox).to.be.equal(true);
        });
      });
    });
  });

  // it('Shapefile delete works', () => {
  //   cy.get('#managerButton', { timeout: longTimeout }).should('be.visible').click();

  //   cy.get('#sourceManagerDiv', { timeout: longTimeout }).should('be.visible');

  //   cy.get(`[id='source-checkbox-${sourceName}']`, { timeout: longTimeout })
  //     .scrollIntoView()
  //     .trigger('mouseover');
  //   cy.get(`[id='more-horiz-${sourceName}']`, { timeout: longTimeout })
  //     .scrollIntoView()
  //     .invoke('show')
  //     .click({ force: true });

  //   cy.get('#deleteSource', { timeout: longTimeout }).click();

  //   cy.interceptAndWait(
  //     ['getDatasets'],
  //     alias => {
  //       cy.get('#deleteConfirmation', { timeout: longTimeout }).click();

  //       cy.wait(alias, { timeout: longTimeout }).then(result => {
  //         const sourceNames = result.response?.body?.data?.getDatasets.map(
  //           hit => hit.sourceName
  //         );

  //         expect(sourceNames).to.not.include(sourceName);
  //       });
  //     },
  //     { wait: false }
  //   );
  // });
});
