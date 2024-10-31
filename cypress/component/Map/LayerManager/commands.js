/* eslint-disable no-undef */
import { UPDATE_ALL_USER_LAYERS_SETTINGS } from 'graphQL/useMutationUpdateLayerSettings';
import { DELETE_CYPRESS_CUSTOM_LAYERS } from 'graphQL/useMutationCommonCypressRevert';
import ldata from '../../../fixtures/ldata.json';

const headers = {
  'Content-Type': 'application/json',
  'X-ZUMO-AUTH': ldata.x_zumo_auth,
  'X-MS-TOKEN-AAD-ID-TOKEN': ldata.access_token,
};

// Cypress custom command to update visibility of all user layers
Cypress.Commands.add('updateAllUserLayersVisibility', ({ layersToShow }) => {
  // Making a POST request to update user layers visibility
  cy.request({
    method: 'POST',
    url: ldata.url, // URL from ldata object
    headers: headers, // Headers for the request
    body: {
      // Request body containing operationName, variables, and query
      operationName: 'updateAllUserLayersVisibility',
      variables: {
        layersToShow: layersToShow, // Layers to be shown
      },
      query: UPDATE_ALL_USER_LAYERS_SETTINGS.loc.source.body, // Query for updating user layers settings
    },
  }).then(response => {
    // Asserting response status and success value
    expect(response.status).to.eq(200); // Expecting status code 200
    expect(response?.body?.data?.updateAllUserLayersVisibility.success).to.eq(true); // Expecting success value to be true
  });
});

// Cypress custom command to delete cypress custom layers
Cypress.Commands.add('deleteCypressCustomLayers', ({ shapeTypes, geometry }) => {
  // Making a POST request to delete custom layers
  cy.request({
    method: 'POST',
    url: ldata.url, // URL from ldata object
    headers: headers, // Headers for the request
    body: {
      // Request body containing operationName, variables, and query
      operationName: 'deleteCypressCustomLayers',
      variables: {
        geometry,
        shapeTypes,
      },
      query: DELETE_CYPRESS_CUSTOM_LAYERS.loc.source.body, // Query for updating user layers settings
    },
  }).then(response => {
    // Asserting response status and success value
    expect(response.status).to.eq(200); // Expecting status code 200
    expect(response?.body?.data?.deleteCypressCustomLayers.success).to.eq(true); // Expecting success value to be true
  });
});

// Cypress custom command to toggle visibility of a layer's text
Cypress.Commands.add('toggleLayerSettings', ({ shapeName, type, isTrue }) => {
  // Clicking on layer settings for the specified shape
  cy.get(
    `[data-testid="layer-${shapeName}"] [data-testid="layer-settings"]`
  ).click();

  // Waiting for 1 second
  cy.wait(1000);

  switch (type) {
    case 'text':
      // Clicking on the layer label visibility toggle
      cy.get('[data-testid="layer-label-visibility-toggle"]').click();

      break;

    case 'pickable':
      // Clicking on the layer pickability toggle
      cy.get('[data-testid="layer-pickability-toggle"]').click();

      break;

    default:
      break;
  }

  // Intercepting and waiting for 'UpdateLayerSettings' event
  cy.interceptAndWait(['UpdateLayerSettings'], () => {
    // Clicking on close button
    cy.get('[data-testid="close"]').click();
  });

  // Waiting for 100 milliseconds and then asserting the visibility of the text layer
  cy.wait(100).then(() => {
    switch (type) {
      case 'text':
        // Finding the unit text layer in the map reference
        const unitTextLayer = window.mapRef.__deck.layerManager.layers.find(
          l => l.constructor.layerName === 'TextLayer' && l.id.startsWith('Units_')
        );

        // Expecting the visibility of unit text layer to match the expected visibility
        expect(!!unitTextLayer?.props?.visible).to.be.equal(!isTrue);

        break;

      case 'pickable':
        // Finding the unit layer in the map reference
        let unitLayer = window.mapRef.__deck.layerManager.layers.find(
          l => l.props.type.layerName === 'GeoJsonLayer' && l.id.startsWith('Units_')
        );

        // Expecting the pickability of text layer to match the expected pickability
        expect(!!unitLayer?.props?.pickable).to.be.equal(!isTrue);

        break;

      default:
        break;
    }
  });
});
