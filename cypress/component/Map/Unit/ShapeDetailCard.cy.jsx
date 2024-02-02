/* eslint-disable no-undef */

import ExpandableCardProvider from 'components/ExpandableCard/ExpandableCardProvider';
import ShapeDetailCard from 'components/ShapeDetailCard';
import { popupController } from 'hookstate/popupStateController';
import { basic_timeouts } from '../../../cypressUtils/data';
import ldata from '../../../fixtures/ldata.json';
import { CUSTOMLAYER } from 'graphQL/useQueryCustomLayer';
import { UPDATECUSTOMLAYER } from 'graphQL/useMutationUpdateCustomLayer';

const selectedShape = {
  id: '65b0c87166115215f9155bc4',
  type: 'unit',
  layerType: 'unit',
  shapeLabel: 'T004S R066W — Section 36',
  shapeSubtitle: 'Arapahoe, CO - T004S R066W — Section 36',
};

Cypress.Commands.add('setMapData', ({ testId, value }) => {
  cy.get(`[data-testid="data-cell-${testId}"]`, {
    timeout: basic_timeouts.midTimeout,
  }).trigger('mouseover');

  cy.interceptAndWait(['getESSimpleFilter'], () => {
    cy.get(`button[data-testid="edit-${testId}"]`).click();
  });


  cy.get(`input#filter-autocomplete-${testId}`).type(value);

  cy.get('.MuiAutocomplete-popper', {
    responseTimeout: basic_timeouts.partialLongTimeout,
  }).should('exist');

  cy.wait(basic_timeouts.shorTimeout);

  cy.interceptAndWait(['updateCustomLayer'], () => {
    cy.get('.MuiAutocomplete-option').first().click();
  });

  cy.get('body').click();

  cy.get(`[data-testid="data-cell-${testId}"]`).contains(value);
});

describe('Restore Unit for ShapeDetailCard.cy.jsx if Deleted', () => {
  it('Restoring Unit 65b0c87166115215f9155bc4', () => {
    // Define your headers
    const headers = {
      'Content-Type': 'application/json',
      'X-ZUMO-AUTH': ldata.x_zumo_auth,
    };

    // Define your request payload
    const payload = {
      operationName: 'updateCustomLayer',
      variables: {
        customLayerId: '65b0c87166115215f9155bc4',
        customLayer: { IsDeleted: false },
      },
      query: UPDATECUSTOMLAYER.loc.source.body,
    };

    const getLayerPayload = {
      operationName: 'getCustomLayer',
      variables: { id: '65b0c87166115215f9155bc4' },
      query: CUSTOMLAYER.loc.source.body,
    };
    cy.request({
      method: 'POST',
      url: ldata.url,
      headers: headers,
      body: getLayerPayload,
    }).then(response => {
      if (!response?.body?.data?.customLayer)
        cy.request({
          method: 'POST',
          url: ldata.url,
          headers: headers,
          body: payload,
        }).then(response => {
          expect(response.status).to.eq(200);
        });
      else expect(response.status).to.eq(200);
    });
  });
});

describe('ShapeDetailCard.cy.jsx', () => {

  it('IF TX ( State=CO,County=Andrews,Township=004S,Range=066W,Section=36 ) ELSE ( State=TX,County=Anderson,Township=035S,Range=055W,Section=47 )', () => {

    popupController.updateState({ selectedShape });

    cy.interceptAndWait(['getCustomLayer'], (alias) => {
      cy.viewport(1600, 1200).mount(
        <ExpandableCardProvider
          expanded={true}
          // handleCloseExpandableCard={handleCloseExpandableCard}
          component={<ShapeDetailCard type={selectedShape.type}></ShapeDetailCard>}
          title={selectedShape?.shapeLabel}
          subTitle={selectedShape?.shapeSubtitle || selectedShape?.unitInfo}
          parent="map"
          position="relative"
          cardTop={0}
          cardLeft={0}
          zIndex={99}
          cardWidthExpanded="50vw"
          cardHeightExpanded="calc(100vh - 64px)"
          targetSourceId={selectedShape?.id}
          targetLabel={selectedShape.type}
        // deleteCustomLayer={deleteCustomLayer}
        ></ExpandableCardProvider>,
        { spec: 'ShapeDetailCard' }
      );

      cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then((response) => {
        const state = response?.body?.data?.customLayer?.shapeJson?.properties?.State;
        if (state === 'TX') {
          cy.setMapData({ testId: 'State', value: 'CO' });
          cy.setMapData({ testId: 'County', value: 'Andrews' });
          cy.setMapData({ testId: 'Township', value: '004S' });
          cy.setMapData({ testId: 'Range', value: '066W' });
          cy.setMapData({ testId: 'Section', value: '36' });
        } else {
          cy.setMapData({ testId: 'State', value: 'TX' });
          cy.setMapData({ testId: 'County', value: 'Anderson' });
          cy.setMapData({ testId: 'Township', value: '035S' });
          cy.setMapData({ testId: 'Range', value: '055W' });
          cy.setMapData({ testId: 'Section', value: '47' });
        }
      });

    });
  });
});
