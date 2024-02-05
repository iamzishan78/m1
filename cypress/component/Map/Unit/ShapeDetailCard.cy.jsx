/* eslint-disable no-undef */

import ExpandableCardProvider from 'components/ExpandableCard/ExpandableCardProvider';
import ShapeDetailCard from 'components/ShapeDetailCard';
import { popupController } from 'hookstate/popupStateController';
import { basic_timeouts } from '../../../cypressUtils/data';
import ldata from '../../../fixtures/ldata.json';
import { CUSTOMLAYER } from 'graphQL/useQueryCustomLayer';
import { UPDATECUSTOMLAYER } from 'graphQL/useMutationUpdateCustomLayer';
import { copy } from 'components/Shared/functions';
/* ---------------------------------- Data ---------------------------------- */
let selectedShape = {
  id: '65b0c87166115215f9155bc4',
};

const getLayerPayload = {
  operationName: 'getCustomLayer',
  variables: { id: selectedShape.id },
  query: CUSTOMLAYER.loc.source.body,
};

const headers = {
  'Content-Type': 'application/json',
  'X-ZUMO-AUTH': ldata.x_zumo_auth,
};
/* ---------------------------------- Data ---------------------------------- */

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
    }).then(response => {
      if (!response?.body?.data?.customLayer)
        cy.request({
          method: 'POST',
          url: ldata.url,
          headers: headers,
          body: updateLayerPayload,
        }).then(response => {
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
    }).then(response => {
      selectedShape = response?.body?.data?.customLayer;
      let jsonLayer
      if (selectedShape.shapeJson) jsonLayer = copy(selectedShape.shapeJson);

      jsonLayer.layer = { id: selectedShape.layer };
      jsonLayer.id = selectedShape._id;

      selectedShape = {
        ...jsonLayer.properties,
        feature: jsonLayer,
        id: selectedShape._id,
      }

      cy.interceptAndWait(['getCustomLayer'], alias => {
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
          { spec: 'ShapeDetailCard' }
        );
      });
    });

  });

  it('IF TX ( State=CO,County=Andrews,Township=004S,Range=066W,Section=36 ) ELSE ( State=TX,County=Anderson,Survey=ABBOTT, L,Section=37 T1N,Section=47 )', () => {

    const state = selectedShape.state;
    if (state === 'TX') {
      cy.setMapData({ testId: 'State', value: 'CO' });
      cy.setMapData({ testId: 'County', value: 'Denver' });
      cy.setMapData({ testId: 'Meridian', value: '06' });
      cy.setMapData({ testId: 'Township', value: '035S' });
      cy.setMapData({ testId: 'Range', value: '055W' });
      cy.setMapData({ testId: 'Section', value: '43' });
    } else {
      cy.setMapData({ testId: 'State', value: 'TX' });
      cy.setMapData({ testId: 'County', value: 'Austin' });
      cy.setMapData({ testId: 'Survey', value: 'ABBOTT, L' });
      cy.setMapData({ testId: 'Block', value: '37 T1N' });
      cy.setMapData({ testId: 'Section', value: '47' });
    }

  });

  it('IF TX ( Austin, TX - BLK 37 T1N, SEC 47 ) ELSE ( State=TX,County=Anderson,Survey=ABBOTT, L,Section=37 T1N,Section=47 )', () => {
    const state = selectedShape.state;
    if (state === 'TX') {
      cy.get('.description').should('contain', 'Austin, TX - BLK 37 T1N, SEC 47')
    } else {
      cy.get('.description').should('contain', 'Denver, CO - T035S R055W — Section 43')
    }
  });
});
