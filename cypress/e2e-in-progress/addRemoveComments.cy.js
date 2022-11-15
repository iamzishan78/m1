/* eslint-disable no-undef */

import { basic_timeouts } from "../../cypressUtils/data"

describe('Add and Remove Comments Spec', () => {
    it('passes', () => {
        // Constants 
        const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts

        cy.viewport(1536, 960)

        cy.interceptApi('getESSimpleSearch')
        cy.visit('http://localhost:3000/land/agreements')

        cy.checkAndLogin()

        cy.get('#addButton', { timeout: longTimeout }).should('be.visible')

        cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout }).then(response => {

            cy.getTableCell('Agreement', 3).then(($row) => {
                cy.log('==== STEP: OPEN Agreement ====')
                cy.wrap($row).click()

                cy.get('.MuiTypography-root', { timeout: longTimeout }).contains('Summary').should('be.visible')
                cy.get("#metaDataButton", { timeout: longTimeout }).scrollIntoView().wait(1000).click()


                cy.interceptApi('UpsertComment')

                cy.get("#txtArea", { timeout: longTimeout }).should('be.visible').type("A cypress comment")
                cy.get("#commentButton").click()
                cy.verifyApiResponse('@UpsertCommentApi', { responseTimeout: longTimeout }).then(response => {
                    const commentId = response.response.body.data.upsertComment.comment._id

                    cy.get('#commentsContainer').scrollTo('bottom')

                    cy.interceptApi('removeComment')
                    cy.interceptApi('getCommentsByObjectId')

                    cy.get(`#${commentId}`).should('exist').scrollIntoView().trigger('mouseover')

                    cy.log('==== STEP: CLICK ON EXPAND ICON FOR COMMENT ====')
                    cy.get("#expandIcon").click({ force: true })

                    cy.log('==== STEP:CLICK ON DELTE COMMENT====')
                    cy.get("#deleteComment", { timeout: longTimeout }).click()

                    cy.log('==== STEP: VERIFY COMMENT IS DELETED ====')
                    cy.verifyApiResponse('@getCommentsByObjectIdApi', { responseTimeout: longTimeout })
                    cy.verifyApiResponse('@removeCommentApi', { responseTimeout: longTimeout })

                    cy.get(`#${commentId}`).should('not.exist');

                })

            })
        })

    })
})