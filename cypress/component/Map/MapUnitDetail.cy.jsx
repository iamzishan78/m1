/* eslint-disable no-undef */
import MapProvider from 'components/Map/MapProvider'; // Importing the MapProvider component for testing
import { basic_timeouts } from '../../cypressUtils/data'; // Importing basic timeouts from the data file for test waits

// Test suite for the Map Unit Detail Component
describe('Map Unit Detail Component', () => {
  beforeEach(() => {
    // Setting up the Cypress viewport and mounting the MapProvider component with specific parameters
    cy.interceptAndWait(['getCustomLayer'], () => {
      cy.viewport(1800, 1200).mount(
        <MapProvider
          match={{
            params: { paramId: '667d6d179661ee87114c841c', type: 'units' },
          }}
        />
      );
    });
  });

  it('Add well to unit works', () => {
    // Clicking on the Wells tab to view well details
    cy.get(`[data-testid="shape-detail-tab-Wells"]`, {
      timeout: basic_timeouts.midTimeout,
    }).click({ force: true });

    cy.interceptAndWait(['getWellInterestsSelectOptions'], () => {
      cy.get('#addRelatedWellBtn').click();
    });

    cy.get('#selectWell').click();

    cy.get('.MuiAutocomplete-option').first().click({ force: true });
    cy.wait(10000);

    cy.interceptAndWait(
      ['AddShapeWellInterest'],
      (alias) => {
        cy.get('#saveWellButton').click();
        cy.wait(alias, { timeout: 400000 }).then((res) => {
          expect(res.response.body.data.addShapeWellInterest.success).to.be.equal(true);

          const lease = res.request.body.variables.wellInterest.lease;
          // If lease is passed from frontend then we will check that in grid
          if (lease) {
            cy.get('tr').contains(lease);
          }
        });
      },
      { wait: false }
    );
  });
  // Test case: Well card opens from unit well table link
  it('Well card opens from unit well table link', () => {
    cy.wait(15000);
    // Clicking on the Wells tab to view well details
    cy.interceptAndWait(['getESPaginatedList'], () => {
      cy.get(`[data-testid="shape-detail-tab-Wells"]`, {
        timeout: basic_timeouts.midTimeout,
      }).click({ force: true });
    });

    // Intercepting and waiting for the getTenantWell request, then clicking on the first well link in the table
    cy.interceptAndWait(['getTenantWell'], () => {
      cy.get(`[data-testid='column-with-link']`, {
        timeout: basic_timeouts.midTimeout,
      })
        .eq(0)
        .click({ force: true });
    });

    // Asserting that the well card exists after clicking on the well link
    cy.get(`[data-testid="well-card"]`, {
      timeout: basic_timeouts.midTimeout,
    }).should('exist');
  });

  it('should update field and check cutom field did not remove', () => {
    cy.wait(25000);
    cy.get('[data-testid="data-cell-cypress test field (do not delete)"]', {
      timeout: basic_timeouts.longTimeout,
    }).click();

    cy.get('.MuiButtonBase-root[data-testid="edit-cypress test field (do not delete)"]').click();

    cy.get('.MuiTextField-root[data-testid="data-field-cypress test field (do not delete)"] input')
      .click()
      .type('{selectall}')
      .clear()
      .type('1234')
      .type('{enter}');

    cy.get('[data-testid="data-cell-cypress test field (do not delete)"]').should(
      'exist',
      'The data cell is present in the UI.'
    );
  });
});
