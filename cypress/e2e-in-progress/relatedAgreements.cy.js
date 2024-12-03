/* eslint-disable no-undef */

const { basic_timeouts } = require('../cypressUtils/data');

describe('Related Agreements Spec', () => {
	it('passes', () => {
		// Constants
		const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts;

		cy.viewport(1536, 960);

		cy.interceptApi('getESSimpleSearch');
		cy.visit('http://localhost:3000/land/agreements');

		cy.checkAndLogin();

		cy.get('#addButton', { timeout: longTimeout }).should('be.visible');

		cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout }).then(response => {
			const tractName = 'FRASER, BURR & OLYPHANT A-1393';

			cy.getTableCell('Agreement', 3).then($row => {
				cy.log('==== STEP: OPEN AGREEMENT ====');
				cy.wrap($row).scrollIntoView().children().eq(1).children().children().children().click();

				cy.get('.MuiTypography-root', { timeout: longTimeout }).contains('Summary').should('be.visible');

				cy.log('==== STEP: CLICK ON RELATED AGREEMENTS TAB ====');
				cy.wait(10000);
				cy.get('#relatedAgreementsTab').click();

				cy.log('==== STEP: CLICK ON ADD RELATED AGREEMENT BUTTON ====');
				cy.get('#addRelatedAgreementBtn', { timeout: longTimeout }).scrollIntoView().click({ force: true });

				cy.wait(2000);

				cy.log('==== STEP: SELECT AGREEEMNT TO ADD ====');
				cy.interceptApi('getESFilterList');
				cy.get("[id='filter-autocomplete-es-field']").type('lease');
				cy.verifyApiResponse('@getESFilterListApi', { responseTimeout: longTimeout });

				cy.interceptApi('getCustomLayer');
				cy.get('body').type('{enter}');
				cy.verifyApiResponse('@getCustomLayerApi', { responseTimeout: longTimeout });

				cy.interceptApiByIndex('getESSimpleSearch', 'shapes_flat');
				cy.log('==== STEP: CLICK ON ADD BUTTON ====');
				cy.interceptApi('upsertRelatedAgreementDescriptor');
				cy.get('#addAgreementButton').click();
				cy.verifyApiResponse('@upsertRelatedAgreementDescriptorApi', { responseTimeout: longTimeout }).then(
					response => {
						const relatedAgreementID =
							response.response.body.data.upsertRelatedAgreementDescriptor.descriptor.relatedObject;

						cy.log('==== STEP: VERIFY IF AGREEENT WAS ADDED  ====');
						cy.verifyApiResponse('@getESSimpleSearchApiByIndex', { responseTimeout: longTimeout }).then(response => {
							const hits = response.response.body.data.getESSimpleSearch.hits;

							const indexOfRelatedAgreement = hits.findIndex(hit => hit?._id === relatedAgreementID);

							if (indexOfRelatedAgreement < 0) throw new Error('Related Agreement not found');

							cy.log('==== STEP: CLICK ON CHECKBOX OF AGREEMENT ====');
							cy.get("[id='related-agrmt-div']")
								.get(`[id=MUIDataTableSelectCell-${indexOfRelatedAgreement}]`)
								.scrollIntoView()
								.check();

							cy.interceptApiByIndex('getESSimpleSearch', 'shapes_flat');

							cy.log('==== STEP: DELETE RELATED AGREEMENT====');
							cy.interceptApi('deleteRelatedAgreements');
							cy.get('#deleteAgreementIcon', { timeout: longTimeout }).click();
							cy.get('#deleteButton', { timeout: longTimeout }).click();
							cy.verifyApiResponse('@deleteRelatedAgreementsApi', { responseTimeout: longTimeout });

							cy.log('==== STEP: VERIFY IF RELATED AGREEMENT WAS DELETED ====');
							cy.verifyApiResponse('@getESSimpleSearchApiByIndex', { responseTimeout: longTimeout }).then(response => {
								const hits = response.response.body.data.getESSimpleSearch.hits;

								if (hits && hits.length && hits.some(hit => hit?._id === relatedAgreementID))
									throw new Error('Related Agreement still exist after delete');
							});
							cy.wait(5000);
						});
					}
				);
			});
		});
	});
});
