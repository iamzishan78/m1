/* eslint-disable no-undef */

/* 

Then verify if the appear on grid
*/

import { contactObj, basic_timeouts } from "../../../cypressUtils/data"

describe('Contact Functional Updates Spec', () => {
    it('passes', () => {
        // Constants 
        const { longTimeout } = basic_timeouts

        cy.viewport(1400, 900)
        cy.log('[green](http://example.com)')
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

            // cy.log('==== STEP: TYPE IN COMMENT BOX ====')
            // cy.get("#txtArea").type("Test Comment")

            // cy.interceptApi('UpsertComment')
            // cy.interceptApi('getCommentsByObjectId')

            // cy.log('==== STEP: CLICK ON COMMENT BUTTON ====')
            // cy.get(".MuiButton-label").contains("Comment").click()

            // cy.log('==== STEP: VERIFY COMMENT IS ADDED ====')
            // cy.verifyApiResponse('@getCommentsByObjectIdApi', { responseTimeout: longTimeout })

            // cy.verifyApiResponse('@UpsertCommentApi', { responseTimeout: longTimeout }).then(response => {
            //     const comment = response.response.body.data.upsertComment.comment

            //     cy.get(`#${comment._id}`).should('be.visible')

            //     cy.interceptApi('removeComment')
            //     cy.interceptApi('getCommentsByObjectId')

            //     cy.get("#commentsArea").trigger('mouseover')

            //     cy.log('==== STEP: CLICK ON EXPAND ICON FOR COMMENT ====')
            //     cy.get("#expandIcon").click({ force: true })

            //     cy.log('==== STEP:CLICK ON DELTE COMMENT====')
            //     cy.get("#deleteComment", { timeout: longTimeout }).click()

            //     cy.log('==== STEP: VERIFY COMMENT IS DELETED ====')
            //     cy.verifyApiResponse('@getCommentsByObjectIdApi', { responseTimeout: longTimeout })
            //     cy.verifyApiResponse('@removeCommentApi', { responseTimeout: longTimeout })

            //     cy.get(`#${comment._id}`).should('not.exist');

            // })

        })

    })

})