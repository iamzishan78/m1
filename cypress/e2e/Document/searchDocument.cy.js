/* eslint-disable no-undef */

describe('Document Grid Spec', () => {
    it('passes', () => {
        cy.viewport(1400, 900)
        cy.visit('http://localhost:3000/documents')

        cy.checkAndLogin()

        cy.get('#addDocument', { timeout: 50000 }).should('be.visible')


        cy.gridSearch('black dog', 'getESDocuments')
        cy.gridSearch('2342', 'getESDocuments')
        cy.gridSearch('Division Order', 'getESDocuments')

    })

})