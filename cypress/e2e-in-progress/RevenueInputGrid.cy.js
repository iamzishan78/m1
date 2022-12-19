/* eslint-disable no-undef */

import { basic_timeouts } from "../../cypressUtils/data"

// Constants
const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts

describe('Open Revenue Property Detail Card  Spec', () => {
    it('passes', () => {
        cy.viewport(1400, 900)

        cy.interceptApi('getESSimpleSearch')
        cy.visit('http://localhost:3000/revenue/statements')

        cy.checkAndLogin()

        cy.get('#addButton', { timeout: longTimeout }).should('be.visible')

        cy.log('==== STEP: CLOSE THE SIDE BAR ===')
        cy.get("#menuIcon").click()

        cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout }).then(esSimpleSearchResult => {
            const simpleSearchHits = esSimpleSearchResult.response.body.data.getESSimpleSearch.hits
            const indexOfStatement = simpleSearchHits.findIndex(hit => hit?.checkDetail?.lines < 5) + 1


            cy.log('==== STEP: OPEN REVENUE CHECK DETAIL ===')
            cy.getTableCell('Check Number', indexOfStatement).then(($row) => {
                cy.wrap($row).scrollIntoView().children().eq(1).children().click()

                cy.log('==== STEP: CLICKING ON INPUT BUTTON ===')
                cy.interceptApi('getESPaginatedList')
                cy.interceptApi('getESCount')
                cy.get("#inputModeButton", { timeout: longTimeout }).scrollIntoView().wait(5000).trigger("click")
                cy.verifyApiResponse('@getESCountApi', { responseTimeout: longTimeout })


                cy.verifyApiResponse('@getESPaginatedListApi', { responseTimeout: longTimeout }).then(result => {
                    const index = (result.response.body.data.getESPaginatedList.total) + 1

                    cy.log('==== STEP: CLOSE PDF ===')
                    cy.get("#closePdfIcon", { timeout: longTimeout }).click()

                    cy.log('==== STEP: ADD NEW LINE ITEM BUTTON ===')
                    cy.interceptApi('getESFilterList')
                    cy.get("#addNewLineItemButton", { timeout: longTimeout }).wait(5000).click()

                    cy.log('==== STEP: SELECT PROPERTY FIELD FROM TABLE ===')
                    cy.interceptApi('getESPaginatedList')
                    cy.addAutoCompleteField(index, 'Property #')
                    cy.verifyApiResponse('@getESPaginatedListApi', { responseTimeout: longTimeout })

                    cy.wait(5000)

                    cy.log('==== STEP: SELECT SALES DATE ===')
                    cy.getTableCell('Sales Date', index).then(($checkDetailRow) => {
                        cy.interceptApi('updateCheckDetail')
                        cy.wrap($checkDetailRow).click()
                        cy.wait(2000)
                        cy.wrap($checkDetailRow).get("#dateType").invoke('val', "2022-11-02 {enter}")
                        cy.wrap($checkDetailRow).get("#dateType").dblclick().wait(1000).click().click().dblclick()
                        cy.get(".MuiTypography-root").contains('Check Details').wait(1000).click()

                        cy.wrap($checkDetailRow).click()

                        cy.wrap($checkDetailRow).get("#dateType").dblclick().wait(1000).click().click().dblclick()
                        cy.get(".MuiTypography-root").contains('Check Details').wait(1000).click()

                        // cy.wrap($checkDetailRow).click()

                        // cy.wrap($checkDetailRow).get("#dateType").dblclick().wait(1000).click().click().dblclick()
                        // cy.get(".MuiTypography-root").contains('Check Details').wait(1000).click()

                        // cy.verifyApiResponse('@updateCheckDetailApi', { responseTimeout: longTimeout })
                    })

                    cy.addAutoCompleteField(index, 'Product')

                    cy.log('==== STEP: ENTER DECIMAL INTEREST ===')
                    cy.getTableCell('Decimal Interest', index).then(($checkDetailRow) => {
                        cy.interceptApi('updateCheckDetail')
                        cy.wrap($checkDetailRow).children().children().eq(1).scrollIntoView().type('1231 {enter}', { force: true })
                        cy.verifyApiResponse('@getESFilterListApi', { responseTimeout: longTimeout })
                    })

                    cy.addAutoCompleteField(index, 'Type')
                    cy.wait(5000)
                    cy.addAutoCompleteField(index, 'Type')

                    cy.log('==== STEP: CLICK ON EXIT BUTON ===')
                    cy.interceptApi('getESSimpleSearch')
                    cy.get("#exitButton", { timeout: longTimeout }).scrollIntoView().wait(5000).trigger("click")
                    cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout }).then(result => {
                        const recentHit = result.response.body.data.getESSimpleSearch.hits[index - 1]

                        cy.log('==== STEP: VERIFY ADDED CHECK IN GRID ===')
                        if (!recentHit) {
                            cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout }).then(result2 => {
                                const recentHit2 = result2.response.body.data.getESSimpleSearch.hits[index - 1]
                                console.log("result2 : ", result2)
                                if (!recentHit2) {
                                    console.log("result2 : ", result2)
                                    throw new Error("Check not added successfully")
                                }
                            })
                        }

                        cy.log('==== STEP: CLICK ON INPUT MODE BUTTON===')
                        cy.interceptApiByIndex('getESPaginatedList', 'checkdetails_flat')
                        cy.get("#inputModeButton", { timeout: longTimeout }).scrollIntoView().click()
                        cy.wait(5000)

                        cy.log('==== STEP: CLOSE PDF ===')
                        cy.get("#closePdfIcon", { timeout: longTimeout }).click()

                        cy.get("#checkDetailGrid").scrollIntoView()

                        cy.verifyApiResponse('@getESPaginatedListApiByIndex', { responseTimeout: longTimeout })
                        cy.verifyApiResponse('@getESPaginatedListApiByIndex', { responseTimeout: longTimeout }).then(paginatedApiResult => {
                            const lastHit = paginatedApiResult.response.body.data.getESPaginatedList.hits[index - 1]

                            console.log("paginatedApiResult : ", paginatedApiResult)
                            cy.log('==== STEP: VERIFY ADDED CHECK IN INPUT MODE GRID ===')
                            if (!lastHit) {
                                throw new Error("Check not appear in input mode grid")
                            }

                            cy.wait(5000)
                            cy.log('==== STEP: VERIFY PROPERTY FIELD DATA IN GRID ===')
                            cy.getTableCell('Property #', index).then(($checkDetailRow) => {
                                cy.verifyField(cy.wrap($checkDetailRow).children().children().eq(1))
                            })

                            cy.log('==== STEP: VERIFY PROPERTY SALES DATE DATA IN GRID ===')
                            cy.getTableCell('Sales Date', index).then(($checkDetailRow) => {
                                cy.verifyField(cy.wrap($checkDetailRow).children().children().eq(1))
                            })

                            cy.log('==== STEP: VERIFY PROPERTY PRODUCT DATA IN GRID ===')
                            cy.getTableCell('Product', index).then(($checkDetailRow) => {
                                cy.verifyField(cy.wrap($checkDetailRow).children().children().eq(1))
                            })

                            cy.log('==== STEP: VERIFY DECIMAL INTEREST FIELD DATA IN GRID ===')
                            cy.getTableCell('Decimal Interest', index).then(($checkDetailRow) => {
                                cy.verifyField(cy.wrap($checkDetailRow).children().children().eq(1))
                            })

                            cy.log('==== STEP: VERIFY TYPE FIELD DATA IN GRID ===')
                            cy.getTableCell('Type', index).then(($checkDetailRow) => {
                                cy.verifyField(cy.wrap($checkDetailRow).children().children().eq(1))
                            })

                            cy.getTableCell("Owner Net Revenue", index - 1).then(($checkDetailRow) => {
                                cy.wrap($checkDetailRow).trigger('mouseover')

                                cy.log('==== STEP: DELETE CHECK ===')
                                cy.interceptApi('updateCheckDetail', null, "updateCheckDetailDeleteApi")
                                cy.get(`[id="${index - 2}-18"]`).invoke('show').scrollIntoView().click()

                                cy.wait(2000)
                                cy.get('body').type("{enter}")
                                cy.get('body').type("{enter}")
                                cy.wait(5000)
                                cy.get('body').type("{enter}")
                                cy.verifyApiResponse('@updateCheckDetailDeleteApi', { responseTimeout: longTimeout }).then(result => {
                                    const isDeleted = result.response.body.data.updateCheckDetail?.updatedCheckDetail.IsDeleted

                                    if (!isDeleted)
                                        throw new Error("Check Not Deleted !!!")
                                })
                            })

                        })
                    })
                })
            })
        })

    })
})

//Commands
// This command will select random value from autocomplete field in checkDetail input grid
Cypress.Commands.add('addAutoCompleteField', (index, columnName) => {
    cy.log(`==== STEP: SELECT FROM COLUMN ${columnName} ====`)
    cy.getTableCell(columnName, index).then(($checkDetailRow) => {
        cy.interceptApi('getESFilterList')
        cy.get('#checkDetailGrid').scrollIntoView()
        // cy.interceptApi('getESPaginatedList')
        cy.interceptApi('updateCheckDetail')
        cy.wrap($checkDetailRow).scrollIntoView().wait(1000).click()
        cy.wrap($checkDetailRow).get(`[id='filter-autocomplete-es-field']`).scrollIntoView().click()
        cy.verifyApiResponse('@getESFilterListApi', { responseTimeout: longTimeout })
        cy.get('body').type("{downArrow}{downArrow}{enter}")

        // cy.verifyApiResponse('@getESPaginatedListApi', { responseTimeout: longTimeout })
        cy.verifyApiResponse('@updateCheckDetailApi', { responseTimeout: longTimeout })
    })
})

Cypress.Commands.add('verifyField', ($element) => {
    $element.invoke('val')
        .then(value => {
            console.log("value : ", value)
            if (!value)
                throw new Error("Value not appeared for field")
        });
})

