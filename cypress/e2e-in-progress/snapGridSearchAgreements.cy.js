/* eslint-disable no-undef */

import { basic_timeouts } from "../../cypressUtils/data"

describe('SnapGrid Search Agreements Spec', () => {
    it('passes', () => {
        const { longTimeout } = basic_timeouts

        const searchStrings = "JA1234-AMEER AGMT"

        cy.viewport(1400, 900)
        cy.visit('http://localhost:3000')

        cy.checkAndLogin('#workSpaceSignin')

        cy.log('==== STEP: CLICK ON SNAP GRID BUTTON ====')
        cy.get("#snapGridButton", { timeout: longTimeout }).should('be.visible').click()
        cy.get('#snapGrid', { timeout: longTimeout }).should('be.visible')

        cy.log(`==== STEP:Search AGREEMENT BY NAME ${searchStrings} IN SNAPGRID ====`)
        cy.get('.MuiTypography-displayBlock').contains("Agreements").click()
        cy.get("#MapGridAgreementsTable", { timeout: longTimeout }).should('be.visible')
        cy.gridSearch(searchStrings, 'getESSimpleSearch', "#mapGridCardSearch-basic")

    })

})