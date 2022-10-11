/* eslint-disable no-undef */

import { basic_timeouts } from "../../cypressUtils/data"

describe('Verify Well Spec', () => {
    it('passes', () => {
        const { longTimeout } = basic_timeouts

        cy.viewport(1400, 900)

        cy.interceptApi('getESDocuments')
        cy.visit('http://localhost:3000/documents')

        cy.checkAndLogin()

        cy.get('#addDocument', { timeout: longTimeout }).should('be.visible')

        cy.verifyApiResponse('@getESDocumentsApi', { responseTimeout: longTimeout }).then((esDocumentResponse) => {
            const documentName = esDocumentResponse.response.body.data.getESFiles.hits[0]?.name

            cy.log('==== STEP: OPENING FILE DETAIL DRAWER ====')
            cy.get('table', { timeout: 300000 }).contains('td', documentName).next().click({ timeout: 300000 });

            cy.log('==== STEP: ADD WELL ====')
            cy.get("#wellIcon", { timeout: 300000 }).click({ timeout: 300000 })
            cy.addWell('black dog')

            cy.log('==== STEP: CLICK ON HOME ICON ====')
            cy.get('#wellHomeIcon', { timeout: 300000 }).click({ timeout: 300000 })

            cy.clickWellIcon()

            cy.verifyApiResponse('@getWellsFromDocumentApi', { responseTimeout: longTimeout }).then((wellsResponse) => {
                const wellsBeforeDocDelete = wellsResponse.response.body.data.getWellDescriptors[0].wells

                cy.log('==== STEP: CLICK ON HOME ICON ====')
                cy.get('#wellHomeIcon').click()

                cy.log('==== STEP: DELETE DOCUMENT ====')
                cy.get('#attachedDocument').trigger('mouseover')
                cy.get('#documentDeleteIcon').click({ force: true })
                cy.interceptApi('updateDocument')
                cy.get(".MuiButton-label").contains('Delete').click()
                cy.verifyApiResponse('@updateDocumentApi', { responseTimeout: longTimeout })

                cy.log('==== STEP: UPLOAD NEW DOCUMENT ====')
                cy.interceptApi('AddDescriptorFile')
                cy.get('input[type=file]', { force: true }).selectFile('cypress/files/documentSample.png', {
                    force: true
                })
                cy.verifyApiResponse('@AddDescriptorFileApi', { responseTimeout: longTimeout })

                cy.log('==== STEP: CLICK ON SAVE BUTTON ====')
                cy.interceptApi('updateDocument')
                cy.get("#documentSaveButton").click()
                cy.verifyApiResponse('@updateDocumentApi', { responseTimeout: longTimeout })

                cy.get('#documentSaveButton', { responseTimeout: longTimeout }).then($button => {
                    if ($button.is(':visible')) {
                        cy.wait(1000)
                        cy.get("#documentSaveButton").click()
                    }
                })

                cy.log('==== STEP: OPENING SAME FILE DETAIL DRAWER ====')
                cy.get('table', { responseTimeout: longTimeout }).contains('td', documentName).next().click();

                cy.clickWellIcon()

                cy.verifyApiResponse('@getWellsFromDocumentApi', { responseTimeout: longTimeout }).then((wellsResponse2) => {
                    const wellsAfterDocDelete = wellsResponse2.response.body?.data?.getWellDescriptors[0]?.wells

                    if (wellsAfterDocDelete && wellsAfterDocDelete.length !== wellsBeforeDocDelete.length)
                        throw new Error(`Wells are unattached after updating document`)

                })
            })
        })

    })


})