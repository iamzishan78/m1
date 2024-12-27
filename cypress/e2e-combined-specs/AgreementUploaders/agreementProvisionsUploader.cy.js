/* eslint-disable no-undef */

import { basic_timeouts } from '../../cypressUtils/data';

describe('Agreement Provision Uploader Spec', () => {
	it('passes', () => {
		// Constants
		const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts;

		cy.viewport(1536, 960);

		cy.interceptApi('getESSimpleSearch');
		cy.visit('http://localhost:3000/land/agreements');

		cy.checkAndLogin();

		cy.get('#addButton', { timeout: longTimeout }).should('be.visible');

		cy.task('getGlobalData').then(globalData => {
			const { agreementData } = globalData;

			console.log('Agreement Data : ', agreementData);

			cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout }).then(response => {
				cy.log('==== STEP: OPEN UPLOADER ====');
				cy.openAgreementUploader('Agreement Upload (Agreement Provisions)');

				cy.log('==== STEP: UPLOAD FILE ====');
				cy.get('input[type=file]', { force: true }).selectFile(
					'cypress/files/Sample_AGREEMENT_PROVISIONS_Upload_20221217.csv',
					{
						force: true,
					}
				);

				cy.checkFieldsMapping();

				cy.log('==== STEP: SELECT ONLY CREATE ONE OPTION FROM THE FIELD ====');
				cy.get('#agreement-outlined', { timeout: longTimeout }).click();
				cy.get("[id='Only create new']", { timeout: longTimeout }).click();

				cy.log('==== STEP: CLICK ON CONTINUE BUTTON ====');
				cy.get('#continueButton', { timeout: longTimeout }).scrollIntoView().should('not.be.disabled').click();

				cy.wait(5000);

				cy.log('==== STEP: EXTRACT WELL DATA FROM THE TABLE  ====');
				cy.get('#materialTable', { timeout: longTimeout })
					.should('be.visible')
					.get('.MuiTable-root')
					.find('tr')
					.then(row => {
						const totalRows = row.length - 1;
						cy.log(totalRows);
						cy.log(row.length);
						//row.length will give you the row count

						cy.getDataFromGrid('Provision Type', totalRows);

						cy.log('==== STEP: CLICK ON UPLOAD BUTTON ====');
						cy.get('#continueButton', { timeout: longTimeout }).scrollIntoView().should('not.be.disabled').click();

						cy.log('==== STEP: VERIFY EXPORT STATUS ====');
						cy.get('.MuiTypography-root.MuiTypography-caption', { timeout: extraTimeout })
							.contains('Export successfully completed', { timeout: longTimeout })
							.should('be.visible');
						// cy.wait(9000)
						cy.log('==== STEP: VERIFYING RELATED WELLS FOR AGREEMENTS ====');
						agreementData.forEach(data => {
							cy.visit('http://localhost:3000/land/agreements');

							cy.get('#addButton', { timeout: longTimeout }).should('be.visible');

							const { agreementName, agreementNumber } = data;
							cy.log(`==== STEP: VERIFYING RELATED WELLS FOR AGREEMENT : ${agreementName} ====`);
							cy.wait(5000);

							cy.gridSearch(agreementName, 'getESSimpleSearch').then(response => {
								const hits = response.response.body.data.getESSimpleSearch.hits;

								const cypressAgreement = hits.find(hit => hit.agreementName === agreementName);

								if (!cypressAgreement) {
									throw new Error('Agreement added by cypress Uploader not found');
								}

								const indexOfcypressAgreement = hits.findIndex(hit => hit._id === cypressAgreement._id) + 1;

								cy.log('==== STEP: OPEN CYPRESS AGREEMENT DETAIL  ====');
								cy.getTableCell('Agreement', indexOfcypressAgreement).then($agreementNameCell => {
									cy.interceptApi('getAgreementProvisions');
									cy.wrap($agreementNameCell)
										.contains(`${agreementNumber} - ${agreementName}`)
										.scrollIntoView()
										.click({ waitForAnimations: false });

									cy.verifyApiResponse('@getAgreementProvisionsApi', { responseTimeout: longTimeout }).then(result => {
										const provisionTypes = result.response?.body?.data?.getAgreementProvisions.map(hit => hit.type);
										cy.log(JSON.stringify(provisionTypes));

										cy.get('@gridData').then(gridData => {
											console.log('agreement final: ', agreementName);
											console.log('agreement number final: ', agreementNumber);
											console.log('provisionTypes: ', provisionTypes);
											console.log('gridData final: ', gridData);

											const provisionTypeByUploader = gridData
												.filter(td => td.agreementNumber === agreementNumber)
												?.map(provision => provision.provisionType);

											console.log('provisionTypeByUploader final: ', provisionTypeByUploader);

											if (provisionTypeByUploader.length > 0) {
												provisionTypeByUploader.forEach(provisionType => {
													expect(provisionTypes).to.include(provisionType);
												});
											}
										});
									});
								});
							});
						});
					});
			});
		});
	});
});
