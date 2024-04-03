/* eslint-disable no-undef */
import MapProvider from 'components/Map/MapProvider'; // Importing the MapProvider component for testing
import NavigationProvider from 'components/Navigation/NavigationProvider';
import { basic_timeouts } from '../../cypressUtils/data'; // Importing basic timeouts from the data file for test waits

// Test suite for the Map Component
describe('Map Component', () => {
  // Test case: Checks that search layer click works
  it('Checks that search layer click works', () => {
    // Intercepting API calls and waiting for their responses
    cy.interceptAndWait(['getAllLayerSettingsByUser'], () => {
      // Setting up the viewport and mounting necessary components for testing
      cy.viewport(1800, 1200).mount(
        <NavigationProvider isMap={true}>
          <MapProvider match={{ params: {} }} />
        </NavigationProvider>
      );
    });

    // Intercepting API calls and waiting for their responses
    cy.interceptAndWait(['getESSimpleSearch'], () => {
      // Typing into the search input field
      cy.get('#cognitive-search-autocomplete').type('MACALLAN #2-17');
    });

    // Clicking on the first option in the search autocomplete dropdown
    cy.get('#cognitive-search-autocomplete-option-1').click();

    // Clicking on the close icon
    cy.get('svg#closeIcon', { timeout: basic_timeouts.longTimeout }).click({
      force: true,
    });

    // Clicking on the toggle button for the search layer
    cy.get('[data-testid="layer-Search-toggle"]').click({ force: true });

    // Clicking on the map canvas at specified coordinates
    cy.get('.mapboxgl-canvas').first().click(880, 600);

    // Verifying that the searched item is present in the map card header
    cy.get('.MuiCardHeader-content .MuiCardHeader-title', {
      timeout: basic_timeouts.longTimeout,
    }).should('contain', 'MACALLAN #2-17');
  });
});
