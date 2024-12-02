/* eslint-disable no-undef */

import { basic_timeouts, agreementObj } from '../../../cypressUtils/data';

describe('Add Agreement Spec', () => {
	it('passes', () => {
		const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts;

		cy.viewport(1536, 960);
		cy.visit('http://localhost:3000/land/agreements');

		cy.checkAndLogin();

		cy.log('==== STEP: ADD AGREEMENT ====');
		cy.interceptApi('UpsertCustomLayer');
		cy.get('#addButton', { timeout: longTimeout }).should('be.visible').click();
		cy.verifyApiResponse('@UpsertCustomLayerApi').then(response => {
			const cypressAgreementId = response.response.body.data.upsertCustomLayer.customLayer._id;

			cy.get(agreementObj.agreementNumber.id, { timeout: longTimeout }).should('be.visible');

			cy.log('==== STEP: ADD AGREEMENT NUMBER ====');
			cy.interceptApi('updateCustomLayer');
			cy.get(agreementObj.agreementNumber.id, { timeout: longTimeout })
				.should('be.visible')
				.type(agreementObj.agreementNumber.value);
			cy.get('.MuiGrid-item').contains('Agreement Number').click();
			cy.verifyApiResponse('@updateCustomLayerApi');

			cy.log('==== STEP: ADD AGREEMENT NAME ====');
			cy.get(agreementObj.agreementName.id, { timeout: longTimeout })
				.should('be.visible')
				.wait(200)
				.type(agreementObj.agreementName.value);

			cy.log('==== STEP: ADD AGREEMENT TYPE ====');
			cy.agreementFieldSelect(agreementObj.agreementType);

			cy.log('==== STEP: ADD AGREEMENT SUBTYPE ====');
			cy.typeAndSelect(agreementObj.agreementSubtype.id, agreementObj.agreementSubtype.value);

			cy.log('==== STEP: ADD AGREEMENT RIGHTTYPE ====');
			cy.typeAndSelect(agreementObj.rightsType.id, agreementObj.rightsType.value);

			cy.log('==== STEP: ADD AGREEMENT STATUS ====');
			cy.typeAndSelect(agreementObj.agreementStatus.id, agreementObj.agreementStatus.value);

			cy.log('==== STEP: ADD AGREEMENT LESSEE ====');
			cy.get('body').type('{esc}');
			cy.get(agreementObj.Lessee.id, { timeout: longTimeout }).type(agreementObj.Lessee.value);

			cy.log('==== STEP: ADD AGREEMENT DATE ====');
			cy.get(agreementObj.agreementDate.id, { timeout: longTimeout }).type(agreementObj.agreementDate.value);

			cy.log('==== STEP: ADD AGREEMENT EFFECTIVE DATE ====');
			cy.get(agreementObj.effectiveDate.id, { timeout: longTimeout }).type(agreementObj.effectiveDate.value);

			cy.log('==== STEP: ADD AGREEMENT TERM ====');
			cy.get(agreementObj.agreementTerm.id, { timeout: longTimeout }).type(agreementObj.agreementTerm.value);

			cy.log('==== STEP: ADD AGREEMENT EXPIRATION DATE ====');
			cy.get(agreementObj.expirationDate.id, { timeout: longTimeout }).type(agreementObj.expirationDate.value);

			cy.log('==== STEP: ADD AGREEMENT EXTENSION DATE ====');
			cy.get(agreementObj.extensionDate.id, { timeout: longTimeout }).type(agreementObj.extensionDate.value);

			cy.log('==== STEP: ADD AGREEMENT BONUS PAYMENT ====');
			cy.get(agreementObj.bounusPayment.id, { timeout: longTimeout }).type(agreementObj.bounusPayment.value);

			cy.log('==== STEP: ADD AGREEMENT ACQUISITION ID ====');
			cy.typeAndSelect(agreementObj.acquisitionID.id, agreementObj.acquisitionID.value);

			cy.log('==== STEP: ADD AGREEMENT ACQUISITION DATE ====');
			cy.get(agreementObj.acquisitionDate.id, { timeout: longTimeout }).type(agreementObj.acquisitionDate.value);

			cy.log('==== STEP: ADD AGREEMENT ACQUISITION COST ====');
			cy.get(agreementObj.totalAcquisitionCost.id, { timeout: longTimeout }).type(
				agreementObj.totalAcquisitionCost.value
			);

			cy.log('==== STEP: ADD AGREEMENT PROSPECT ====');
			cy.typeAndSelect(agreementObj.Prospect.id, agreementObj.Prospect.value);

			cy.log('==== STEP: ADD AGREEMENT INTERNAL COMPANY ====');
			cy.typeAndSelect(agreementObj.internalCompany.id, agreementObj.internalCompany.value);

			cy.log('==== STEP: ADD AGREEMENT STATE ====');
			cy.typeAndSelect(agreementObj.state.id, agreementObj.state.value);

			cy.log('==== STEP: ADD AGREEMENT COUNTY ====');
			cy.typeAndSelect(agreementObj.county.id, agreementObj.county.value);

			// cy.log('==== STEP: ADD AGREEMENT COUNTY ====')
			// cy.get("[id='field-Project Name']",{ timeout: longTimeout }).click()
			// cy.get('body').type("{downArrow}{downArrow}{enter}")
		});
	});
});
