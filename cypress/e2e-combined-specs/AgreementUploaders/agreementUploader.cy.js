/* eslint-disable no-undef */

import { basic_timeouts } from '../../cypressUtils/data';

describe('Agreement Uploader Spec', () => {
	const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts;
	it('passes', () => {
		cy.viewport(1400, 900);

		cy.interceptApi('getESSimpleSearch');
		cy.visit('http://localhost:3000/land/agreements');

		cy.checkAndLogin();

		cy.get('#addButton', { timeout: longTimeout }).should('be.visible');

		cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout }).then(response => {
			cy.log('==== STEP: OPEN UPLOADER ====');

			cy.get('#addButtonArrowIcon', { timeout: longTimeout }).click();
			cy.get("[id='menu-item-Import Agreements']", { timeout: longTimeout }).click();

			cy.log('==== STEP: UPLOAD FILE ====');
			cy.get('input[type=file]', { force: true }).selectFile('cypress/files/Sample_AGREEMENT_HEADER_Upload.csv', {
				force: true,
			});

			cy.get('#continueButton', { timeout: longTimeout }).scrollIntoView().should('be.disabled');

			cy.log('==== STEP: SELECT ONLY CREATE ONE OPTION FROM THE FIELD ====');
			cy.get('#agreement-outlined', { timeout: longTimeout }).click();
			cy.get("[id='Only create new']", { timeout: longTimeout }).click();

			cy.log('==== STEP: CLICK ON CONTINUE BUTTON ====');
			cy.get('#continueButton', { timeout: longTimeout }).scrollIntoView().should('not.be.disabled').click();

			cy.log('==== STEP: EXTRACT AGREEMENT DATA FROM THE TABLE  ====');
			cy.get('#materialTable', { timeout: longTimeout })
				.should('be.visible')
				.get('.MuiTable-root')
				.find('tr')
				.then(row => {
					const totalRows = row.length - 5;
					cy.log(totalRows);
					cy.log(row.length);
					//row.length will give you the row count
					cy.getDataFromGrid('Agreement Name', totalRows);

					cy.log('==== STEP: CLICK ON CONTINUE BUTTON ====');
					cy.get('#continueButton', { timeout: longTimeout }).scrollIntoView().should('not.be.disabled').click();

					cy.wait(5000);

					cy.log('==== STEP: VERIFY EXPORT STATUS ====');
					cy.get('.MuiTypography-root.MuiTypography-caption', { timeout: extraTimeout })
						.contains('Export successfully completed', { timeout: longTimeout })
						.should('be.visible');

					cy.wait(5000);

					cy.get('@gridData').then(gridData => {
						cy.task('setAgreementData', gridData);

						// agrmntData.forEach(data => {
						//     cy.log(`==== STEP: DELETE AGREEMENT : ${data.name} FROM THE GRID ====`)
						//     cy.visit('http://localhost:3000/land/agreements')

						//     cy.get('#addButton', { timeout: longTimeout }).should('be.visible')
						//     cy.deleteAndVerifyAgreement(data.name, data.number)

						//     cy.wait(5000)
						// });
					});
				});
		});
	});
});
