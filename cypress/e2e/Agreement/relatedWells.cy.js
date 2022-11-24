/* eslint-disable no-undef */

const { basic_timeouts } = require("../../cypressUtils/data")


describe('Related Wells Spec', () => {
    it('passes', () => {
        // Constants 
        const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts

        cy.viewport(1536, 960)

        cy.interceptApi('getESSimpleSearch')
        cy.visit('http://localhost:3000/land/agreements')

        cy.checkAndLogin()

        cy.get('#addButton', { timeout: longTimeout }).should('be.visible')

        cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout }).then(response => {
            const wellApiUrl = "https://m1search.search.windows.net/indexes/wellheader-index/docs?api-version=2020-06-30&queryType=full&count=true&%24filter=Latitude%20ne%20null%20and%20Longitude%20ne%20null&searchFields=WellName%2CApiNumber&$top=50&search=BRIT.-AMER.%20%26%20BOLSA~%20CHICA%2C%20%C3%82%E2%82%AC%C2%A6%201~"
            const relatedWellName = "BRIT.-AMER. & BOLSA CHICA, Â€¦ 1"

            cy.getTableCell('Agreement', 4).then(($row) => {
                cy.log('==== STEP: OPEN AGREEMENT ====')
                cy.wrap($row).scrollIntoView().children().eq(1).children().children().children().click()

                cy.get('.MuiTypography-root', { timeout: longTimeout }).contains('Summary').should('be.visible')

                cy.log('==== STEP: CLICK ON RELATED WELLS TAB ====')
                cy.wait(10000)
                cy.get("#wellsTab").click()

                cy.log('==== STEP: CLICK ON ADD RELATED WELLS BUTTON ====')
                cy.get("#addRelatedWellBtn", { timeout: longTimeout }).should('be.visible').click()

                cy.wait(2000)

                cy.log('==== STEP: SELECT WELLS TO ADD ====')
                cy.intercept(wellApiUrl).as('wellAPi')
                cy.get("[id='selectWell']").type(relatedWellName)
                cy.wait('@wellAPi', { responseTimeout: longTimeout }).then((interception) => {
                    assert.isNotNull(interception.response.body, '1st API call has data')
                })


                cy.interceptApi('getTenantWell')
                cy.get('body').type("{downArrow}{enter}")
                cy.verifyApiResponse('@getTenantWellApi', { responseTimeout: longTimeout })

                cy.interceptApi('getESPaginatedList')
                cy.log('==== STEP: CLICK ON ADD BUTTON ====')
                cy.interceptApi('AddShapeWellInterest')
                cy.get("#saveWellButton").click()

                cy.verifyApiResponse('@AddShapeWellInterestApi', { responseTimeout: extraTimeout }).then(response => {
                    cy.log('==== STEP: VERIFY IF WELL WAS ADDED  ====')
                    cy.verifyApiResponse('@getESPaginatedListApi', { responseTimeout: longTimeout }).then(response => {
                        const hits = response.response.body.data.getESPaginatedList.hits

                        const indexOfRelatedWell = hits.findIndex(hit => hit?.wellName === relatedWellName)

                        if (indexOfRelatedWell < 0)
                            throw new Error("Related Well not found")

                        cy.log('==== STEP: CLICK ON CHECKBOX OF WELL ====')
                        cy.get("#associatedWellsPerUnits").get(`[id=MUIDataTableSelectCell-${indexOfRelatedWell}]`).scrollIntoView().check()


                        cy.interceptApi('getESPaginatedList')

                        cy.log('==== STEP: DELETE RELATED WELL====')
                        cy.interceptApi('UpdateShapeWellInterest')
                        cy.get("#deleteWellInterest", { timeout: longTimeout }).click()
                        cy.get("#deleteButton", { timeout: longTimeout }).click()
                        cy.verifyApiResponse('@UpdateShapeWellInterestApi', { responseTimeout: longTimeout })


                        cy.log('==== STEP: VERIFY IF RELATED WELL WAS DELETED ====')
                        cy.verifyApiResponse('@getESPaginatedListApi', { responseTimeout: longTimeout }).then(response => {
                            const hits = response.response.body.data.getESPaginatedList.hits

                            if (hits && hits.length && hits.some(hit => hit?.wellName === relatedWellName))
                                throw new Error("Related Well still exist after delete")
                        })
                        cy.wait(5000)
                    })
                })
            })
        })

    })
})