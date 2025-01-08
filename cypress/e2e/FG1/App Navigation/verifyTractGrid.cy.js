/* eslint-disable no-undef */
import { basic_timeouts } from '../../../cypressUtils/data';

describe('Verify Tract Grid Spec', () => {
	it('passes', () => {
		const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts;

		cy.viewport(1536, 960);
		cy.visit('http://localhost:3000/land/units');

		cy.checkAndLogin();

		cy.get('#UnitsTable', { timeout: longTimeout }).should('be.visible');

		cy.log('==== STEP: CLICK ON TRACT FROM SIDEBAR AND VERIFY TRACT GRID  ====');
		cy.interceptApi('getDbData');
		cy.get("[id='Tracts 101']").click();

		cy.get('#TractTable', { timeout: longTimeout }).should('be.visible');
		cy.verifyApiResponse('@getESSimpleSearchApi');
		cy.wait(10000);
	});
});
