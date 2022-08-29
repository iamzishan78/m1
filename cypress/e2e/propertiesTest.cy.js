/* eslint-disable no-undef */

describe('empty spec', () => {
    it('passes', () => {
        cy.visit('http://localhost:3000/revenue/properties')

        cy.get('input').type('localhost')
        cy.get('.MuiButtonBase-root').click()

        cy.wait(4000)

        cy.get('#signInName', { timeout: 10000 }).should('be.visible').type('support@m1neral.com')
        cy.get('#password').type('M1neral2022')
        cy.wait(4000)
        cy.get('#next').click()

        cy.wait(16000)



    })

})