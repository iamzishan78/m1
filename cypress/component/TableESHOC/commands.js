/* eslint-disable no-undef */
import { basic_timeouts } from '../../cypressUtils/data';

Cypress.Commands.add('VerifyAuthInfoECHOC', () => {
	cy.get('table thead th span.MuiButton-label > div > div:first-child').contains('Created By').should('exist');
	cy.get('table thead th span.MuiButton-label > div > div:first-child').contains('Created Date').should('exist');
	cy.get('table thead th span.MuiButton-label > div > div:first-child').contains('Last Updated By').should('exist');
	cy.get('table thead th span.MuiButton-label > div > div:first-child').contains('Last Updated Date').should('exist');
});
