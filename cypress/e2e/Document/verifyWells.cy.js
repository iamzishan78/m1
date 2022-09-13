/* eslint-disable no-undef */

describe('Verify Well Spec', () => {
    it('passes', () => {
        cy.viewport(1400, 900)
        cy.visit('http://localhost:3000/documents')

        cy.interceptApi('getESDocuments')
        cy.visit('http://localhost:3000/documents')

        cy.checkAndLogin()

        cy.get('#addDocument', { timeout: 50000 }).should('be.visible')

        cy.verifyApiResponse('@getESDocumentsApi').then((response) => {
            const firstRecord = response.response.body.data.getESFiles.hits[0]
            const { name } = firstRecord;

            cy.log('==== STEP: OPENING FILE DETAIL DRAWER ====')
            cy.get('table').contains('td', name).next().click();

            cy.log('==== STEP: ADD WELL ====')
            cy.get("#wellIcon").click()

            cy.addWell('black dog')

            cy.get('#closeIcon').click({ force: true })

            cy.get('table').contains('td', name).next().click();

            // cy.get('tbody>tr', { timeout: 5000 }).eq(2).children().eq(3).children().eq(1).click({ force: true })

            cy.get('#attachedDocument').trigger('mouseover')

            cy.get('#documentDeleteIcon').click({ force: true })
            cy.interceptApi('updateDocument')

            cy.get(".MuiButton-label").contains('Delete').click()
            cy.verifyApiResponse('@updateDocumentApi', { responseTimeout: 5000 })

            cy.interceptApi('AddDescriptorFile')

            cy.get('input[type=file]', { force: true }).selectFile('cypress/files/documentSample.png', {
                force: true
            })

            cy.verifyApiResponse('@AddDescriptorFileApi', { responseTimeout: 5000 })


            cy.wait(1000)
            cy.interceptApi('updateDocument')
            cy.get(".MuiButton-label").contains('Save').click()
            cy.verifyApiResponse('@updateDocumentApi', { responseTimeout: 5000 })



            cy.get('table').contains('td', name).next().click();

        })




    })

})