/* eslint-disable no-undef */

import { basic_timeouts } from "../../cypressUtils/data"

describe('Add Contact Spec', () => {
    it('passes', () => {
        // Constants 
        const { longTimeout } = basic_timeouts

        cy.viewport(1400, 900)
        cy.visit('http://localhost:3000/contacts')

        cy.checkAndLogin()

        cy.get('#addCampaignButton', { timeout: longTimeout }).should('be.visible')
        cy.wait(3000)


    })

})