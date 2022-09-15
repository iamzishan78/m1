/* eslint-disable no-undef */

describe('Document Grid Spec', () => {
    it('passes', () => {
        cy.viewport(1400, 900)

        cy.interceptApi('getESDocuments')
        cy.visit('http://localhost:3000/documents')

        cy.checkAndLogin()

        cy.get('#addDocument', { timeout: 50000 }).should('be.visible')
        cy.verifyApiResponse('@getESDocumentsApi', { responseTimeout: 30000 })

        cy.log('==== STEP: SCROLL TO RIGHT ====')
        cy.get('#Documents').children().children().children().children().eq(2).scrollTo('right')

        cy.log('==== STEP: UPDATE INTERNAL COMPANY ====')
        cy.interceptApi('updateDocument')
        cy.getTableCell('Internal Company', 1).then(($internalCompany) => {
            cy.wrap($internalCompany).get("#selectedValues").click()
            cy.get('#Documents').children().children().children().children().eq(2).scrollTo('right')
            cy.wrap($internalCompany).get("#searchForValue").type('924{enter}{esc}{esc}')
            cy.verifyApiResponse('@updateDocumentApi', { responseTimeout: 30000 })
        })


        cy.get('#Documents').children().children().children().children().eq(2).scrollTo('right')
        cy.log('==== STEP: UPDATE STATE ====')
        cy.interceptApi('updateDocument')
        cy.getTableCell('State', 1).then(($state) => {
            cy.wrap($state).get("#badgeValue").click()

            cy.get('.react-select__menu-list').children().eq(2).trigger("click", { force: true })
            cy.verifyApiResponse('@updateDocumentApi', { responseTimeout: 5000 })

            cy.get('.react-select__menu-list').children().eq(3).trigger("click", { force: true })
            cy.get('#Documents').children().children().children().children().eq(2).scrollTo('right')
            cy.wrap($state).get("#badgeValue").click()
            cy.verifyApiResponse('@updateDocumentApi', { responseTimeout: 5000 })

        })

    })

})