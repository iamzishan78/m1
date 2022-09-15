/* eslint-disable no-undef */

describe('Search Grid Spec', () => {
    it('passes', () => {
        cy.viewport(1400, 900)
        cy.visit('http://localhost:3000/documents')

        cy.checkAndLogin()

        cy.get('#addDocument', { timeout: 50000 }).should('be.visible')

        cy.log('==== STEP: SEARCH 2342 in DOCUMENT ====')
        cy.gridSearch('2342', 'getESDocuments')

        cy.log('==== STEP: SEARCH black dog in DOCUMENT ====')
        cy.gridSearch('black dog', 'getESDocuments')

        cy.log('==== STEP: SEARCH Division Order in DOCUMENT ====')
        cy.gridSearch('Division Order', 'getESDocuments')
    })

})