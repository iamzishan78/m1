/* eslint-disable no-undef */

const { basic_timeouts } = require('../../cypressUtils/data');

describe('Agreement New Tracts Spec', () => {
	it('passes', () => {
		// Constants
		const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts;

		cy.viewport(1536, 960);

		cy.interceptApi('getDbData');
		cy.visit('http://localhost:3000/land/agreements');

		cy.checkAndLogin();

		cy.get('#addButton', { timeout: longTimeout }).should('be.visible');

		cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout }).then(response => {
			const tractName = 'FRASER, BURR & OLYPHANT A-1393';

			cy.getTableCell('Agreement', 5).then($row => {
				cy.log('==== STEP: OPEN Agreement ====');
				cy.wrap($row).scrollIntoView().children().eq(1).children().children().children().click();

				cy.get('.MuiTypography-root', { timeout: longTimeout }).contains('Summary').should('be.visible');

				cy.log('==== STEP: CLICK ON LEGAL DESCRIPTION TAB ====');
				cy.wait(10000);
				cy.get('#legalDescriptionTab').click();
				cy.wait(10000);
				cy.get('#addTractToAgreementBtn').scrollIntoView().click({ force: true });

				cy.get('#tractName', { timeout: longTimeout }).type('Cypress Tract');

				cy.typeAndSelect("[id='filter-autocomplete-State']", 'TX');

				cy.typeAndSelect("[id='filter-autocomplete-County']", 'LOVING');

				cy.get('#tractDescription', { timeout: longTimeout }).type('Cypress Description');

				cy.log('==== STEP: SELECT ENTITY NAME ====');
				cy.get('#AutocompEntityNamesList').scrollIntoView().click().type('mike jones');
				cy.get("[id='AutocompEntityNamesList-option-0']");
				cy.get('#AutocompEntityNamesList').click().type('{downArrow}{downArrow}{enter}');

				cy.interceptApiByIndex('getDbData', 'shapeowners_flat');

				cy.log('==== STEP: CLICK ON SAVE BUTTON ====');
				cy.interceptApi('addOwnerToAShape');
				cy.get('#saveButton').click();
				cy.verifyApiResponse('@addOwnerToAShapeApi', { responseTimeout: longTimeout });

				cy.deleteTractAndVerify('Cypress Tract');
			});
		});
	});
});
