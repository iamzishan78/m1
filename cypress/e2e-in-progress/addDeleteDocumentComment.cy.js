/* eslint-disable no-undef */

import { basic_timeouts } from "../cypressUtils/data"

describe('Add and Remove Comments on Document Spec', () => {
    it('passes', () => {

        // Constants 
        const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts

        cy.viewport(1920, 1080)

        cy.visit('http://localhost:3000/documents')

        
        cy.checkAndLogin()

        cy.interceptApi('getESDocuments')

        cy.verifyApiResponse('@getESDocumentsApi', { reponseTimeout: longTimeout }).then(response => {

            cy.get("tbody > tr:first-child td:nth-child(2)").click("right");
            cy.get("#fileInfoIcon", { reponseTimeout: shorTimeout }).should("be.visible").click();
            cy.interceptApi('UpsertComment')
            cy.get("#txtArea", { timeout: longTimeout }).should('exist').scrollIntoView().type("A cypress comment")
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