/* eslint-disable no-undef */
import { basic_timeouts } from '../../cypressUtils/data';

Cypress.Commands.add('VerifyAuthInfoECHOC', () => {
  cy.get('table thead th span.MuiButton-label')
    .contains('Created By')
    .should('exist');
  cy.get('table thead th span.MuiButton-label')
    .contains('Created Date')
    .should('exist');
  cy.get('table thead th span.MuiButton-label')
    .contains('Last Updated By')
    .should('exist');
  cy.get('table thead th span.MuiButton-label')
    .contains('Last Updated Date')
    .should('exist');
});