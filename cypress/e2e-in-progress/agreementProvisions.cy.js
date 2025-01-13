/* eslint-disable no-undef */

import { basic_timeouts } from '../cypressUtils/data';

describe('Agreement Provisions Spec', () => {
	it('passes', () => {
		// Constants
		const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts;

		cy.viewport(1536, 960);

		cy.interceptApi('getDbData');
		cy.visit('http://localhost:3000/land/agreements');

		cy.checkAndLogin();

		cy.get('#addButton', { timeout: longTimeout }).should('be.visible');

		cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout }).then(response => {
			cy.getTableCell('Agreement', 3).then($row => {
				cy.log('==== STEP: OPEN Agreement ====');
				cy.wrap($row).scrollIntoView().children().eq(1).children().children().children().click();

				cy.get('.MuiTypography-root', { timeout: longTimeout }).contains('Summary').should('be.visible');

				cy.log('==== STEP: CLICK ON PROVISION TAB ====');
				cy.wait(10000);
				cy.get('#provisionsTab').click();

				cy.log('==== STEP: CLICK ON PUGH CHECKBOX ====');

				cy.get("[id='Pugh - Vertical']", { timeout: longTimeout }).scrollIntoView().check({ force: true });

				cy.log('==== STEP: ENTER PROVISION VALUE 1 ====');
				cy.interceptApi('upsertAgreementProvision');
				cy.get("[id='provision-value-0']", { timeout: longTimeout }).clear().type('$1,000/acre per year');
				cy.wait(10000);
				cy.verifyApiResponse('@upsertAgreementProvisionApi', { responseTimeout: longTimeout });

				cy.log('==== STEP: ENTER START DATE 1 ====');
				cy.interceptApi('upsertAgreementProvision');
				cy.get("[id='start-date-picker-0']", { timeout: longTimeout }).clear().wait(3000).type('06/ 12/2022');
				cy.wait(1000);
				cy.verifyApiResponse('@upsertAgreementProvisionApi', { responseTimeout: longTimeout });

				cy.log('==== STEP: ENTER LAST DATE 1 ====');
				cy.interceptApi('upsertAgreementProvision');
				cy.get("[id='last-date-picker-0']", { timeout: longTimeout }).clear().wait(3000).type('07/29/2022');
				cy.wait(1000);
				cy.verifyApiResponse('@upsertAgreementProvisionApi', { responseTimeout: longTimeout });

				cy.log('==== STEP: SELECT FREQUENCY 1 ====');
				cy.interceptApi('upsertAgreementProvision');
				cy.get("[id='frequency-0']").click().type('{downArrow}{downArrow}{enter}');
				cy.verifyApiResponse('@upsertAgreementProvisionApi', { responseTimeout: longTimeout });

				cy.wait(5000);

				cy.log('==== STEP: SELECT PARTY NAME 1 ====');
				cy.interceptApi('upsertAgreementProvision');
				cy.get("[id='partyName-0']").click().type('{downArrow}{enter}');
				cy.verifyApiResponse('@upsertAgreementProvisionApi', { responseTimeout: longTimeout });

				cy.log('==== STEP: ENTER PROVISION DESCRIPTION 1 ====');
				cy.interceptApi('upsertAgreementProvision');
				cy.get("[id='provisionDescription-0']").clear().type('A cypress description');
				cy.wait(1000);
				cy.verifyApiResponse('@upsertAgreementProvisionApi', { responseTimeout: longTimeout });

				cy.get('#commentIcon').click();
				cy.log('==== STEP: ENTER COMMENT 1 ====');
				cy.interceptApi('UpsertComment');
				cy.get('#commentInput').type('A cypress comment {enter}');
				cy.verifyApiResponse('@UpsertCommentApi', { responseTimeout: longTimeout });
				cy.get('body').type('{esc}');

				cy.get('#addProvisionButton', { timeout: longTimeout }).click();

				cy.log('==== STEP: SELECT PROVISION TYPE 2 ====');
				cy.interceptApi('upsertAgreementProvision');
				cy.get('#provisionType').type('rental{downArrow}{downArrow}{enter}');
				cy.verifyApiResponse('@upsertAgreementProvisionApi', { responseTimeout: longTimeout });

				cy.log('==== STEP: SELECT APPLICABLE 1 ====');
				cy.interceptApi('upsertAgreementProvision');
				cy.get('#applicable-1').click();
				cy.get('body').type('{upArrow}{enter}');
				cy.verifyApiResponse('@upsertAgreementProvisionApi', { responseTimeout: longTimeout });

				cy.log('==== STEP: ENTER PROVISION VALUE 2 ====');
				cy.interceptApi('upsertAgreementProvision');
				cy.get("[id='provision-value-1']", { timeout: longTimeout }).clear().type('$1,000/acre per year');
				cy.wait(1000);
				cy.verifyApiResponse('@upsertAgreementProvisionApi', { responseTimeout: longTimeout });

				cy.log('==== STEP: ENTER START DATE 2 ====');
				cy.interceptApi('upsertAgreementProvision');
				cy.get("[id='start-date-picker-1']", { timeout: longTimeout }).clear().wait(3000).type('06/ 12/2022');
				cy.wait(1000);
				cy.verifyApiResponse('@upsertAgreementProvisionApi', { responseTimeout: longTimeout });

				cy.log('==== STEP: ENTER LAST DATE 2 ====');
				cy.interceptApi('upsertAgreementProvision');
				cy.get("[id='last-date-picker-1']", { timeout: longTimeout }).clear().wait(3000).type('07/29/2022');
				cy.wait(1000);
				cy.verifyApiResponse('@upsertAgreementProvisionApi', { responseTimeout: longTimeout });

				cy.log('==== STEP: SELECT FREQUENCY 2 ====');
				cy.interceptApi('upsertAgreementProvision');
				cy.get("[id='frequency-1']").click().type('{downArrow}{downArrow}{enter}');
				cy.verifyApiResponse('@upsertAgreementProvisionApi', { responseTimeout: longTimeout });

				cy.log('==== STEP: SELECT PARTY NAME 2 ====');
				cy.interceptApi('upsertAgreementProvision');
				cy.get("[id='partyName-1']").click().type('{downArrow}{enter}');
				cy.verifyApiResponse('@upsertAgreementProvisionApi', { responseTimeout: longTimeout });

				cy.log('==== STEP: ENTER PROVISION DESCRIPTION 2 ====');
				cy.interceptApi('upsertAgreementProvision');
				cy.get("[id='provisionDescription-1']").clear().type('A cypress description 2');
				cy.wait(1000);
				cy.verifyApiResponse('@upsertAgreementProvisionApi', { responseTimeout: longTimeout });

				cy.get('#menuIcon').click();
				cy.get('#applicable-1').scrollIntoView();

				cy.log('==== STEP: DELETE RENTAL PROVISION ====');
				cy.interceptApi('upsertAgreementProvision');
				cy.get("[id='frequency-1']").scrollIntoView().trigger('mouseover');
				cy.get('#moreVertIconProvision').scrollIntoView().click();
				cy.get('#deleteProvision', { timeout: longTimeout }).click();
				cy.verifyApiResponse('@upsertAgreementProvisionApi', { responseTimeout: longTimeout });

				cy.log('==== STEP: DELETE PUGH PROVISION ====');
				cy.interceptApi('upsertAgreementProvision');
				cy.get("[id='frequency-0']").scrollIntoView().trigger('mouseover');
				cy.get('#moreVertIconProvision').scrollIntoView().click();
				cy.get('#deleteProvision', { timeout: longTimeout }).click();
				cy.verifyApiResponse('@upsertAgreementProvisionApi', { responseTimeout: longTimeout });
			});
		});
	});
});
