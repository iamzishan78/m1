/* eslint-disable no-undef */

import { basic_timeouts } from '../../cypressUtils/data';
const eachComment = '12345';
describe('Add new Comment Type spec', () => {
	it('passes', () => {
		// Constants
		const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts;

		cy.viewport(1920, 1080);

		cy.interceptApi('getESSimpleSearch');
		cy.visit('http://localhost:3000/land/agreements');

		cy.checkAndLogin();

		cy.get('#addButton', { timeout: longTimeout }).should('be.visible');

		cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout }).then(response => {
			cy.getTableCell('Agreement', 3).then($row => {
				cy.log('==== STEP: OPEN Agreement ====');
				cy.wrap($row).scrollIntoView().children().eq(1).children().children().children().click();
				cy.wait(5000);
				cy.get('#metaDataButton', { timeout: shorTimeout }).should('be.visible').click();
				cy.get('#triggerCommentType', { timeout: shorTimeout }).should('be.visible').click();
				cy.get('span#newCommentTypeTab', { timeout: shorTimeout }).click();
				cy.get('#custom-comment-type', { timeout: longTimeout }).should('be.visible').type('cc5');
				cy.get('#commentTypeCategory', { timeout: shorTimeout }).click();
				cy.get('.commentTypeCategory-option:nth-child(3)', { timeout: longTimeout }).click();
				cy.get('#addCommentTypeBtn').click({ force: true });
				cy.addComment();

				cy.get('#commentsArea', { timeout: longTimeout }).trigger('mouseover');
				cy.get('#expandCommentActionIcon', { timeout: longTimeout }).should('be.visible');
				cy.get('#expandCommentActionIcon').click({ force: true });
				cy.get('[role="menu"]').should('be.visible');
				cy.get('#pintotop').click({ force: true });

				cy.wait(2000);

				cy.get('#commentsArea', { timeout: longTimeout }).trigger('mouseover');
				cy.get('#expandCommentActionIcon', { timeout: longTimeout }).should('be.visible');
				cy.get('#expandCommentActionIcon').click({ force: true });
				cy.get('[role="menu"]').should('be.visible');
				cy.get('#unpin').click({ force: true });

				cy.verifyApiResponse('@UpsertCommentApi', { responseTimeout: longTimeout }).then(response => {
					const success = response.response.body.data.upsertComment.success;

					cy.log(' successs is ', success);
					cy.expect(success).to.equal(true);
				});
			});
		});
	});
});
