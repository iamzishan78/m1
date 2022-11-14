/* eslint-disable no-undef */

import { basic_timeouts, agreementObj } from "../../cypressUtils/data"

describe('Add And Delete Agreement Spec', () => {
    it('passes', () => {
        const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts

        cy.viewport(1536, 960)
        cy.visit('http://localhost:3000/land/agreements')

        cy.checkAndLogin()

        cy.log('==== STEP: ADD AGREEMENT ====')
        cy.interceptApi('UpsertCustomLayer')
        cy.get('#addButton', { timeout: longTimeout }).should('be.visible').click()
        cy.verifyApiResponse('@UpsertCustomLayerApi').then(response => {
            const cypressAgreementId = response.response.body.data.upsertCustomLayer.customLayer._id

            cy.get(agreementObj.agreementNumber.id, { timeout: longTimeout }).should('be.visible')

            cy.log('==== STEP: ADD AGREEMENT NUMBER ====')
            cy.interceptApi('updateCustomLayer')
            cy.get(agreementObj.agreementNumber.id, { timeout: longTimeout }).should('be.visible').type(agreementObj.agreementNumber.value)
            cy.get(".MuiGrid-item").contains('Agreement Number').click()
            cy.verifyApiResponse('@updateCustomLayerApi')

            cy.log('==== STEP: ADD AGREEMENT NAME ====')
            cy.get(agreementObj.agreementName.id, { timeout: longTimeout }).should('be.visible').wait(200).type(agreementObj.agreementName.value)

            cy.log('==== STEP: ADD AGREEMENT TYPE ====')
            cy.agreementFieldSelect(agreementObj.agreementType)

            cy.log('==== STEP: ADD AGREEMENT SUBTYPE ====')
            cy.typeAndSelect(agreementObj.agreementSubtype.id, agreementObj.agreementSubtype.value)

            cy.log('==== STEP: ADD AGREEMENT RIGHTTYPE ====')
            cy.typeAndSelect(agreementObj.rightsType.id, agreementObj.rightsType.value)

            cy.log('==== STEP: ADD AGREEMENT STATUS ====')
            cy.typeAndSelect(agreementObj.agreementStatus.id, agreementObj.agreementStatus.value)

            cy.log('==== STEP: ADD AGREEMENT LESSEE ====')
            cy.get('body').type("{esc}")
            cy.get(agreementObj.Lessee.id).type(agreementObj.Lessee.value)

            cy.log('==== STEP: ADD AGREEMENT DATE ====')
            cy.get(agreementObj.agreementDate.id).type(agreementObj.agreementDate.value)

            cy.log('==== STEP: ADD AGREEMENT EFFECTIVE DATE ====')
            cy.get(agreementObj.effectiveDate.id).type(agreementObj.effectiveDate.value)

            cy.log('==== STEP: ADD AGREEMENT TERM ====')
            cy.get(agreementObj.agreementTerm.id).type(agreementObj.agreementTerm.value)

            cy.log('==== STEP: ADD AGREEMENT EXPIRATION DATE ====')
            cy.get(agreementObj.expirationDate.id).type(agreementObj.expirationDate.value)

            cy.log('==== STEP: ADD AGREEMENT EXTENSION DATE ====')
            cy.get(agreementObj.extensionDate.id).type(agreementObj.extensionDate.value)

            cy.log('==== STEP: ADD AGREEMENT BONUS PAYMENT ====')
            cy.get(agreementObj.bounusPayment.id).type(agreementObj.bounusPayment.value)

            cy.log('==== STEP: ADD AGREEMENT ACQUISITION ID ====')
            cy.typeAndSelect(agreementObj.acquisitionID.id, agreementObj.acquisitionID.value)

            cy.log('==== STEP: ADD AGREEMENT ACQUISITION DATE ====')
            cy.get(agreementObj.acquisitionDate.id).type(agreementObj.acquisitionDate.value)

            cy.log('==== STEP: ADD AGREEMENT ACQUISITION COST ====')
            cy.get(agreementObj.totalAcquisitionCost.id).type(agreementObj.totalAcquisitionCost.value)

            cy.log('==== STEP: ADD AGREEMENT PROSPECT ====')
            cy.typeAndSelect(agreementObj.Prospect.id, agreementObj.Prospect.value)

            cy.log('==== STEP: ADD AGREEMENT INTERNAL COMPANY ====')
            cy.typeAndSelect(agreementObj.internalCompany.id, agreementObj.internalCompany.value)

            cy.log('==== STEP: ADD AGREEMENT STATE ====')
            cy.typeAndSelect(agreementObj.state.id, agreementObj.state.value)

            cy.log('==== STEP: ADD AGREEMENT COUNTY ====')
            cy.typeAndSelect(agreementObj.county.id, agreementObj.county.value)

            cy.log('==== STEP: ADD AGREEMENT COUNTY ====')
            cy.get("[id='field-Project Name']").click()
            cy.get('body').type("{downArrow}{downArrow}{enter}")

            cy.get("#menuIcon").click()
            cy.log('==== STEP: ADD AGREEMENT DESCRIPTION ====')
            cy.get(agreementObj.description.id).scrollIntoView().type(`${agreementObj.description.value}{enter}`, { force: true })

            cy.log('==== STEP: CLICK ON META DETA BUTTON ====')
            cy.get("#metaDataButton").scrollIntoView()
            cy.get("#metaDataButton", { timeout: longTimeout }).trigger("click")

            cy.log('==== STEP: ADD ASSIGN APPROVER ====')
            cy.typeAndSelect(agreementObj.Approver.id, agreementObj.Approver.value)

            cy.log('==== STEP: ADD AGREEMENT TYPE ====')
            cy.agreementFieldSelect(agreementObj.approvalStatus)

            cy.log('==== STEP: ADD DOCUMENT ====')
            cy.addDocument(agreementObj.file.address)
            cy.get(agreementObj.file.fileId, { timeout: longTimeout }).should('exist')

            cy.log('==== STEP: ADD COMMENT ====')
            cy.addComment()

            cy.verifyApiResponse('@UpsertCommentApi', { responseTimeout: longTimeout }).then(response => {
                const commentId = response.response.body.data.upsertComment.comment._id
                cy.get(`#${commentId}`).should('exist')
            })

            cy.interceptApi('getESSimpleSearch')
            cy.visit('http://localhost:3000/land/agreements')
            cy.get('#addButton', { timeout: longTimeout }).should('be.visible')

            cy.log('==== STEP: SEARCH AGREEMENT ON GRID ====')
            cy.gridSearch(agreementObj.agreementName.value, 'getESSimpleSearch').then(response => {
                const hits = response.response.body.data.getESSimpleSearch.hits
                const cypressAgreement = hits.find(hit => hit.agreementName === agreementObj.agreementName.value)

                if (!cypressAgreement)
                    throw new Error('Sample Agreement added by cypress not found');

                const indexOfcypressAgreement = hits.findIndex(hit => hit._id === cypressAgreement._id) + 1

                cy.log('==== STEP: OPEN CYPRESS GENERATED AGREEMENT DETAIL  ====')
                cy.getTableCell("Agreement", indexOfcypressAgreement).then(($agreementNameCell) => {
                    cy.wrap($agreementNameCell).contains(`${agreementObj.agreementNumber.value} - ${agreementObj.agreementName.value}`).click()
                    cy.get(agreementObj.agreementNumber.id, { timeout: longTimeout }).should('be.visible')

                    cy.log('==== STEP: DELETE AGREEMENT PROCESS START ====')
                    cy.get("#moreHorizIcon").children().click()
                    cy.interceptApi('getESSimpleSearch')
                    cy.interceptApi('updateCustomLayer')
                    cy.deleteConfirmation()
                    cy.verifyApiResponse('@updateCustomLayerApi')

                    cy.get('#addButton', { timeout: longTimeout }).should('be.visible')

                    cy.gridSearch(agreementObj.agreementName.value, 'getESSimpleSearch').then(response => {
                        const hits = response.response.body.data.getESSimpleSearch.hits
                        const isAggreementExist = hits.some(hit => hit.id === cypressAgreementId)

                        if (isAggreementExist)
                            throw new Error('Agreement still exist');

                        cy.wait(500)
                    })

                })
            })
        })

    })

})