/* eslint-disable no-undef */

import ExpandableCardProvider from 'components/ExpandableCard/ExpandableCardProvider';
import ShapeDetailCard from 'components/ShapeDetailCard';
import { popupController } from 'hookstate/popupStateController';
import { basic_timeouts, retries } from '../../../cypressUtils/data';
import ldata from '../../../fixtures/ldata.json';
import { CUSTOMLAYER } from 'graphQL/useQueryCustomLayer';
import { UPDATECUSTOMLAYER } from 'graphQL/useMutationUpdateCustomLayer';
import { copy } from 'components/Shared/functions';
import { headers } from '../../../cypressUtils/cypressHeaders';
/* ---------------------------------- Data ---------------------------------- */
let selectedShape = {
  id: '65eeef41f1e14c0724bee441',
};

const getLayerPayload = {
  operationName: 'getCustomLayer',
  variables: { id: selectedShape.id },
  query: CUSTOMLAYER.loc.source.body,
};
/* ---------------------------------- Data ---------------------------------- */

Cypress.Commands.add('setMapData', ({ testId, value }) => {
  cy.get(`[data-testid="data-cell-${testId}"]`, {
    timeout: basic_timeouts.midTimeout,
  }).trigger('mouseover', { force: true });

  cy.interceptAndWait(['getESSimpleFilter'], () => {
    cy.wait(basic_timeouts.shorTimeout);
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
  it(`Restores Unit ${selectedShape.id}`, () => {
    const updateLayerPayload = {
      operationName: 'updateCustomLayer',
      variables: {
        customLayerId: selectedShape.id,
        customLayer: { IsDeleted: false },
      },
      query: UPDATECUSTOMLAYER.loc.source.body,
    };

    cy.request({
      method: 'POST',
      url: ldata.url,
      headers: headers,
      body: getLayerPayload,
    }).then((response) => {
      if (!response?.body?.data?.customLayer)
        cy.request({
          method: 'POST',
          url: ldata.url,
          headers: headers,
          body: updateLayerPayload,
        }).then((response) => {
          expect(response.status).to.eq(200);
        });
      else expect(response.status).to.eq(200);
    });
  });
});

describe('ShapeDetailCard Component', () => {
  beforeEach(() => {
    cy.request({
      method: 'POST',
      url: ldata.url,
      headers: headers,
      body: getLayerPayload,
    }).then((response) => {
      selectedShape = response?.body?.data?.customLayer;
      let jsonLayer;
      if (selectedShape.shapeJson) jsonLayer = copy(selectedShape.shapeJson);

      jsonLayer.layer = { id: selectedShape.layer };
      jsonLayer.id = selectedShape._id;

      selectedShape = {
        ...jsonLayer.properties,
        feature: jsonLayer,
        id: selectedShape._id,
      };

      cy.interceptAndWait(['getCustomLayer'], (alias) => {
        popupController.updateState({ selectedShape });
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
          { spec: 'ShapeDetailCard', testCase: { layerId: selectedShape.id } }
        );
      });
    });
  });

  /**
   * Test case for verifying the functionality of recalculating shape owner values.
   * It simulates user interactions to update shape owner values, recalculate, and verify the result.
   */
  it('Shape Owner Recalculate Works', () => {
    // Intercepting API calls for fetching shape owner data and waiting for completion
    cy.interceptAndWait(['getESSimpleSearch', 'shapeowners_flat'], () => {
      // Clicking on the 'Interest Owners' tab
      cy.get('[data-testid="shape-detail-tab-Interest Owners"]').click();
    });

    // Selecting a row in the table and updating NRA and target offer price
    cy.get('tbody > tr').contains('1', { timeout: 5000 }).click({ force: true });
    cy.get('[data-testid="nra-field"] input').clear().type(100);
    cy.get('[data-testid="target-offer-price-field"] input').clear().type(100);

    // Intercepting API call for updating shape owners and waiting for completion
    cy.interceptAndWait(['updateShapeOwners'], () => {
      // Clicking on the action button to update shape owners
      cy.get('[data-testid="action-button"]').click();
    });

    // Waiting for a period of time for the update to propagate
    cy.wait(10000);

    // Clicking on the 'Select All Button' button for recalculation
    cy.get('[aria-label="Toggle select all"]').eq(0).click();

    cy.interceptAndWait(['getESSimpleSearch', 'shapeowners_flat'], () => {
      // Clicking on the 'Recalculate' button
      cy.get('[data-testid="recalculate"]').click();
    });

    // Intercepting API call for resetting calculated values of shape owners and waiting for completion
    cy.interceptAndWait(['resetOwnersCalculatedValues'], () => {
      // Clicking on the action button to reset calculated values
      cy.get('[data-testid="action-button"]').click();
    });

    // Waiting for a period of time for the reset to propagate
    cy.wait(10000);

    // Verifying that the overridden class is removed from target offer price and NRA fields
    cy.get('tbody > tr').contains('1').click({ force: true });

    cy.get('[data-testid="target-offer-price-field"]').should('not.have.class', 'overridden');
    cy.get('[data-testid="nra-field"]').should('not.have.class', 'overridden');
  });

  it('IF TX ( State=CO,County=Denver ) ELSE ( State=TX,County=Austin )', retries.fiveTries, () => {
    const state = selectedShape.state;
    if (state === 'TX') {
      cy.setMapData({ testId: 'State', value: 'CO' });
      cy.setMapData({ testId: 'County', value: 'Denver' });
    } else {
      cy.setMapData({ testId: 'State', value: 'TX' });
      cy.setMapData({ testId: 'County', value: 'Austin' });
    }
  });

  it(
    'IF TX ( Survey=ABBOTT, L, Block=37 T1N ) ELSE ( Township=035S,Range=055W )',
    retries.fiveTries,
    () => {
      const state = selectedShape.state;
      if (state === 'TX') {
        cy.setMapData({ testId: 'Survey', value: 'ABBOTT, L' });
        cy.setMapData({ testId: 'Block', value: '37 T1N' });
      } else {
        cy.setMapData({ testId: 'Township', value: '035S' });
        cy.setMapData({ testId: 'Range', value: '055W' });
      }
    }
  );

  it('IF TX ( Section=47 ) ELSE ( Section=43 )', retries.fiveTries, () => {
    const state = selectedShape.state;
    if (state === 'TX') {
      cy.setMapData({ testId: 'Section', value: '47' });
    } else {
      cy.setMapData({ testId: 'Section', value: '43' });
    }
  });

  it(
    'IF TX ( Description=Austin, TX - BLK 37 T1N, SEC 47 ) ELSE ( Description=Denver, CO - T035S R055W — Section 43 )',
    retries.fiveTries,
    () => {
      const state = selectedShape.state;
      if (state === 'TX') {
        cy.get('.description').should('contain', 'Austin, TX - BLK 37 T1N, SEC 47');
      } else {
        cy.get('.description').should('contain', 'Denver, CO - T035S R055W — Section 43');
      }
    }
  );
});
