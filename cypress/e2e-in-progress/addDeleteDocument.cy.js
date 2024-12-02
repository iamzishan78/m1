/* eslint-disable no-undef */

const { basic_timeouts, documentObj } = require('../cypressUtils/data');

describe('Add & Delete Document Spec', () => {
	it('passes', () => {
		const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts;

		cy.viewport(1400, 900);
		cy.visit('http://localhost:3000/documents');

		cy.checkAndLogin();

		cy.log('==== STEP: ADD DOCUMENT ====');
		cy.get('#addDocument', { timeout: longTimeout }).should('be.visible');

		cy.log('==== STEP: CLICK ON VIEW COLUMN ICON ====');
		cy.get('#viewColumnIcon').click();
		cy.wait(1000);

		cy.log('==== STEP: CLICK ON INTERNAL COMPANY COLUMN CHECKBOX ====');
		cy.get('#internal_company').scrollIntoView().check();

		cy.log('==== STEP: CLICK ON STATE VIEW COLUMN CHECKBOX ====');
		cy.get('#state').scrollIntoView().check();

		cy.get('body').type('{esc}');

		cy.get('#addDocument', { timeout: longTimeout }).should('be.visible').click();

		cy.log('==== STEP: ADD FILE NUMBER ====');
		cy.get('#filenumber', { timeout: extraTimeout })
			.type(documentObj.fileNumber, { timeout: extraTimeout })
			.should('be.visible');

		cy.log('==== STEP: ADD FILE NAME ====');
		cy.get('#filename').type(documentObj.fileName);

		cy.log('==== STEP: ADD FILE TYPE ====');
		cy.get('#filetype', { timeout: longTimeout }).type('L');
		cy.get('#filetype-popup').children('#filetype-option-1').click();

		cy.log('==== STEP: ADD FILE DATE  ====');
		cy.get('#filedate').type('2022-01-01');
		// cy.get('#documentdetails').scrollTo('bottom')

		cy.log('==== STEP: ADD COMPANY ID ====');
		cy.get("[id='Internal Company-field']").scrollIntoView().children(1).children(0).type('924{enter}');

		cy.log('==== STEP: ADD STATE ====');
		cy.get("[id='State-field']").children(1).children(0).click();
		cy.get('.react-select__menu-list').children().eq(1).click();
		cy.get('.react-select__menu-list').children().eq(2).click();

		cy.contains('State').click({ force: true });

		cy.log('==== STEP: ADD DOCUMENT ====');
		cy.addDocument(documentObj.fileAddress).then(response => {
			const documentId = response.response.body.data.addFileDescriptor.file.id;

			cy.log('==== STEP: DELETE DOCUMENT ====');
			cy.wait(2000);
			cy.detachDocument();

			cy.log('==== STEP: ADD DOCUMENT AGAIN ====');
			cy.addDocument(documentObj.fileAddress);

			cy.interceptApi('updateDocument');
			cy.interceptApi('getESDocuments');

			cy.wait(4000);
			cy.get('#documentSaveButton', { timeout: shorTimeout }).should('be.visible').trigger('click');

			cy.get('#documentSaveButton').then($button => {
				if ($button.is(':visible')) {
					$button.click();
				} else {
					cy.verifyApiResponse('@updateDocumentApi');

					cy.log('==== STEP: DELETING RECENTLY ADDED DOCUMENT ====');

					cy.gridSearch(documentId, 'getESDocuments');
					cy.get('#addDocument', { timeout: longTimeout }).should('be.visible');

					cy.log('==== STEP: OPENING FILE DETAIL DRAWER ====');
					cy.getTableCell('File Number', 1).click();

					cy.log('==== STEP: CLICKING ON HORIZON ICON ====');
					cy.get('#fileDetailHorzIcon').click();

					cy.interceptApi('updateDocument');
					cy.deleteConfirmation();
					cy.verifyApiResponse('@updateDocumentApi');
				}
			});
		});
	});
});
