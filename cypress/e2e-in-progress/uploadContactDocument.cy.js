/* eslint-disable no-undef */

import { basic_timeouts, documentObj } from '../cypressUtils/data';

describe('upload contact documnet', () => {
	it('passes', () => {
		const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts;

		cy.viewport(1920, 1080);

		cy.visit('http://localhost:3000/');

		cy.checkAndLogin();

		cy.interceptApi('getDbData');
		cy.get("[title='Contacts']", { timeout: longTimeout }).should('be.visible').click();
		cy.get('#quickActionPanel', { timeout: longTimeout }).contains('All Entities').click({ force: true });
		cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout }).then(res => {
			cy.get('table tbody tr:first-child td:nth-child(2)', { timeout: longTimeout })
				.should('be.visible')
				.trigger('click');
			cy.get('.MuiDropzoneArea-root', { timeout: longTimeout }).should('be.visible').click({ force: true });
			cy.interceptApi('AddDescriptorFile');
			cy.addDocument(documentObj.fileAddress).then(response => {
				const success = response.response.body.data.addFileDescriptor.success;

				cy.log('-=-=-- successs -=-=-', success);
				cy.interceptApi('getESDocuments');
				cy.expect(success).to.equal(true);
			});
		});
	});
});
