/* eslint-disable no-undef */

import { basic_timeouts } from "../../cypressUtils/data"

describe('Searches Verifications Spec', () => {
    it('passes', () => {
        const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts

        cy.viewport(1400, 900)
        cy.visit('http://localhost:3000')

        cy.checkAndLogin('#workSpaceSignin')


    })

})