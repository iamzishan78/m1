/* eslint-disable no-undef */

import { basic_timeouts } from '../../../cypressUtils/data';

describe('Agreement Provisions Spec', () => {
	it('passes', () => {
		// Constants
		const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts;

		cy.viewport(1536, 960);

		cy.interceptApi('getESSimpleSearch');
		cy.visit('http://localhost:3000/land/agreements');

		cy.checkAndLogin();

		cy.get('#addButton', { timeout: longTimeout }).should('be.visible');

		cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout });

		cy.getTableCell('Agreement', 6).then($agreementCell6 => {
			const agreementName = $agreementCell6.text();

			cy.getTableCell('Agreement', 3).then($agreementCell3 => {
				cy.log('==== STEP: VERIFY FROZEN COLUMN ====');
				cy.wrap($agreementCell3).should('be.visible');

				cy.getTableCell('Status', 3).then($statusCell => {
					cy.wrap($statusCell).scrollIntoView();

					cy.get('.MuiTableCell-root').contains('Agreement').should('be.visible');
					cy.get('.MuiTableCell-root').contains(agreementName).should('be.visible');
				});
			});
		});
	});
});
