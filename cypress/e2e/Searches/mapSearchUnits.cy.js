/* eslint-disable no-undef */

import { basic_timeouts } from "../../cypressUtils/data"

describe('Map Search Agreements Spec', () => {
    it('passes', () => {
        const { longTimeout } = basic_timeouts

        const searchStrings = "SP RR CO A-275"

        cy.viewport(1400, 900)
        cy.visit('http://localhost:3000')

        cy.checkAndLogin('#workSpaceSignin')

        cy.log(`==== STEP:Search UNIT BY NAME ${searchStrings} ====`)
        cy.interceptApi('getCustomLayer')
        cy.searchOnMap('Units', searchStrings)
        cy.verifyApiResponse('@getCustomLayerApi', { responseTimeout: longTimeout })

    })

})