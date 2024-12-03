/* eslint-disable no-undef */

import { basic_timeouts } from '../../cypressUtils/data';

// this test case was in response to a bug ali fixed on campaign units
// the goal is to search for a campaign and determine if the units totals are correct

describe('Campaign Unit Grid Spec', () => {
	it('passes', () => {
		// Constants
		const { longTimeout } = basic_timeouts;

		cy.viewport(1400, 900);
		cy.visit('http://localhost:3000/contacts/campaigns');

		cy.checkAndLogin();

		cy.get('#addCampaignButton', { timeout: longTimeout }).should('be.visible');
		cy.wait(3000);

		cy.log('==== STEP: CLICK ON UNIT BY NAME ====');
		const unitName = 'GEP - Tate Locklear'; //GEP - Tate Locklear
		cy.gridSearch(unitName, 'getESSimpleSearch');
		cy.get('.MuiTableCell-root.MuiTableCell-body', { timeout: longTimeout })
			.contains(unitName, { timeout: longTimeout })
			.should('be.visible')
			.click({ force: true });

		cy.interceptApi('getESSimpleSearch');
		cy.log('==== STEP: CLICK ON UNITS ====');
		cy.get('#Units', { timeout: longTimeout }).click();
		cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout }).then(response => {
			const totalUnits = response.response.body.data.getESSimpleSearch.total;

			cy.get('#unitCounts')
				.invoke('text')
				.then(unitCount => {
					cy.log('==== STEP: MATCHING UNITS COUNT ====');
					if (parseInt(unitCount) !== totalUnits) throw new Error(`Total Unit Count is not showing correctly`);
				});
		});
		cy.wait(1000);
	});
});
