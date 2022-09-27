/* eslint-disable no-undef */

import { basic_timeouts } from "../cypressUtils/data"

describe('Add And Remove Agreement Spec', () => {
    it('passes', () => {
        const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts

        cy.viewport(1400, 900)
        cy.visit('http://localhost:3000')

        cy.checkAndLogin('#workSpaceSignin')

        cy.get('.mapboxgl-canvas', { timeout: longTimeout }).should('be.visible').click()

        cy.get("#arrowBackIcon").click()

        cy.get('.mapboxgl-canvas').dblclick(653, 766, { force: true })
            .dblclick(663, 770, { force: true })
            .dblclick(663, 770, { force: true })
            .dblclick(663, 770, { force: true })
            .dblclick(716, 742, { force: true })
            .dblclick(716, 742, { force: true })
            .dblclick(736, 722, { force: true })
            .dblclick(746, 712, { force: true })
            .dblclick(746, 712, { force: true })

        cy.get("#mapEditIcon", { timeout: longTimeout }).should('be.visible').click()
        cy.wait(5000)
        cy.get("#mapRectangle").click()

        cy.get('.mapboxgl-canvas')
            .first()
            .wait(5000)
            .trigger("mousedown", 746, 712, { bubbles: false, force: true })
            .trigger("mousemove", 446, 612, {
                which: 1,
                force: true,
                bubbles: false,
            })
            .trigger("mouseup", 446, 612, { force: true })

        cy.createShapeLayer("Agreement")

        cy.get('#expandIcon').click()

        cy.wait(20000)
        cy.interceptApi('updateCustomLayer')

        cy.updateSummaryField('Agreement Number', '9123')

        cy.verifyApiResponse('@updateCustomLayerApi', { responseTimeout: longTimeout })

        cy.interceptApi('updateCustomLayer')
        cy.get("#expandCardVertIcon").click()
        cy.deleteConfirmation()

        cy.verifyApiResponse('@updateCustomLayerApi', { responseTimeout: longTimeout })

        cy.wait(1000)

    })

})