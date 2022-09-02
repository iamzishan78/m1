/* eslint-disable no-undef */

describe('Document Grid Spec', () => {
    it('passes', () => {
        cy.viewport(1400, 900)
        cy.visit('http://localhost:3000/contacts')

        cy.checkAndLogin('#workSpaceSignin')

        cy.get('#addButton', { timeout: 50000 }).should('be.visible')
        cy.wait(3000)

        cy.interceptApi('getESSimpleSearch')
        cy.get('#Leads').trigger('click');
        cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: 30000 })
        cy.get('.MuiChip-label', { timeout: 10000 }).contains('Lead')

        // cy.get('.MuiTableCell-root MuiTableCell-body').contains('Prospects').click();
        // cy.get('.MuiTypography-root').contains('Prospects').click();
        // cy.get('.MuiListItemText-primary').contains('Prospects').click();
        // cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: 30000 })
        // cy.get('.MuiChip-label', { timeout: 10000 }).contains('Prospect')

        cy.get('#Contacts').trigger('click');
        cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: 30000 })
        cy.get('.MuiChip-label', { timeout: 10000 }).contains('Contact')

        cy.get('[id="All Entities"]').trigger('click');
        cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: 30000 })
        cy.get('.MuiTypography-root', { timeout: 10000 }).contains('All Entities');

        cy.get('.MuiInputBase-input.MuiOutlinedInput-input.MuiInputBase-inputAdornedStart').type('jacob')

        cy.wait(10000)

        cy.get('.MuiTableCell-root.MuiTableCell-body').contains('SGF TRUST LEGAL').click();

        cy.interceptApi('getESSimpleSearch')
        cy.get('.MuiBreadcrumbs-li', { timeout: 10000 }).contains("Contacts").should('be.visible').click()

        cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: 30000 })

        cy.interceptApi('getESSimpleSearch')
        cy.get('#Leads').trigger('click');
        cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: 30000 })
        cy.get('.MuiChip-label', { timeout: 10000 }).contains('Lead')


        cy.get('.MuiInputBase-input.MuiOutlinedInput-input.MuiInputBase-inputAdornedStart').type('GoodwillDD')

        cy.wait(10000)

        cy.get('.MuiInputBase-input.MuiOutlinedInput-input.MuiInputBase-inputAdornedStart').type('{backspace}{backspace}')

        cy.get('.MuiButton-label', { timeout: 10000 }).contains('Contact Owner').click({ force: true })
        cy.wait(1000)
        cy.get('.MuiButton-label', { timeout: 10000 }).contains('Contact Owner').click({ force: true })
        cy.wait(1000)
        cy.get('.MuiTableCell-root.MuiTableCell-body').contains('GOODWILL IND REVOC TR LEGAL').click();
        cy.get('.MuiBreadcrumbs-li', { timeout: 10000 }).contains("Contacts").should('be.visible').click()

        cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: 30000 })

        cy.get("#viewColumnIcon").click()

    })

})