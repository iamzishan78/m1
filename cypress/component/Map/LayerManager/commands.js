/* eslint-disable no-undef */
import { UPDATE_ALL_USER_LAYERS_SETTINGS } from 'graphQL/useMutationUpdateLayerSettings';
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

