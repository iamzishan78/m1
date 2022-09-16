/* eslint-disable no-undef */

describe('Add and Remove Tract Spec', () => {
    it('passes', () => {
        cy.viewport(1400, 900)
        cy.visit('http://localhost:3000')

        cy.checkAndLogin('#workSpaceSignin')

        cy.get('.mapboxgl-canvas', { timeout: 50000 }).should('be.visible').click()

        cy.get("#arrowBackIcon").click()

        cy.get('.mapboxgl-canvas').dblclick(663, 770, { force: true })
            .dblclick(663, 770, { force: true })
            .dblclick(663, 770, { force: true })
            .dblclick(663, 770, { force: true })
            .dblclick(716, 742, { force: true })
            .dblclick(716, 742, { force: true })
            .dblclick(736, 722, { force: true })
            .dblclick(746, 712, { force: true })
            .dblclick(746, 712, { force: true })

        // cy.get('body').type('{ctrl}', { release: false })
        // cy.get('.mapboxgl-canvas').click(746, 712, { force: true })

        cy.get("#mapEditIcon", { timeout: 30000 }).should('be.visible').click()
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

        cy.interceptApi('updateCustomLayer')
        cy.get('.mapboxgl-canvas').click()
        cy.get('#parcel-button', { timeout: 30000 }).should('be.visible').click()
        cy.get(".MuiListItem-root", { timeout: 30000 }).contains("Tract").click()
        cy.get('.MuiBox-root', { timeout: 30000 }).should('be.visible')

        cy.get("#expandCardVertIcon").click()

        cy.deleteConfirmation()

        cy.verifyApiResponse('@updateCustomLayerApi', { responseTimeout: 5000 })

        cy.wait(5000)

    })

})