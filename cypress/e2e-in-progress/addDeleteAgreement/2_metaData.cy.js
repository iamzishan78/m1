/* eslint-disable no-undef */

import { basic_timeouts, agreementObj } from '../../cypressUtils/data';

describe('Add Metadata Agreement Spec', () => {
	it('passes', () => {
		const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts;

		cy.viewport(1536, 960);
		cy.visit('http://localhost:3000/land/agreements');

		cy.checkAndLogin();

		cy.get('#addButton', { timeout: longTimeout }).should('be.visible');

		cy.log('==== STEP: SEARCH AGREEMENT ON GRID ====');
		cy.gridSearch(agreementObj.agreementName.value, 'getESSimpleSearch').then(response => {
			const hits = response.response.body.data.getESSimpleSearch.hits;
			const cypressAgreement = hits.find(hit => hit.agreementName === agreementObj.agreementName.value);

			if (!cypressAgreement) {
				throw new Error('Sample Agreement added by cypress not found');
			}

			const indexOfcypressAgreement = hits.findIndex(hit => hit._id === cypressAgreement._id) + 1;

			cy.log('==== STEP: OPEN CYPRESS GENERATED AGREEMENT DETAIL  ====');
			cy.getTableCell('Agreement', indexOfcypressAgreement).then($agreementNameCell => {
				cy.wrap($agreementNameCell)
					.contains(`${agreementObj.agreementNumber.value} - ${agreementObj.agreementName.value}`)
					.scrollIntoView()
					.click({ waitForAnimations: false });
				cy.get(agreementObj.agreementNumber.id, { timeout: longTimeout }).should('be.visible');

				cy.log('==== STEP: CLICK ON META DETA BUTTON ====');
				cy.get('#metaDataButton').scrollIntoView();
				cy.wait(5000);
				cy.get('#metaDataButton', { timeout: longTimeout }).trigger('click');

				cy.wait(5000);
				cy.log('==== STEP: ADD ASSIGN APPROVER ====');
				cy.typeAndSelect(agreementObj.Approver.id, agreementObj.Approver.value);

				cy.log('==== STEP: ADD AGREEMENT TYPE ====');
				cy.agreementFieldSelect(agreementObj.approvalStatus);

				cy.log('==== STEP: ADD DOCUMENT ====');
				cy.addDocument(agreementObj.file.address);
				cy.get(agreementObj.file.fileId, { timeout: longTimeout }).should('exist');

				cy.log('==== STEP: ADD COMMENT ====');
				cy.addComment();

				cy.verifyApiResponse('@UpsertCommentApi', { responseTimeout: longTimeout }).then(response => {
					const commentId = response.response.body.data.upsertComment.comment._id;
					cy.get(`#${commentId}`, { timeout: longTimeout }).should('exist');
				});
			});
		});
	});
});
