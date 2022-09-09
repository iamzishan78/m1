/* eslint-disable no-undef */

describe('Document Grid Spec', () => {
    it('passes', () => {
        cy.viewport(1400, 900)
        cy.visit('http://localhost:3000/documents')

        cy.checkAndLogin('#workSpaceSignin')

        cy.get('#addDocument', { timeout: 50000 }).should('be.visible')
        cy.wait(3000)

        cy.get('#Documents').children().children().children().children().eq(2).scrollTo('right')
        cy.wait(1000)

        cy.interceptApi('updateDocument')

        cy.get('.MuiTableBody-root').children().eq(1).children().eq(9).trigger("click").type('924{enter}{esc}{esc}')

        cy.verifyApiResponse('@updateDocumentApi', { responseTimeout: 30000 })
        cy.get('#Documents').children().children().children().children().eq(2).scrollTo('right')

        cy.get('.MuiTableBody-root').children().eq(1).children().eq(10).trigger("click")

        cy.get('.react-select__menu-list').children().eq(2).trigger("click", { force: true })
        cy.verifyApiResponse('@updateDocumentApi', { responseTimeout: 5000 })

        cy.get('.react-select__menu-list').children().eq(3).trigger("click", { force: true })
        cy.verifyApiResponse('@updateDocumentApi', { responseTimeout: 5000 })

        cy.get('#Documents').children().children().children().children().eq(2).scrollTo('right')
        cy.get('.MuiTableBody-root').children().eq(1).children().eq(10).type('{esc}')
    })

})