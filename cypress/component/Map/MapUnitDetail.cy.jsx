/* eslint-disable no-undef */
import MapProvider from 'components/Map/MapProvider'; // Importing the MapProvider component for testing
import { basic_timeouts } from '../../cypressUtils/data'; // Importing basic timeouts from the data file for test waits

// Test suite for the Map Unit Detail Component
describe('Map Unit Detail Component', () => {
  beforeEach(() => {
    // Setting up the Cypress viewport and mounting the MapProvider component with specific parameters
    cy.viewport(1800, 1200).mount(
      <MapProvider
        match={{ params: { paramId: '65b0c87166115215f9155bc4', type: 'units' } }}
      />
    );

    // Waiting for the specified midTimeout duration before each test
    cy.wait(basic_timeouts.midTimeout);
  });

  // Test case: Well card opens from unit well table link
  it('Well card opens from unit well table link', () => {
    // Clicking on the Wells tab to view well details
    cy.get(`[data-testid="shape-detail-tab-Wells"]`, {
      timeout: basic_timeouts.midTimeout,
    }).click({ force: true });

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
});
