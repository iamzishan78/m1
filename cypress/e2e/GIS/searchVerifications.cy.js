/* eslint-disable no-undef */

import { basic_timeouts } from "../../cypressUtils/data"

describe('Searches Verifications Spec', () => {
    it('passes', () => {
        const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts

        const searchStrings = {
            agreementName: "JA1234-AMEER AGMT",
            tractName: "BLK 39T2N SEC 22",
            unitName: "SP RR CO A-275"
        }

        cy.viewport(1400, 900)
        cy.visit('http://localhost:3000')

        cy.checkAndLogin('#workSpaceSignin')

        cy.log(`==== STEP:Search AGREEMENT BY NAME ${searchStrings.agreementName} ====`)
        cy.interceptApi('getCustomLayer')
        cy.searchOnMap('Agreements', searchStrings.agreementName)
        cy.verifyApiResponse('@getCustomLayerApi', { responseTimeout: longTimeout })

        cy.visit('http://localhost:3000')

        cy.log(`==== STEP:Search TRACT BY NAME ${searchStrings.tractName} ====`)
        cy.interceptApi('getCustomLayer')
        cy.searchOnMap('Tracts', searchStrings.tractName)
        cy.verifyApiResponse('@getCustomLayerApi', { responseTimeout: longTimeout })

        cy.visit('http://localhost:3000')

        cy.log(`==== STEP:Search UNIT BY NAME ${searchStrings.unitName} ====`)
        cy.interceptApi('getCustomLayer')
        cy.searchOnMap('Units', searchStrings.unitName)
        cy.verifyApiResponse('@getCustomLayerApi', { responseTimeout: longTimeout })

        cy.visit('http://localhost:3000')

        cy.log('==== STEP: CLICK ON SNAP GRID BUTTON ====')
        cy.get("#snapGridButton", { timeout: longTimeout }).should('be.visible').click()
        cy.get('#snapGrid', { timeout: longTimeout }).should('be.visible')

        cy.log(`==== STEP:Search AGREEMENT BY NAME ${searchStrings.agreementName} IN SNAPGRID ====`)
        cy.get('.MuiTypography-displayBlock').contains("Agreements").click()
        cy.get("#MapGridAgreementsTable", { timeout: longTimeout }).should('be.visible')
        cy.gridSearch(searchStrings.agreementName, 'getESSimpleSearch', "#mapGridCardSearch-basic")

        cy.log(`==== STEP:Search TRACT BY NAME ${searchStrings.tractName} IN SNAPGRID ====`)
        cy.get('.MuiTypography-displayBlock').contains("Tracts").click()
        cy.get("#MapGridTractsTable", { timeout: longTimeout }).should('be.visible')
        cy.gridSearch(searchStrings.tractName, 'getESSimpleSearch', "#mapGridCardSearch-basic")

        cy.log(`==== STEP:Search UNIT BY NAME ${searchStrings.unitName} IN SNAPGRID ====`)
        cy.get('.MuiTypography-displayBlock').contains("Units").click()
        cy.get("#MapGridUnitTable", { timeout: longTimeout }).should('be.visible')
        cy.gridSearch(searchStrings.unitName, 'getESSimpleSearch', "#mapGridCardSearch-basic")

    })

})