/* eslint-disable no-undef */

import { basic_timeouts } from '../cypressUtils/data';

describe('Agreement Detail Tract Verify Spec', () => {
	it('passes', () => {
		const { longTimeout } = basic_timeouts;

		const searchStrings = 'YANAS MILTON SR';

		cy.viewport(1400, 900);
		cy.visit('http://localhost:3000');

		cy.checkAndLogin('#workSpaceSignin');

		cy.log(`==== STEP:Search AGREEMENT BY NAME ${searchStrings} ====`);
		cy.interceptApi('getCustomLayer');
		cy.searchOnMap('Agreements', searchStrings);
		cy.verifyApiResponse('@getCustomLayerApi', { responseTimeout: longTimeout });

		cy.log(`==== STEP:CLICK ON TRACT TAB ====`);
		cy.get('#unitWells2', { timeout: longTimeout }).click();

		cy.log(`==== STEP:CLICK ON TRACT TAB ====`);
		cy.getTableCell('Tract Name', 1).then($tableCell => {
			cy.wrap($tableCell).scrollIntoView().click();
			cy.wait(5000);
			cy.get('#unitWells2', { timeout: longTimeout }).should('be.visible');
		});
	});
});
