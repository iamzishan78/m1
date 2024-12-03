import { basic_timeouts, agreementObj } from '../cypressUtils/data';

describe('Add/Remove Related Parties Spec', () => {
	it('passes', () => {
		const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts;

		cy.viewport(1920, 1080);

		cy.visit('http://localhost:3000/');

		cy.checkAndLogin();
		cy.interceptApi('getESSimpleSearch');
		cy.get("[title='Assets']", { timeout: longTimeout }).should('be.visible').click();
		cy.get('#quickActionPanel', { timeout: longTimeout }).contains('Agreements').click();

		cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout }).then(res => {
			cy.getTableCell('Agreement', 1).then($tableCell => {
				cy.wrap($tableCell, { timeout: shorTimeout }).click('left');
				cy.wait(5000);

				cy.get('#addPartyButton', { timeout: longTimeout }).scrollIntoView().click();
				cy.wait(2000);
				cy.get('#related-parties-div', { timeout: longTimeout }).scrollIntoView();
				cy.interceptApi('upsertRelatedParty');
				cy.get('#rp-row-container > div').first().scrollIntoView();
				cy.get('#rp-row-container > div:last-child .MuiAutocomplete-root').then(elements => {
					cy.wrap(elements[0]).type('Broker');
				});
				cy.get('.MuiAutocomplete-popper ul li', { timeout: shorTimeout }).first().click();
				cy.verifyApiResponse('@upsertRelatedPartyApi').then(response => {
					cy.log('*-*--*-* response.response.body.data ', JSON.stringify(response.response.body.data));
					const status = response.response.body.data.upsertRelatedParty.status;

					cy.expect(status).to.equal(true);
					cy.get('#rp-row-container > div:last-child .MuiAutocomplete-root', { timeout: shorTimeout }).then(
						elements => {
							cy.wrap(elements[1]).type('A');
						}
					);
					cy.wait(1000);
					cy.get('.MuiAutocomplete-popper ul li', { timeout: shorTimeout }).first().click({ force: true });

					cy.verifyApiResponse('@upsertRelatedPartyApi').then(response => {
						const status = response.response.body.data.upsertRelatedParty.status;

						cy.expect(status).to.equal(true);

						cy.get('[datatest-id=moreOptionsPopper]', { timeout: longTimeout })
							.should('be.visible')
							.click({ force: true });
						cy.get('[datatest-id=deleteRelatedParty]', { timeout: shorTimeout })
							.should('be.visible')
							.click({ force: true });

						cy.verifyApiResponse('@upsertRelatedPartyApi').then(response => {
							const status = response.response.body.data.upsertRelatedParty.status;

							cy.expect(status).to.equal(true);
						});
					});
				});
			});
		});
	});
});
