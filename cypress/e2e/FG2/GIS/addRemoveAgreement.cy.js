/* eslint-disable no-undef */

import { basic_timeouts } from '../../../cypressUtils/data';

describe('Add And Remove Agreement Spec', () => {
	it('passes', () => {
		const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts;

		cy.viewport(1400, 900);
		cy.visit('http://localhost:3000');

		cy.checkAndLogin('#workSpaceSignin');

		cy.get('.mapboxgl-canvas', { timeout: longTimeout }).should('be.visible').click();

		cy.get('#arrowBackIcon', { timeout: longTimeout }).click();

		cy.drawMapShape();

		cy.createShapeLayer('#agreementItem');

		cy.get('#expandIcon', { timeout: longTimeout }).click();

		cy.wait(20000);
		cy.interceptApi('updateCustomLayer');

		cy.updateSummaryField('Agreement Number', '9123');

		cy.verifyApiResponse('@updateCustomLayerApi', { responseTimeout: longTimeout });

		cy.interceptApi('updateCustomLayer');
		cy.get('#expandCardVertIcon').click();
		cy.deleteConfirmation();

		cy.verifyApiResponse('@updateCustomLayerApi', { responseTimeout: longTimeout });

		cy.wait(1000);
	});
});
