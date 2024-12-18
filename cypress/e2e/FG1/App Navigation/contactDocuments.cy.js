/* eslint-disable no-undef */

import { basic_timeouts } from '../../../cypressUtils/data';

describe('Sort Filter ViewColumn Grid Spec', () => {
	it('passes', () => {
		// Constants
		const { shorTimeout, longTimeout } = basic_timeouts;

		cy.viewport(1400, 900);
		cy.visit('http://localhost:3000/contacts');

		cy.checkAndLogin();

		cy.location('pathname', { timeout: longTimeout }).should('include', '/contacts');
		cy.get('#addButton', { timeout: longTimeout }).should('be.visible');
		cy.get('p.contactDetailsLink')
			.first()
			.within(() => {
				cy.get('a').click();
			});

		cy.log('==== STEP: CLICK ON VIEW ALL DOCUMENTS ====');
		cy.get('#viewAllDocuments', { timeout: longTimeout }).should('be.visible').click();

		cy.log('==== STEP: CHECKING IF DOCUMENTS LIST APPEARS ====');
		cy.get('#contactDocumentsList', { timeout: longTimeout }).should('be.visible');
	});
});
