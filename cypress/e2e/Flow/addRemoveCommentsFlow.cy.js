/* eslint-disable no-undef */

import { basic_timeouts } from "../../cypressUtils/data"

describe('Add and Remove Comments on Flow Deal Spec', () => {
    it('passes', () => {

        // Constants 
        const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts

        cy.viewport(1400, 900)

        cy.interceptApi('getPipeline')
        cy.visit('http://localhost:3000/flow')

        cy.checkAndLogin()

        cy.get('article', { timeout: longTimeout }).should('be.visible')

        cy.verifyApiResponse('@getPipelineApi', { responseTimeout: longTimeout }).then(response => {
            console.log(" Response ", response);
            cy.get("article").first().trigger("click");
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
                    cy.get("#expandCommentActionIcon").click({ force: true })

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