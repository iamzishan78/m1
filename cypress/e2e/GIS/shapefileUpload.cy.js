/* eslint-disable no-undef */

import { basic_timeouts } from "../../cypressUtils/data"

describe('Shape File Upload Spec', () => {
    it('passes', () => {
        const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts

        cy.viewport(1400, 900)
        cy.visit('http://localhost:3000')

        cy.checkAndLogin('#workSpaceSignin')

        cy.wait(10000)
        cy.get('#managerButton', { timeout: longTimeout }).should('be.visible').click()

        // cy.wait(1000)

        cy.get('#sourceManagerDiv', { timeout: longTimeout }).should('be.visible')

        cy.get('input[type=file]', { force: true }).selectFile("cypress/files/cypressford.zip", {
            force: true
        })

    })

})