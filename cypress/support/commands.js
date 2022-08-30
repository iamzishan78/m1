/* eslint-disable no-undef */
/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


Cypress.Commands.add("checkAndLogin", (selector) => {
    //This command will logged in if it is not already logged in
    cy.get('body').then(($body) => {
        if ($body.find(selector).length) {
            cy.get('input').type('enerx')
            cy.get('.MuiButtonBase-root').click()

            cy.wait(4000)

            cy.get('#signInName', { timeout: 10000 }).should('be.visible').type('support@m1neral.com')
            cy.get('#password').type('M1neral2022')
            cy.wait(4000)
            cy.get('#next').click()
        }
    })
})