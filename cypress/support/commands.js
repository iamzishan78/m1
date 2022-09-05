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

            cy.get('#signInName', { timeout: 10000 }).should('be.visible').type('support@m1neral.com')
            cy.get('#password').type('M1neral2022')

            cy.get('#next').click()
        }
    })
})

// This command is to type  in autocomplete search bar and then select first matched option
Cypress.Commands.add('typeAndSelect', (searchId, stringToType, optionId) => {
    cy.get(searchId).type(stringToType)
    cy.get(`[id="${optionId}"]`, { timeout: 50000 }).should('be.visible')
    cy.get(searchId).type('{downArrow}{enter}')
})

// This command is to intercept graphql api by operation name
Cypress.Commands.add('interceptApi', (operationName) => {
    cy.intercept('POST', 'https://enerxgraphql.azurewebsites.net/api/m1graph?code=Rhr8LQFXNnl/TE26EVD296voKbGVWZQDupqWAAWMaZXjzvgdvktPqg==', req => {
        if (req.body.operationName === operationName) {
            // req.alias will use as api title 
            req.alias = `${operationName}Api`;
        }
    });
})

// This command is to check api was successful or not
Cypress.Commands.add('verifyApiResponse', (apiTitle) => {
    cy.wait(apiTitle, { timeout: 10000 }).then((interception) => {
        assert.isNotNull(interception.response.body, `${apiTitle} run succesfully`)
    })
})