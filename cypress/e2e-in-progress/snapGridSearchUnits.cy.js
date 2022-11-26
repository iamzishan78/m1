/* eslint-disable no-undef */

import { basic_timeouts } from "../cypressUtils/data"

describe('SnapGrid Search Units Spec', () => {
    it('passes', () => {
        const { longTimeout } = basic_timeouts

        const searchStrings = "SP RR CO A-275"

        cy.viewport(1400, 900)
        cy.visit('http://localhost:3000')

        cy.checkAndLogin('#workSpaceSignin')

        cy.log('==== STEP: CLICK ON SNAP GRID BUTTON ====')
        cy.get("#snapGridButton", { timeout: longTimeout }).should('be.visible').click()
        cy.get('#snapGrid', { timeout: longTimeout }).should('be.visible')

        cy.log(`==== STEP:Search UNIT BY NAME ${searchStrings} IN SNAPGRID ====`)
        cy.get('.MuiTypography-displayBlock').contains("Units").click()
        cy.get("#MapGridUnitTable", { timeout: longTimeout }).should('be.visible')
        cy.gridSearch(searchStrings, 'getESSimpleSearch', "#mapGridCardSearch-basic")

    })

})