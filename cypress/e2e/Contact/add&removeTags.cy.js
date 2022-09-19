/* eslint-disable no-undef */

import { basic_timeouts } from "../../cypressUtils/data"

/*  ADD AND REMOVE TAGS FORM CONTACTS
launch contacts 
click contacts tag module 
add test tag 
launch detail contact card 
remove test tag
breadcrumb back
launch new contact detail
add test tag
breadcrumb back
launch tagger on grid 
remove tag */


describe('Add and Remove Tags Grid Spec', () => {
    it('passes', () => {
        // Constants 
        const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts

        cy.viewport(1400, 900)
        cy.visit('http://localhost:3000/contacts')

        cy.checkAndLogin()

        cy.get('#addButton', { timeout: longTimeout }).should('be.visible')

        cy.getTableCell('Tags', 1).then(($tagger) => {
            let tagName = "Test Tag1"

            cy.log('==== STEP: SCROLL TO TOP RIGHT ====')
            cy.scrollGridTo('topRight', '#Contacts')

            cy.log('==== STEP: OPEN TAGGER ====')
            cy.wrap($tagger).click()

            cy.log('==== STEP: SELECT AND ENTER TAG ====')
            cy.get('#tags-outlined', { timeout: longTimeout }).click().wait(1000).type(tagName).type('{downArrow}{enter}')
            cy.wait(2000)

            cy.log('==== STEP: VERIFY ADDED TAG ====')
            cy.get('.MuiChip-label', { timeout: shorTimeout }).contains(tagName).should('be.visible')
            cy.wait(2000)
            cy.get('body').type('{esc}{esc}')

            cy.log('==== STEP: OPEN CONTACT DETAIL ====')
            cy.getTableCell('Name', 2).click()

            cy.log('==== STEP: REMOVE TAG ====')
            cy.get('.MuiGrid-root', { timeout: longTimeout }).contains('Total Offer Price').should('be.visible')
            cy.wait(2000)
            cy.get('.MuiChip-label', { timeout: longTimeout }).contains(tagName).siblings().click()

            cy.log('==== STEP: CLICK ON A BREADCRUM ====')
            cy.get('.MuiTypography-root').contains('Contacts').click()
            cy.get('#addButton', { timeout: longTimeout }).should('be.visible')
            tagName = "Test Tag2"
            cy.log('==== STEP: OPEN ANOTHER CONTACT DETAIL ====')
            cy.getTableCell('Name', 3).click()

            cy.log('==== STEP: SELECT AND ENTER TAG ====')
            cy.get('#tags-outlined', { timeout: longTimeout }).click().wait(1000).type(tagName).type('{downArrow}{enter}')

            cy.log('==== STEP: VERIFY ADDED TAG ====')
            cy.wait(5000)
            cy.get('.MuiChip-label', { timeout: longTimeout }).contains(tagName).should('be.visible')

            cy.log('==== STEP: CLICK ON A BREADCRUM ====')
            cy.get('.MuiTypography-root').contains('Contacts').click()
            cy.get('#addButton', { timeout: longTimeout }).should('be.visible')

            cy.getTableCell('Tags', 3).then(($tagger) => {
                cy.log('==== STEP: SCROLL TO TOP RIGHT ====')
                cy.scrollGridTo('topRight', '#Contacts')

                cy.log('==== STEP: OPEN TAGGER ====')
                cy.wrap($tagger).click()

                cy.wait(2000)
                cy.log('==== STEP: REMOVE TAG ====')
                cy.get('.MuiChip-label', { timeout: longTimeout }).contains(tagName).siblings().click()

                cy.get('body').type('{esc}{esc}')
            })
        })
    })
})