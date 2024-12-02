/* eslint-disable no-undef */

import { basic_timeouts } from '../cypressUtils/data';

describe('Related Document Frozen Column Spec', () => {
	it('passes', () => {
		// Constants
		const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts;

		cy.viewport(1536, 960);

		cy.interceptApi('getESSimpleSearch');
		cy.visit('http://localhost:3000/land/agreements');

		cy.checkAndLogin();

		cy.get('#addButton', { timeout: longTimeout }).should('be.visible');

		cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout }).then(response => {
			cy.getTableCell('Agreement', 1).then($row => {
				cy.log('==== STEP: OPEN Agreement ====');
				cy.interceptApiByIndex('getESSimpleSearch', 'documents_flat');
				cy.wrap($row).scrollIntoView().children().eq(1).children().children().children().click();

				cy.get('.MuiTypography-root', { timeout: longTimeout }).contains('Summary').should('be.visible');

				cy.log('==== STEP: CLICK ON DOCUMENTS TAB ====');
				cy.wait(10000);
				cy.get('#documentsTab').click();
				cy.get('#addRelatedDcmnButton').scrollIntoView();

				cy.log('==== STEP: ADD DOCUMENT IF NONE ====');
				cy.verifyApiResponse('@getESSimpleSearchApiByIndex', { responseTimeout: longTimeout }).then(
					relatedDocumentsResponse => {
						let hits = relatedDocumentsResponse.response.body.data.getESSimpleSearch.hits;
						let documentName = 'sample.pdf';
						if (hits && hits.length < 1) {
							cy.log('==== STEP: ADDING DOCUMENT ====');
							cy.get('#addRelatedDcmnButton', { timeout: longTimeout }).scrollIntoView().click();

							cy.get('#existingDocumentTab', { timeout: longTimeout }).click();

							cy.interceptApi('viewFiles');
							cy.interceptApi('AddDescriptorFile');
							cy.get('#searchDocumentList').type(documentName);
							cy.wait(5000);
							cy.get('body').type('{downArrow}{enter}');
							cy.get('#saveDocumentButton', { timeout: longTimeout }).click();
							cy.verifyApiResponse('@viewFilesApi', { responseTimeout: longTimeout });
							cy.verifyApiResponse('@AddDescriptorFileApi', { responseTimeout: longTimeout });
						} else documentName = hits[0].name;

						cy.log('==== STEP: GET TABLE CELL FILE NAME ====');
						cy.get('#addRelatedDcmnButton').scrollIntoView();
						cy.get('#relatedDocumentsTable').get('.MuiButton-label').contains('Page').scrollIntoView();

						cy.get('.MuiButton-label').contains('File Name').should('be.visible');
						cy.get('.MuiTypography-root').contains(documentName).should('be.visible');
					}
				);
			});
		});
	});
});
