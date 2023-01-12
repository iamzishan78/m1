/* eslint-disable no-undef */

import { basic_timeouts } from "../../cypressUtils/data"

describe('Unit Map Fly To Spec', () => {
    it('passes', () => {
        const { longTimeout } = basic_timeouts

        cy.viewport(1400, 900)
        cy.visit('http://localhost:3000')

        cy.checkAndLogin('#workSpaceSignin')

        cy.log(`==== STEP:Search UNIT ====`)
        cy.interceptApi('getCustomLayer')
        cy.searchOnMap('Units', 'u')
        cy.verifyApiResponse('@getCustomLayerApi', { responseTimeout: longTimeout })

        cy.get("#expandIcon").click()
        cy.wait(2000)

        cy.log(`==== STEP:CLICK ON WELL TAB ====`)
        cy.interceptApi('tracksByObjectType')

        cy.get(".MuiTab-wrapper", { timeout: longTimeout }).contains('Wells').click()

        cy.log(`==== STEP:CLICK ON POTENTIAL WELLS ====`)
        cy.get("#PotentialWells", { timeout: longTimeout }).click()

        cy.log(`==== STEP:CLICK ON WELL CHECKBOX ====`)
        cy.get("[id='MUIDataTableSelectCell-0']", { timeout: longTimeout }).click()

        cy.wait(1000)

        cy.log(`==== STEP:CLICK ON ADD WELL ====`)
        cy.interceptApi('getESPaginatedList')
        cy.interceptApi('AddMultiWellInterestToShape')
        cy.get('#addWells', { timeout: longTimeout }).click()
        cy.verifyApiResponse('@AddMultiWellInterestToShapeApi', { responseTimeout: longTimeout })


        cy.verifyApiResponse('@tracksByObjectTypeApi', { responseTimeout: longTimeout })
        cy.verifyApiResponse('@getESPaginatedListApi', { responseTimeout: longTimeout }).then((esPaginatedListResponse) => {
            const hit = esPaginatedListResponse.response.body.data.getESPaginatedList.hits[0]

            const golbalWellId = hit.globalWell
            const wellId = hit._id

            cy.log(`==== STEP:CLICK ON MAP-FLY-TO ICON ====`)
            cy.interceptApi('getESPaginatedList')
            cy.interceptApi('getTenantWell')
            cy.interceptApi('getWellSummaryDetail')
            cy.get(`[id='map-fly-to-${wellId}']`, { timeout: longTimeout }).scrollIntoView().click({ force: true })
            cy.verifyApiResponse('@getESPaginatedListApi', { responseTimeout: longTimeout })
            cy.verifyApiResponse('@getTenantWellApi', { responseTimeout: longTimeout })
            cy.verifyApiResponse('@getWellSummaryDetailApi', { responseTimeout: longTimeout })

            cy.log(`==== STEP:VERIFY URL AND CARD ====`)
            cy.url().should('eq', `http://localhost:3000/map/wells/${golbalWellId}`)

            cy.get("#expandableCard", { timeout: longTimeout }).should('be.visible')

        })
    })

})