/* eslint-disable no-undef */

describe('Verify Well Spec', () => {
    it('passes', () => {

        cy.viewport(1400, 900)

        cy.interceptApi('getESDocuments')
        cy.visit('http://localhost:3000/documents')

        cy.checkAndLogin()

        cy.get('#addDocument', { timeout: 50000 }).should('be.visible')

        cy.verifyApiResponse('@getESDocumentsApi', { responseTimeout: 5000 }).then((esDocumentResponse) => {
            const documentName = esDocumentResponse.response.body.data.getESFiles.hits[0]?.name

            cy.log('==== STEP: OPENING FILE DETAIL DRAWER ====')
            cy.get('table').contains('td', documentName).next().click();

            cy.log('==== STEP: ADD WELL ====')
            cy.get("#wellIcon").click()
            cy.addWell('black dog')

            cy.log('==== STEP: CLICK ON HOME ICON ====')
            cy.get('#wellHomeIcon').click()

            cy.clickWellIcon()

            cy.verifyApiResponse('@getWellsFromDocumentApi', { responseTimeout: 5000 }).then((wellsResponse) => {
                const wellsBeforeDocDelete = wellsResponse.response.body.data.getWellDescriptors[0].wells

                cy.log('==== STEP: CLICK ON HOME ICON ====')
                cy.get('#wellHomeIcon').click()

                cy.log('==== STEP: DELETE DOCUMENT ====')
                cy.get('#attachedDocument').trigger('mouseover')
                cy.get('#documentDeleteIcon').click({ force: true })
                cy.interceptApi('updateDocument')
                cy.get(".MuiButton-label").contains('Delete').click()
                cy.verifyApiResponse('@updateDocumentApi', { responseTimeout: 5000 })

                cy.log('==== STEP: UPLOAD NEW DOCUMENT ====')
                cy.interceptApi('AddDescriptorFile')
                cy.get('input[type=file]', { force: true }).selectFile('cypress/files/documentSample.png', {
                    force: true
                })
                cy.verifyApiResponse('@AddDescriptorFileApi', { responseTimeout: 5000 })

                cy.log('==== STEP: CLICK ON SAVE BUTTON ====')
                cy.interceptApi('updateDocument')
                cy.get(".MuiButton-label").contains('Save').click()
                cy.verifyApiResponse('@updateDocumentApi', { responseTimeout: 5000 })

                cy.log('==== STEP: OPENING SAME FILE DETAIL DRAWER ====')
                cy.get('table', { responseTimeout: 5000 }).contains('td', documentName).next().click({ force: true });

                cy.clickWellIcon()

                cy.verifyApiResponse('@getWellsFromDocumentApi', { responseTimeout: 5000 }).then((wellsResponse2) => {
                    const wellsAfterDocDelete = wellsResponse2.response.body?.data?.getWellDescriptors[0]?.wells

                    if (wellsAfterDocDelete && wellsAfterDocDelete.length !== wellsBeforeDocDelete.length)
                        throw new Error(`Wells are unattached after updating document`)

                })
            })
        })

    })


})