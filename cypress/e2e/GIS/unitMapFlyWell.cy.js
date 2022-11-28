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

        cy.log(`==== STEP:CLICK ON WELL TAB ====`)
        cy.interceptApi('tracksByObjectType')
        cy.interceptApi('getESPaginatedList')
        cy.get("[id='scrollable-auto-tab-3']").click()
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