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

const headers = {
  'Content-Type': 'application/json',
  'X-ZUMO-AUTH': ldata.x_zumo_auth,
};

const { midTimeout, longTimeout, partialLongTimeout } = basic_timeouts;

const fileName = 'surv025.zip';

const sourceName = 'surv02595913792-9e19-47e6-ba40-ea35479a215d';
// const sourceName = 'surv025' + uuid();

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
    cy.viewport(1800, 1200).mount(<MapProvider match={{ params: {} }} />);

    cy.wait(midTimeout);
  });

  it('Restores deleted data', () => {
    const updateDatasetPayload = {
      operationName: 'updateDataset',
      variables: { dataset },
      query: UPDATE_DATASET.loc.source.body,
    };

    const updatelayersPayload = {
      operationName: 'updateManyLayer',
      variables: { layers },
      query: UPDATE_MANY_LAYER.loc.source.body,
    };

    const updateLayerSettingsPayload = {
      operationName: 'UpdateManyLayerSettings',
      variables: { manySettings },
      query: UPDATEMANYLAYERSETTINGS.loc.source.body,
    };

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

    cy.request({
      method: 'POST',
      url: ldata.url,
      headers: headers,
      body: updateDatasetPayload,
    }).then(() => {
      cy.request({
        method: 'POST',
        url: ldata.url,
        headers: headers,
        body: updatelayersPayload,
      });
      cy.request({
        method: 'POST',
        url: ldata.url,
        headers: headers,
        body: updateMapSettingsPayload,
      });
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

  it('Data exits in dataset grid', () => {
    // cy.wait(partialLongTimeout);

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
