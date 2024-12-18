/* eslint-disable no-undef */

const { basic_timeouts } = require('../../cypressUtils/data');

describe('Aquisition Cost Verification Spec', () => {
	it('passes', () => {
		// Constants
		const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts;

		cy.viewport(1536, 960);

		cy.interceptApi('getESSimpleSearch');
		cy.visit('http://localhost:3000/land/agreements');

		cy.checkAndLogin();

		cy.get('#addButton', { timeout: longTimeout }).should('be.visible');

		cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout }).then(response => {
			const totalAcquisitionCost = 131.35;
			const tractName = 'FRASER, BURR & OLYPHANT A-1393';

			cy.interceptApiByIndex('getESSimpleSearch', 'shapeowners_flat');
			cy.getTableCell('Agreement', 3).then($row => {
				cy.log('==== STEP: OPEN Agreement ====');
				cy.wrap($row).scrollIntoView().children().eq(1).children().children().children().click();

				cy.get('.MuiTypography-root', { timeout: longTimeout }).contains('Summary').should('be.visible');

				cy.log(`==== STEP: DELTE TRACT : ${tractName} IF ALREADY EXISTED ====`);
				cy.verifyApiResponse('@getESSimpleSearchApiByIndex', { responseTimeout: longTimeout }).then(response => {
					cy.get('#legalDescriptionTab').click();

					const hits = response.response.body.data.getESSimpleSearch.hits;
					if (hits.some(hit => hit.tractName === tractName)) {
						cy.log('==== STEP: CLICK ON LEGAL DESCRIPTION TAB ====');
						cy.wait(5000);
						cy.get('#legalDescriptionTab').click();

						cy.deleteTractAndVerify(tractName);
					}
				});

				cy.interceptApi('updateCustomLayer');
				cy.log('==== STEP: ADD AGREEMENT ACQUISITION COST ====');
				cy.get('#field-totalAcquisitionCost', { timeout: longTimeout })
					.scrollIntoView()
					.clear()
					.wait(1000)
					.type(totalAcquisitionCost)
					.wait(1000);

				cy.get('.MuiGrid-root').contains('Total Acquisition Cost').click();

				cy.verifyApiResponse('@updateCustomLayerApi', { responseTimeout: longTimeout });

				cy.log('==== STEP: VERIFY ACQUISITION COST IS ADDED SUCCESSFULLY ====');
				cy.get('#field-totalAcquisitionCost').scrollIntoView().should('have.value', totalAcquisitionCost);

				cy.log('==== STEP: CLICK ON LEGAL DESCRIPTION TAB ====');
				cy.wait(10000);
				cy.get('#legalDescriptionTab').click();

				cy.interceptApiByIndex('getESSimpleSearch', 'shapeowners_flat');
				cy.addTract(tractName);

				cy.log('==== STEP: VERIFY ACQUISITION COST IS STILL SAME ====');
				cy.get('#field-totalAcquisitionCost').scrollIntoView().should('have.value', totalAcquisitionCost);
			});
		});
	});
});
