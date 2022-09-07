/* eslint-disable no-undef */

describe('Add Document Spec', () => {
    it('passes', () => {
        cy.viewport(1400, 900)
        cy.visit('http://localhost:3000')

        cy.checkAndLogin('#workSpaceSignin')

        cy.get('.mapboxgl-canvas', { timeout: 50000 }).should('be.visible').click()

        //  cy.wait(5000)

        cy.get("#arrowBackIcon").click()

        cy.get("#mapEditIcon").click()
        // cy.wait(5000)
        // cy.get("#mapRectangle").click()

        // cy.get('.mapboxgl-canvas').dblclick(663, 770, { force: true })
        //     .dblclick(663, 770, { force: true })
        //     .dblclick(663, 770, { force: true })
        //     .dblclick(663, 770, { force: true })
        //     .dblclick(716, 742, { force: true })
        //     .dblclick(716, 742, { force: true })
        //     .dblclick(736, 722, { force: true })
        //     .dblclick(746, 712, { force: true })
        //     .dblclick(746, 712, { force: true })
        //     .dblclick(746, 712, { force: true })
        //     .dblclick(746, 712, { force: true })
        //     .click(746, 712, { force: true })

        cy.wait(1000)
        // cy.get('body').type('{ctrl}', { release: false })
        // cy.get('.mapboxgl-canvas').click(746, 712, { force: true })

        cy.get("#mapRectangle").click()

        cy.get('.mapboxgl-canvas')
            .first()
            .wait(5000)
            .trigger("mousedown", 746, 712, { bubbles: false, force: true })
            .trigger("mousemove", 546, 512, {
                which: 1,
                force: true,
                bubbles: false,
            })
            .trigger("mouseup", 480, 500, { force: true })

        cy.wait(1000)
        cy.get('.mapboxgl-canvas').trigger("click",)



    })

})