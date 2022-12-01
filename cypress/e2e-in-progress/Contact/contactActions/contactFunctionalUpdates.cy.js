/* eslint-disable no-undef */

/* 
Then verify if the appear on grid
*/

import { contactObj, basic_timeouts, associatedDataList } from "../../../cypressUtils/data"

describe('Contact Functional Updates Spec', () => {
    it('passes', () => {
        // Constants 
        const { longTimeout } = basic_timeouts

        cy.viewport(1400, 900)
        // cy.log('[green](http://example.com)')
        cy.interceptApi('getESSimpleSearch')
        cy.visit('http://localhost:3000/contacts')
        cy.reload()
        cy.checkAndLogin()

        cy.get('#addButton', { timeout: longTimeout }).should('be.visible')
        cy.wait(3000)

        cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout }).then(response => {
            const hits = response.response.body.data.getESSimpleSearch.hits
            const contactToUpdate = hits.find(hit => hit.name === contactObj.name.value)

            if (!contactToUpdate)
                throw new Error('Sample contact not found, Run addContact spec first!!!');

            const indexOfSampleContact = hits.findIndex(hit => hit._id === contactToUpdate._id) + 1

            cy.getTableCell("Name", indexOfSampleContact).then(($name) => {
                const fullName = `${contactToUpdate.name}`

                cy.log('==== STEP: OPEN CONTACT DETAIL ====')
                cy.wrap($name).contains(fullName).should('exist').click()
            })

            cy.log('==== STEP: TYPE IN COMMENT BOX ====')
            cy.get("#txtArea").type("Test Comment")

            cy.interceptApi('UpsertComment')
            cy.interceptApi('getCommentsByObjectId')

            cy.log('==== STEP: CLICK ON COMMENT BUTTON ====')
            cy.get(".MuiButton-label").contains("Comment").click()

            cy.log('==== STEP: VERIFY COMMENT IS ADDED ====')
            cy.verifyApiResponse('@getCommentsByObjectIdApi', { responseTimeout: longTimeout })

            cy.verifyApiResponse('@UpsertCommentApi', { responseTimeout: longTimeout }).then(response => {
                const comment = response.response.body.data.upsertComment.comment

                cy.get(`#${comment._id}`).should('be.visible')

                cy.interceptApi('removeComment')
                cy.interceptApi('getCommentsByObjectId')

                cy.get("#commentsArea").trigger('mouseover')

                cy.log('==== STEP: CLICK ON EXPAND ICON FOR COMMENT ====')
                cy.get("#expandCommentActionIcon").click({ force: true })

                cy.log('==== STEP:CLICK ON DELTE COMMENT====')
                cy.get("#deleteComment", { timeout: longTimeout }).click()

                cy.log('==== STEP: VERIFY COMMENT IS DELETED ====')
                cy.verifyApiResponse('@getCommentsByObjectIdApi', { responseTimeout: longTimeout })
                cy.verifyApiResponse('@removeCommentApi', { responseTimeout: longTimeout })

                cy.get(`#${comment._id}`).should('not.exist');

            })

            cy.log('==== STEP: ADD DOCUMENT ====')
            cy.interceptApi('AddDescriptorFile')

            cy.get('input[type=file]', { force: true }).selectFile(contactObj.fileAddress, {
                force: true
            })
            cy.verifyApiResponse('@AddDescriptorFileApi')

            cy.get("[id='Full Name']", { timeout: longTimeout }).should('be.visible')

            cy.get("#closeIcon").click()

            associatedDataList.forEach(listItem => {
                cy.interceptApi(listItem.operationName)
                cy.get(`[id='${listItem.name}']`).click({ force: true })
                cy.verifyApiResponse(`@${listItem.operationName}Api`, { responseTimeout: longTimeout })
                cy.get(`#${listItem.verifyElementId}`).should('exist');
            })

            cy.log('==== STEP: REMOVE DOCUMENT ====')
            cy.interceptApi('deleteDescriptorFile')
            cy.get("[id='sample.pdfdeleteIcon']", { timeout: longTimeout }).click()
            cy.get(".MuiButton-label").contains("Delete").click()
            cy.verifyApiResponse('@deleteDescriptorFileApi')

            cy.log('==== STEP: OPEN DEAL ====')
            cy.interceptApi('getContactDeals')
            cy.get(`[id='Deals']`).click({ force: true })
            cy.verifyApiResponse('@getContactDealsApi')
            cy.get(".MuiButton-label").contains('+ ADD DEAL', { timeout: longTimeout }).should('exist')

            cy.log('==== STEP: OPEN CONTACT INFO ====')
            cy.interceptApi('getESFilterList')

            cy.get(`[id='Contact Info']`).click({ force: true })
            cy.verifyApiResponse('@getESFilterListApi')
            cy.get(".MuiGrid-root").contains('Basic Info', { timeout: longTimeout }).should('exist')

            cy.log('==== STEP: OPEN META DRAWER ====')
            cy.get("#ArrowBackIosIcon").click()
            cy.get("#closeIcon", { timeout: longTimeout }).should('be.visible')

            cy.interceptApi('UpdateContact')
            cy.log('==== STEP: DELETE CONTACT ====')
            cy.get("#MoreHorizIcon").click()
            cy.get(".MuiButtonBase-root").contains('Delete contact').click()
            cy.get(".MuiButton-label").contains('Delete').click()
            cy.verifyApiResponse('@UpdateContactApi')

            cy.get('#addButton', { timeout: longTimeout }).should('be.visible')
        })

    })

})