/* eslint-disable no-undef */

import { basic_timeouts } from '../../cypressUtils/data';

/*  ADD AND REMOVE TAGS FORM CONTACTS
launch contacts 
click contacts tag module 
add test tag 
launch detail contact card 
remove test tag
breadcrumb back
launch new contact detail
add test tag
breadcrumb back
launch tagger on grid 
remove tag */

describe('Add and Remove Tags Grid Spec', () => {
	it('passes', () => {
		// Constants
		const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts;

		cy.viewport(1400, 900);

		cy.interceptApi('getESSimpleSearch');
		cy.visit('http://localhost:3000/contacts');

		cy.checkAndLogin();

		cy.get('#addButton', { timeout: longTimeout }).should('be.visible');

		cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout }).then(response => {
			const firstHit = response.response.body.data.getESSimpleSearch.hits[0];

			let contactName = firstHit.name;

			cy.getTableCell('Tags', 1).then($tagger => {
				let tagName = 'Test Tag1';

				cy.log('==== STEP: SCROLL TO TOP RIGHT ====');
				cy.scrollGridTo('topRight', '#Contacts');

				cy.log('==== STEP: OPEN TAGGER ====');
				cy.wrap($tagger).click();

				cy.log('==== STEP: SELECT AND ENTER TAG ====');
				cy.get('#tags-outlined', { timeout: longTimeout }).click().wait(1000).type(tagName).type('{downArrow}{enter}');
				cy.wait(3000);

				cy.log('==== STEP: VERIFY ADDED TAG 1 ====');
				cy.get('.MuiChip-label', { timeout: longTimeout })
					.contains(tagName, { timeout: longTimeout })
					.should('be.visible');
				cy.wait(3000);
				cy.get('body').type('{esc}{esc}');

				cy.log('==== STEP: OPEN CONTACT DETAIL ====');
				cy.get('.MuiTableCell-root.MuiTableCell-body', { timeout: longTimeout }).contains(contactName).click();
				// cy.getTableCell('Name', 2).click()

				cy.log('==== STEP: REMOVE TAG 1 ====');
				cy.get('.MuiGrid-root', { timeout: longTimeout }).contains('Total Offer Price').should('be.visible');
				cy.wait(3000);
				cy.get('.MuiChip-label', { timeout: longTimeout }).contains(tagName).siblings().click();

				cy.interceptApi('getESSimpleSearch');
				cy.log('==== STEP: CLICK ON A BREADCRUM ====');
				cy.get('.MuiTypography-root').contains('Contacts').click();
				cy.get('#addButton', { timeout: longTimeout }).should('be.visible');
				tagName = 'Test Tag2';

				cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout }).then(response => {
					const thirdHit = response.response.body.data.getESSimpleSearch.hits[2];
					contactName = thirdHit.name;

					cy.wait(3000);
					cy.log('==== STEP: OPEN ANOTHER CONTACT DETAIL ====');
					cy.get('.MuiTableCell-root.MuiTableCell-body', { timeout: longTimeout })
						.contains(contactName, { timeout: longTimeout })
						.click();

					cy.log('==== STEP: SELECT AND ENTER TAG ====');
					cy.get('#tags-outlined', { timeout: longTimeout })
						.click()
						.wait(2000)
						.type(tagName)
						.type('{downArrow}{enter}');

					cy.log('==== STEP: VERIFY ADDED TAG 2====');
					cy.wait(5000);
					cy.get('.MuiChip-label', { timeout: longTimeout }).contains(tagName).should('be.visible');

					cy.interceptApi('getESSimpleSearch');
					cy.log('==== STEP: CLICK ON A BREADCRUM ====');
					cy.get('.MuiTypography-root').contains('Contacts').click();
					cy.get('#addButton', { timeout: longTimeout }).should('be.visible');

					cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout });

					cy.log(`==== STEP: SEARCH FOR CONTACT : ${contactName} ====`);
					cy.gridSearch(contactName, 'getESSimpleSearch');

					cy.getTableCell('Tags', 1).then($tagger => {
						cy.log('==== STEP: SCROLL TO TOP RIGHT ====');
						cy.scrollGridTo('topRight', '#Contacts');

						cy.log('==== STEP: OPEN TAGGER ====');
						cy.wrap($tagger).click();

						cy.wait(3000);
						cy.log('==== STEP: REMOVE TAG 2 ====');
						cy.get('.MuiChip-label', { timeout: longTimeout }).contains(tagName).siblings().click();

						cy.get('body').type('{esc}{esc}');
					});
				});
			});
		});
	});
});
