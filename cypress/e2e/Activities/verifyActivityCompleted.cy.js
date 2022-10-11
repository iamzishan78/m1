/* eslint-disable no-undef */

import { basic_timeouts } from "../../cypressUtils/data"

describe('Verify Activity Completed Spec', () => {
    it('passes', () => {
        // Constants 
        const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts

        cy.viewport(1400, 900)

        cy.interceptApi('getESSimpleSearch')
        cy.visit('http://localhost:3000/calendar/activities')
        cy.checkAndLogin()

        cy.log('==== STEP: CLICK ON LIST VIEW  ICON ====');
        cy.get('#listView', { timeout: longTimeout }).should('be.visible').click()
        cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout })

        cy.get('#activitiesTable', { timeout: longTimeout }).should('be.visible')

        cy.getTableCell('Completed?', 1).then(($tableCell) => {
            cy.log('==== STEP: OPEN ACTIVIY MODEL ====');
            cy.wrap($tableCell).scrollIntoView().click({ force: true })

            cy.log('==== STEP: CLICK ON MARK AS DONE ICON ====');
            cy.interceptApi('updateActivity')
            cy.get('#markAsDone', { timeout: longTimeout }).check({ force: true })

            cy.log('==== STEP: CLICK ON SAVE BUTTON ====');
            cy.get("#addSaveButton").click({ force: true })
            cy.verifyApiResponse('@updateActivityApi', { responseTimeout: longTimeout })

            cy.log('==== STEP: VERIFY IF CHECK ICON APEAR FOR ACTIVITY ====');
            cy.wrap($tableCell).get("#checkIcon").should('exist')
        })
    })
})