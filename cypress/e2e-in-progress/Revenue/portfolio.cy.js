/* eslint-disable no-undef */

import { basic_timeouts } from '../../cypressUtils/data';

describe('Portfolio Spec', () => {
	it('passes', () => {
		const { shorTimeout, longTimeout } = basic_timeouts;

		cy.viewport(1400, 900);

		cy.interceptApi('getPortfolioSummary');
		cy.visit('http://localhost:3000/revenue/portfolio');

		cy.checkAndLogin();

		cy.verifyApiResponse('@getPortfolioSummaryApi', { responseTimeout: shorTimeout }).then(response => {
			const getPortfolioSummary = response.response.body.data.getPortfolioSummary;

			if (typeof getPortfolioSummary === 'string') {
				throw new Error(getPortfolioSummary);
			}
		});

		cy.get('#portfilioActionBar', { timeout: longTimeout }).should('be.visible');
	});
});
