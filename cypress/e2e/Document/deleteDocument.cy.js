/* eslint-disable no-undef */

describe('Delete Document Spec', () => {
    it('passes', () => {
        cy.viewport(1400, 900)

        cy.interceptApi('getESDocuments')
        cy.visit('http://localhost:3000/documents')

        cy.checkAndLogin()

        cy.get('#addDocument', { timeout: 50000 }).should('be.visible')

        cy.verifyApiResponse('@getESDocumentsApi').then((response) => {
            const firstRecord = response.response.body.data.getESFiles.hits[0]
            const { name } = firstRecord;

            cy.log('==== STEP: OPENING FILE DETAIL DRAWER ====')
            cy.get('table').contains('td', name).next().click();

            cy.log('==== STEP: CLICKING ON HORIZON ICON ====')
            cy.get("#fileDetailHorzIcon").click()

            cy.interceptApi('updateDocument')
            cy.deleteConfirmation()
            cy.verifyApiResponse('@updateDocumentApi')
        })


    })

})