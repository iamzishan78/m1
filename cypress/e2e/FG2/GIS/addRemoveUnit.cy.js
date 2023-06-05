/* eslint-disable no-undef */

import { basic_timeouts } from "../../../cypressUtils/data"

describe('Add And Remove Tract Spec', () => {
    it('passes', () => {
        const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts

        cy.viewport(1400, 900)
        cy.visit('http://localhost:3000')

        cy.checkAndLogin('#workSpaceSignin')

        cy.get('.mapboxgl-canvas', { timeout: longTimeout }).should('be.visible').click()

        cy.get("#arrowBackIcon").click()

        cy.drawMapShape()

        cy.createShapeLayer("#unitBoundaryItem")

        cy.get('#expandIcon').click()

        cy.interceptApi('updateCustomLayer')
        cy.get("#expandCardVertIcon").click()
        cy.deleteConfirmation()

        cy.verifyApiResponse('@updateCustomLayerApi', { responseTimeout: longTimeout })

        cy.wait(1000)

    })

})