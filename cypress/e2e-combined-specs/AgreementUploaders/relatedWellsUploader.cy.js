/* eslint-disable no-undef */

import { basic_timeouts } from '../../cypressUtils/data';

describe('Related Wells Uploader Spec', () => {
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
				cy.openAgreementUploader('Agreement Upload (Related Wells)');

				cy.log('==== STEP: UPLOAD FILE ====');
				cy.get('input[type=file]', { force: true }).selectFile(
					'cypress/files/Sample_AGREEMENT_RELATED_WELLS_Upload _20221217.csv',
					{
						force: true,
					}
				);

				cy.checkFieldsMapping();

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

						cy.getDataFromGrid('API Number (10 digit)', totalRows);

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

								if (!cypressAgreement) throw new Error('Agreement added by cypress Uploader not found');

								const indexOfcypressAgreement = hits.findIndex(hit => hit._id === cypressAgreement._id) + 1;

								cy.log('==== STEP: OPEN CYPRESS AGREEMENT DETAIL  ====');
								cy.getTableCell('Agreement', indexOfcypressAgreement).then($agreementNameCell => {
									cy.interceptApi('getESPaginatedList');
									cy.wrap($agreementNameCell)
										.contains(`${agreementNumber} - ${agreementName}`)
										.scrollIntoView()
										.click({ waitForAnimations: false });

									cy.verifyApiResponse('@getESPaginatedListApi', { responseTimeout: longTimeout }).then(result => {
										const wellApiNumbers = result.response?.body?.data?.getESPaginatedList.hits.map(
											hit => hit.apiNumber
										);
										cy.log(JSON.stringify(wellApiNumbers));

										cy.get('@gridData').then(gridData => {
											console.log('agreement final: ', agreementName);
											console.log('agreement number final: ', agreementNumber);
											console.log('wellApiNumbers: ', wellApiNumbers);
											console.log('gridData final: ', gridData);

											const wellApiNumberByUploader = gridData
												.filter(td => td.agreementNumber === agreementNumber)
												?.map(well => well.apiNumber10Digit);

											console.log('wellApiNumberByUploader final: ', wellApiNumberByUploader);

											if (wellApiNumberByUploader.length > 0)
												wellApiNumberByUploader.forEach(apiNumber => {
													expect(wellApiNumbers).to.include(apiNumber);
												});
										});
									});
								});
							});
						});

						agreementData.forEach(data => {
							cy.log(`==== STEP: DELETE AGREEMENT : ${data.name} FROM THE GRID ====`);
							cy.visit('http://localhost:3000/land/agreements');

							cy.get('#addButton', { timeout: longTimeout }).should('be.visible');
							cy.deleteAndVerifyAgreement(data.name, data.number);

							cy.wait(5000);
						});
					});
			});
		});
	});
});
