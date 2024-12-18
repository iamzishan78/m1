/* eslint-disable no-undef */

const { basic_timeouts } = require('../../../cypressUtils/data');

describe('Document Grid Spec', () => {
	it('passes', () => {
		const { shorTimeout, longTimeout } = basic_timeouts;

		cy.viewport(1400, 900);

		cy.interceptApi('getESDocuments');
		cy.visit('http://localhost:3000/documents');

		cy.checkAndLogin();

		cy.get('#addDocument', { timeout: longTimeout }).should('be.visible');
		cy.verifyApiResponse('@getESDocumentsApi', { responseTimeout: longTimeout });

		cy.log('==== STEP: CLICK ON VIEW COLUMN ICON ====');
		cy.get('#viewColumnIcon').click();
		cy.wait(1000);

		cy.log('==== STEP: CLICK ON INTERNAL COMPANY COLUMN CHECKBOX ====');
		cy.get('#internal_company').scrollIntoView().check();

		cy.log('==== STEP: CLICK ON STATE VIEW COLUMN CHECKBOX ====');
		cy.get('#state').scrollIntoView().check();

		cy.get('body').type('{esc}');

		cy.scrollGridTo('right', '#Documents');

		cy.log('==== STEP: UPDATE INTERNAL COMPANY ====');
		cy.interceptApi('updateDocument');
		cy.getTableCell('Internal Company', 1).then($internalCompany => {
			cy.scrollGridTo('right', '#Documents');
			cy.wait(10000);
			cy.wrap($internalCompany).get("[id='Internal Company']").eq(1).click();
			cy.scrollGridTo('right', '#Documents');
			cy.wrap($internalCompany).get('#searchForValue').type('924{enter}{esc}{esc}');
			cy.verifyApiResponse('@updateDocumentApi', { responseTimeout: longTimeout });
		});

		cy.log('==== STEP: UPDATE STATE ====');
		cy.interceptApi('updateDocument');
		cy.getTableCell('State', 2).then($state => {
			cy.scrollGridTo('right', '#Documents');
			cy.wrap($state).get('#State').click();
			cy.scrollGridTo('right', '#Documents');
			cy.wait(10000);
			cy.get('#waypoint-1 input[type="checkbox"]').click();
			cy.scrollGridTo('right', '#Documents');
			cy.wrap($state).click();
			cy.verifyApiResponse('@updateDocumentApi', { responseTimeout: shorTimeout });
		});
	});
});
