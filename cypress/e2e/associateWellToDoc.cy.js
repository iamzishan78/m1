/* eslint-disable no-undef */

describe('Associate Well Spec', () => {
    it('passes', () => {
        cy.viewport(1400, 900)
        cy.visit('http://localhost:3000/documents')

        cy.checkAndLogin('#workSpaceSignin')

        cy.get('#addDocument', { timeout: 50000 }).should('be.visible')

        cy.wait(1000)
        cy.get('tbody>tr').eq(2).children().eq(3).children().eq(1).click()

        cy.get("#wellIcon").click()

        cy.interceptApi('addWellToFileDescriptor')
        cy.interceptApi('getWellsFromDocument')

        cy.get("#addIcon").click()
        cy.typeAndSelect('#wellSearch', 'anniemae')
        cy.verifyApiResponse('@addWellToFileDescriptorApi')
        cy.verifyApiResponse('@getWellsFromDocumentApi')


        cy.get("#addIcon").click()
        cy.typeAndSelect('#wellSearch', 'silver dog')
        cy.verifyApiResponse('@addWellToFileDescriptorApi')
        cy.verifyApiResponse('@getWellsFromDocumentApi')

        cy.get('#wellsList').children().eq(0).click()

        cy.wait(40000)
        cy.get('.MuiBreadcrumbs-ol', { timeout: 50000 }).should('be.visible').children().eq(0).click()

    })

})