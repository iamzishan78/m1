/* eslint-disable no-undef */

import { basic_timeouts } from '../../cypressUtils/data';

describe('Revenue Uploader Spec', () => {
	it('passes', () => {
		// Constants
		const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts;

		cy.viewport(1400, 900);

		cy.interceptApi('getDbData');
		cy.visit('http://localhost:3000/revenue/statements');

		cy.checkAndLogin();

		cy.get('#addButton', { timeout: longTimeout }).should('be.visible');

		cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout }).then(response => {
			cy.log('==== STEP: OPEN UPLOADER ====');
			cy.interceptApi('getESFilterList');
			cy.interceptApi('getPaginatedContacts');
			cy.get('#addButtonArrowIcon', { timeout: longTimeout }).click();
			cy.get("[id='menu-item-Import Statement']", { timeout: longTimeout }).click();
			cy.verifyApiResponse('@getESFilterListApi', { responseTimeout: longTimeout });
			cy.verifyApiResponse('@getPaginatedContactsApi', { responseTimeout: longTimeout });

			cy.log('==== STEP: SELECT PAYOR ====');
			cy.get('#autoCompleteWithAddNew', { timeout: longTimeout })
				.clear()
				.type('MYSTIC PATH LTD')
				.wait(3000)
				.type('{downArrow}{downArrow}')
				.wait(2000)
				.type('{enter}');

			cy.wait(4000);

			cy.log('==== STEP: ENTER CHECK NUMBER ====');
			cy.get('#checkNumber', { timeout: longTimeout }).type('12112');

			cy.wait(2000);

			cy.log('==== STEP: ENTER CHECK AMOUNT ====');
			cy.get('#checkAmount', { timeout: longTimeout }).type('120');

			cy.wait(2000);

			cy.log('==== STEP: ENTER CHECK DATE ====');
			cy.get('#checkDate', { timeout: longTimeout }).type('2022-12-21');

			cy.wait(5000);

			cy.log('==== STEP: ENTER OWNER NUMBER ====');
			cy.get('#ownerNumber', { timeout: longTimeout }).type('11');

			cy.wait(2000);

			cy.log('==== STEP: SELECT OWNER ====');
			cy.get('#autocompEntityNamesVirtualizeList', { timeout: longTimeout })
				.clear()
				.type('MARY KATE NELSON')
				.wait(3000)
				.type('{downArrow}{downArrow}')
				.wait(2000)
				.type('{enter}');
			cy.wait(5000);

			cy.wait(2000);

			cy.log('==== STEP: ENTER SOURCE ID ====');
			cy.get('#sourceId', { timeout: longTimeout }).type('92');

			cy.get('input[type=file]', { force: true }).selectFile('cypress/files/sampleCsvFile.csv', {
				force: true,
			});

			cy.log('==== STEP: CLICK ON CONTINUE BUTTON FIRST ====');
			cy.get("[id='Continue-button']", { timeout: longTimeout }).click();

			cy.wait(5000);

			cy.log('==== STEP: CLICK ON CONTINUE BUTTON FIRST ====');
			cy.get("[id='Continue-button']", { timeout: longTimeout }).trigger('click');
			cy.get('#sitTightDiv', { timeout: longTimeout }).should('be.visible');

			cy.get('.MuiTypography-root.MuiTypography-caption', { timeout: extraTimeout })
				.contains('Export successfully completed', { timeout: longTimeout })
				.should('be.visible');
		});
	});
});
