/* eslint-disable no-undef */
import MapProvider from 'components/Map/MapProvider'; // Importing the MapProvider component for testing
import NavigationProvider from 'components/Navigation/NavigationProvider';
import { basic_timeouts } from '../../cypressUtils/data'; // Importing basic timeouts from the data file for test waits

// Test suite for the Map Component
describe('Map Component', () => {
	it('User Layer Settings are updated', () => {
		// Update User Layer Settings to only show Land Grids
		cy.updateAllUserLayersVisibility({ layersToShow: ['Land Grid'] });
	});

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
			cy.get('#dataNameSelect').click();
			cy.wait(100);
			cy.get('[data-test="sentinelStart"] + div ul li:nth-child(1)').click({ force: true });

			// Close the dropdown by clicking outside of it
			cy.get('body').click(0, 0);

			// Typing into the search input field
			cy.get('#cognitive-search-autocomplete').clear().type('MACALLAN #2-17');
		});

		// Clicking on the first option in the search autocomplete dropdown
		cy.get('#cognitive-search-autocomplete-option-1').click();

		// Clicking on the toggle button for the search layer
		cy.get('[data-testid="layer-Search"]').click({ force: true });

		// Clicking on the map canvas at specified coordinates
		cy.get('.mapboxgl-canvas').first().click(880, 600);

		// Verifying that the searched item is present in the map card header
		cy.get('.MuiCardHeader-content .MuiCardHeader-title', {
			timeout: basic_timeouts.longTimeout,
		}).should('contain', 'MACALLAN #2-17');
	});
});
