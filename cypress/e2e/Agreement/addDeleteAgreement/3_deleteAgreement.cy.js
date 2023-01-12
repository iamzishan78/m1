/* eslint-disable no-undef */

import { basic_timeouts, agreementObj } from "../../../cypressUtils/data"

describe('Delete Agreement Spec', () => {
    it('passes', () => {
        const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts

        cy.viewport(1536, 960)
        cy.visit('http://localhost:3000/land/agreements')

        cy.checkAndLogin()

        cy.get('#addButton', { timeout: longTimeout }).should('be.visible')

        cy.deleteAndVerifyAgreement(agreementObj.agreementName.value, agreementObj.agreementNumber.value)


    })

})