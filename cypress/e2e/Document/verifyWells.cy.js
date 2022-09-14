/* eslint-disable no-undef */
import promisify from 'cypress-promise'

describe('Verify Well Spec', () => {
    it('passes', async () => {

        cy.viewport(1400, 900)
        cy.visit('http://localhost:3000/documents')

        cy.interceptApi('getESDocuments')
        cy.visit('http://localhost:3000/documents')

        cy.checkAndLogin()

        cy.get('#addDocument', { timeout: 50000 }).should('be.visible')
        //  const foo = await cy.wrap('foo').promisify()

        const esDocumentResponse = await promisify(cy.wait('@getESDocumentsApi'))
        const documentName = esDocumentResponse.response.body.data.getESFiles.hits[0]?.name

        cy.log('==== STEP: OPENING FILE DETAIL DRAWER ====')
        cy.get('table').contains('td', documentName).next().click();

        cy.log('==== STEP: ADD WELL ====')
        cy.get("#wellIcon").click()

        cy.addWell('black dog')

        cy.get('#wellHomeIcon').click()

        cy.interceptApi('getWellsFromDocument')
        cy.get("#wellIcon").click()
        //  const getWells = cy.verifyApiResponse('@getWellsFromDocumentApi', { responseTimeout: 5000 }).promisify()
        let getWellsResponse = await promisify(cy.wait('@getWellsFromDocumentApi'))
        console.log("getWellsResponse : ", getWellsResponse)
        let wellsBeforeDocDelete = getWellsResponse.response.body.data.getWellDescriptors
        console.log("wellsBeforeDocDelete : ", wellsBeforeDocDelete)

        cy.get('#wellHomeIcon').click()

        // cy.get('table').contains('td', documentName).next().click();

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
        cy.wait(3000)


        cy.get('table').contains('td', documentName).next().click({ force: true });

        cy.interceptApi('getWellsFromDocument')
        cy.get("#wellIcon").click()
        //  const getWells = cy.verifyApiResponse('@getWellsFromDocumentApi', { responseTimeout: 5000 }).promisify()
        getWellsResponse = await promisify(cy.wait('@getWellsFromDocumentApi'))
        console.log("getWellsResponse after: ", getWellsResponse)
        let wellsAfterDocDelete = getWellsResponse.response.body.data.getWellDescriptors
        console.log("wellsAfterDocDelete : ", wellsAfterDocDelete)



    })


})