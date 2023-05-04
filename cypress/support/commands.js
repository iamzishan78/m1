/* eslint-disable no-undef */
/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { deepEqualObjects } from "../../src/components/Shared/functions";
import { baseUrls, basic_timeouts, loginCredential } from "../cypressUtils/data";
import { camelize, findInObject, isSearchStringMatched } from "../cypressUtils/helper";

// Constants
const workSpace = Cypress.env('WORK_SPACE') || "enerx"
const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts

// Common Commands
Cypress.Commands.add("checkAndLogin", () => {
    //This command will logged in if it is not already logged in
    cy.log('==== STEP: LOGGING IN ===')
    cy.get('body').then(($body) => {
        if ($body.find('#workSpaceSignin').length) {
            cy.get('input').type(workSpace, { force: true })
            cy.get('.MuiButtonBase-root').click({ force: true })

            cy.get('#signInName', { timeout: longTimeout }).should('be.visible').type(loginCredential.email)
            cy.get('#password').type(loginCredential.passsword)

            cy.get('#next').click()
        }
    })
})

//This command will set visbility to hidden for css element
Cypress.Commands.add('hide', { prevSubject: 'element' }, (subject) => {
    subject.css('visibility', 'hidden');
})

// This command is to type  in autocomplete search bar and then select first matched option
Cypress.Commands.add('typeAndSelect', (searchId, stringToType, optionId = null) => {
    cy.get(searchId, { timeout: longTimeout }).clear().type(stringToType).wait(3000)

    if (optionId)
        cy.get(`[id="${optionId}"]`, { timeout: longTimeout }).should('be.visible')

    cy.get(searchId).type('{downArrow}{enter}')
})

/*This command is to intercept graphql api by operation name and if searchString is passed it will only
intercept if api payload has that string in search */
Cypress.Commands.add('interceptApi', (operationName, payloadKey = null, alias = null) => {

    cy.intercept('POST', baseUrls[workSpace], req => {
        if (req.body.operationName === operationName) {
            if (payloadKey) {
                const { variables } = req.body
                if (payloadKey.searchString && isSearchStringMatched(payloadKey.searchString, variables))
                    req.alias = alias || `${operationName}WithSearchStringApi`;
                else if (payloadKey?.sortOrder && variables?.sort?.order === payloadKey.sortOrder) {
                    req.alias = alias || `${operationName}WithSortOrderApi`;
                }
                else if (payloadKey?.filter && variables?.filters.length &&
                    deepEqualObjects(variables.filters[0], payloadKey.filter)) {
                    req.alias = alias || `${operationName}WithFilterApi`;
                }
            }
            else {
                // req.alias will use as api title 
                req.alias = alias || `${operationName}Api`;
            }
        }
    });
})

Cypress.Commands.add('interceptApiByIndex', (operationName, esIndex) => {
    // console.log("interceptApiByIndex")
    // console.log("operationName : ", operationName)
    // console.log("esIndex : ", esIndex)

    cy.intercept('POST', baseUrls[workSpace], req => {
        // console.log("req.body : ", req.body)
        if (req.body.operationName === operationName && req.body.variables.index === esIndex) {
            req.alias = `${operationName}ApiByIndex`;

            // console.log(" req.alias : ", req.alias)
            // console.log(`${operationName}ApiByIndex`)
        }
    });
})

// This command is to check api was successful or not
Cypress.Commands.add('verifyApiResponse', (apiTitle) => {
    cy.wait(apiTitle, { timeout: longTimeout }).then((interception) => {
        const operationName = interception?.request?.body?.operationName
        const response = interception?.response?.body?.data[operationName]

        if (typeof response === 'string')
            throw new Error(response)

        if (response?.success === false)
            throw new Error("Api Failed")
        const errors = interception?.response?.body?.errors
        if (errors)
            throw new Error(`Api returned error: ${JSON.stringify(errors)}`)

        assert.isNotNull(interception.response?.body, `${apiTitle} run succesfully`)
        return interception
    })
})

Cypress.Commands.add('deleteConfirmation', () => {
    cy.get(".MuiTypography-root", { timeout: longTimeout }).contains('Delete', { timeout: longTimeout }).scrollIntoView().click({ force: true })

    cy.wait(2000)
    cy.log('==== STEP: CLICKING ON DELETE FROM CONFIRMATION DIALOGUE BOX  ====')
    cy.get("#deleteButton", { timeout: longTimeout }).should('be.visible').trigger("click")
})

/*This command will take css id and containing string to click on action
command will then varify api response and if isFilter is passed it will verify
filter was applied or not */
Cypress.Commands.add('selectQuickAction', (actionId, containsString, isFilter = false) => {
    cy.get(`[id="${actionId}"]`).trigger('click');
    cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout })

    if (isFilter)
        cy.get('.MuiChip-label', { timeout: longTimeout }).contains(containsString)
    else
        cy.get('.MuiTypography-root', { timeout: extraTimeout }).contains(containsString);
})

//Scroll grid by using id of the container 
Cypress.Commands.add('scrollGridTo', (direction, containerId) => {
    cy.get(containerId).children().children().children().children().eq(2).scrollTo(direction)
})
//This command will hover, click on pencil icona and save value by pressing enter
Cypress.Commands.add('updateSummaryField', (fieldName, value) => {
    cy.contains(fieldName).siblings('.MuiTableCell-body').children().children().children().eq(1).trigger('mouseover', { force: true }).children().click({ force: true })
    cy.contains(fieldName).siblings().eq(0).children().children().children().eq(0).type(`${value}{enter}`)
})

//Search from map like wells ,tract etc....
Cypress.Commands.add('searchOnMap', (data, value) => {
    cy.get('#dataNameSelect', { timeout: longTimeout }).should('be.visible').click()
    cy.get('.MuiList-root', { timeout: longTimeout }).should('be.visible').contains(data).click()

    // cy.get('#cognitive-search-autocomplete', { timeout: 10000 }).should('be.visible').type(value)
    cy.typeAndSelect("#cognitive-search-autocomplete", value, "cognitive-search-autocomplete-option-1")
})

// Command will search and verify results have searched string or not
Cypress.Commands.add('gridSearch', (searchString, gridOperationName, searchId = null) => {
    const apiAlias = searchString.replace(/\s/g, '');
    cy.interceptApi(gridOperationName, { searchString: searchString }, apiAlias)

    const commonSearchClass = ".MuiInputBase-input.MuiOutlinedInput-input.MuiInputBase-inputAdornedStart"
    cy.get(searchId || commonSearchClass).focus().clear().type(searchString)

    cy.verifyApiResponse(`@${apiAlias}`, { responseTimeout: longTimeout }).then((apiResponse) => {
        let hits = apiResponse.response.body.data?.getESSimpleSearch?.hits

        if (gridOperationName === 'getESDocuments')
            hits = apiResponse.response.body.data.getESFiles.hits

        const unmatchedHit = hits.find(hit => !findInObject(hit, searchString.toLowerCase()))

        if (unmatchedHit) {
            throw new Error(`Record with _id:${unmatchedHit._id} does not contains searched String`)
        }
    })
})

//DocumentGrid Commands
Cypress.Commands.add('addWell', (wellName) => {
    cy.interceptApi('addWellToFileDescriptor')
    cy.interceptApi('getWellsFromDocument')

    cy.get("#addIcon").click()
    cy.typeAndSelect('#wellSearch', wellName, 'wellSearch-option-0')
    cy.verifyApiResponse('@addWellToFileDescriptorApi')
    cy.verifyApiResponse('@getWellsFromDocumentApi')
})

Cypress.Commands.add('clickWellIcon', (wellName) => {
    cy.log('==== STEP: CLICK ON WELL ICON ====')
    cy.interceptApi('getWellsFromDocument')
    cy.get("#wellIcon", { timeout: longTimeout }).click()
})

Cypress.Commands.add('getTableCell', (columnName, rowIndex) => {
    cy.contains('th', columnName, { timeout: longTimeout })
        .invoke('index')
        .then(colIndex => {
            cy.get('tr', { timeout: longTimeout })
                .eq(rowIndex, { timeout: longTimeout })
                .within((row) => {
                    cy.get('td', { timeout: longTimeout }).eq(colIndex).as('cell')
                })
            cy.get('@cell')   // last command, it's result will be returned
        });
})

//Add Document
Cypress.Commands.add('addDocument', (fileAddress) => {
    cy.interceptApi('AddDescriptorFile')
    cy.get('input[type=file]', { force: true }).selectFile(fileAddress, {
        force: true
    })
    cy.verifyApiResponse('@AddDescriptorFileApi')
})

//Remove Document
Cypress.Commands.add('detachDocument', () => {
    cy.get('#attachedDocument', { timeout: longTimeout }).should('be.visible').trigger('mouseover')
    cy.get('#documentDeleteIcon').click({ force: true })
    cy.interceptApi('updateDocument')
    cy.get(".MuiButton-label").contains('Delete').click()
    cy.verifyApiResponse('@updateDocumentApi', { responseTimeout: 500 })
})

// ContactGrid Commands

Cypress.Commands.add('sortColumn', (columnName, sortOrder) => {
    cy.interceptApi('getESSimpleSearch', { sortOrder: sortOrder })
    cy.get('.MuiButton-label', { timeout: longTimeout }).contains(columnName).scrollIntoView().wait(2000).click({ force: true })
    cy.verifyApiResponse('@getESSimpleSearchWithSortOrderApi', { responseTimeout: longTimeout })
})

Cypress.Commands.add('removeFilter', (filterLabel) => {
    cy.interceptApi('getESSimpleSearch')

    cy.get('body').then((body) => {
        if (body.find('.MuiChip-label').length > 0) {
            cy.get('.MuiChip-label', { timeout: longTimeout }).contains(filterLabel).siblings().click()
            cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout })
            cy.get('.MuiTableBody-root', { timeout: longTimeout }).should('be.visible')

            cy.get("body").then($body => {
                if ($body.find(".MuiChip-label").length > 0) {
                    cy.get('.MuiChip-label', { timeout: longTimeout }).contains(filterLabel).should('not.exist');
                }
            });

        }
    });

})

Cypress.Commands.add('drawMapShape', () => {
    cy.get('.mapboxgl-canvas').dblclick(643, 766, { force: true })
        .dblclick(663, 770, { force: true })
        .dblclick(663, 770, { force: true })
        .dblclick(663, 770, { force: true })
        .dblclick(716, 742, { force: true })
        .dblclick(716, 742, { force: true })
        .dblclick(736, 722, { force: true })
        .dblclick(746, 712, { force: true })
        .dblclick(746, 712, { force: true })

    cy.get("#mapEditIcon", { timeout: longTimeout }).should('be.visible').click()
    cy.wait(5000)
    cy.get("#mapRectangle").click()

    cy.get('.mapboxgl-canvas')
        .first()
        .wait(5000)
        .trigger("mousedown", 746, 712, { bubbles: false, force: true })
        .trigger("mousemove", 446, 612, {
            which: 1,
            force: true,
            bubbles: false,
        })
        .trigger("mouseup", 446, 612, { force: true })
})

Cypress.Commands.add('createShapeLayer', (shapeLayerItemId) => {
    cy.interceptApi('UpsertCustomLayer')
    cy.get('.mapboxgl-canvas').click()
    cy.get('#parcel-button', { timeout: longTimeout }).should('be.visible').click()
    cy.wait(3000)
    cy.get(shapeLayerItemId).wait(1000).click()
    if (shapeLayerItemId === "#agreementItem")
        cy.get('#addShapeButton').click()

    cy.get('.MuiBox-root', { timeout: longTimeout }).should('be.visible')

    cy.verifyApiResponse('@UpsertCustomLayerApi', { responseTimeout: longTimeout })
})

Cypress.Commands.add('updateAndVerifyContact', (fieldId, keyName, contactToUpdate) => {
    cy.get(fieldId).type('2')
    cy.get("[id='Full Name']").click()
    // Map Commands
    cy.verifyApiResponse('@UpdateContactApi', { responseTimeout: longTimeout })
    cy.verifyApiResponse('@getContactApi', { responseTimeout: longTimeout }).then(response => {
        const updatedContact = response.response.body.data.contact

        if (updatedContact[keyName] !== `${contactToUpdate[keyName]}2`) {
            throw new Error(`${keyName} not updated successfully`);
        }
    })
})

Cypress.Commands.add('drawMapShape', () => {
    cy.get('.mapboxgl-canvas').dblclick(643, 766, { force: true })
        .dblclick(663, 770, { force: true })
        .dblclick(663, 770, { force: true })
        .dblclick(663, 770, { force: true })
        .dblclick(716, 742, { force: true })
        .dblclick(716, 742, { force: true })
        .dblclick(736, 722, { force: true })
        .dblclick(746, 712, { force: true })
        .dblclick(746, 712, { force: true })

    cy.get("#mapEditIcon", { timeout: longTimeout }).should('be.visible').click()
    cy.wait(5000)
    cy.get("#mapRectangle").click()

    cy.get('.mapboxgl-canvas')
        .first()
        .wait(5000)
        .trigger("mousedown", 746, 712, { bubbles: false, force: true })
        .trigger("mousemove", 446, 612, {
            which: 1,
            force: true,
            bubbles: false,
        })
        .trigger("mouseup", 446, 612, { force: true })
})

Cypress.Commands.add('createShapeLayer', (shapeLayerItemId) => {
    cy.interceptApi('UpsertCustomLayer')
    cy.get('.mapboxgl-canvas').click()
    cy.get('#parcel-button', { timeout: longTimeout }).should('be.visible').click()
    cy.wait(3000)
    cy.get(shapeLayerItemId).wait(1000).click()
    if (shapeLayerItemId === "#agreementItem")
        cy.get('#addShapeButton').click()

    cy.get('.MuiBox-root', { timeout: longTimeout }).should('be.visible')

    cy.verifyApiResponse('@UpsertCustomLayerApi', { responseTimeout: longTimeout })
})

Cypress.Commands.add('addTract', (tractName) => {
    cy.log(`==== STEP: CLICK ON ADD TRACT BUTTON ====`)
    cy.get("#addTractToAgreementBtn").click({ force: true })

    cy.log(`==== STEP: CLICK ON EXISTING TRACT TAB ====`)
    cy.get("#existingTractTab").click()

    cy.log(`==== STEP: SELECT TRACT FROM DROP DOWN ====`)
    cy.typeAndSelect("#autucompleteShapeLayer", tractName, "autucompleteShapeLayer-option-0")

    cy.log(`==== STEP: SELECT ENTITY NAME ====`)
    cy.get("#AutocompEntityNamesList").click().type("mike jones")
    cy.get("[id='AutocompEntityNamesList-option-0']")
    cy.get("#AutocompEntityNamesList").click().type("{downArrow}{downArrow}{enter}")

    cy.log(`==== STEP: CLICK ON SAVE BUTTON ====`)
    cy.interceptApi('addOwnerToAShape')
    cy.get("#saveButton").click()
    cy.verifyApiResponse('@addOwnerToAShapeApi', { responseTimeout: longTimeout })
})

// AgreementGrid Commands

Cypress.Commands.add('agreementFieldSelect', (field) => {
    cy.get(field.id).click({ force: true })
    cy.get('.MuiMenuItem-root').contains(field.value).click()
})

Cypress.Commands.add('addComment', () => {
    cy.interceptApi('UpsertComment')
    cy.get("#txtArea", { timeout: longTimeout }).should('be.visible').type("A cypress comment")
    cy.get("#commentButton").click()
})



// Cypress.Commands.add('pintotop', () => {
//     cy.get('#pintotop').click();
//     cy.get('#pintotop').should('have.text', 'Unpin');
//     cy.get('#pintotop').click();
//     cy.get('#pintotop').should('have.text', 'Pin');
// })

// This command will delete agreement then will verify too
Cypress.Commands.add('deleteAndVerifyAgreement', (agreementName, agreementNumber) => {
    cy.log('==== STEP: SEARCH AGREEMENT ON GRID ====')
    cy.gridSearch(agreementName, 'getESSimpleSearch').then(response => {
        const hits = response.response.body.data.getESSimpleSearch.hits

        const cypressAgreement = hits.find(hit => hit.agreementName === agreementName)

        if (!cypressAgreement)
            throw new Error('Agreement added by cypress not found');

        const cypressAgreementId = cypressAgreement._id

        const indexOfcypressAgreement = hits.findIndex(hit => hit._id === cypressAgreement._id) + 1

        cy.log('==== STEP: OPEN CYPRESS GENERATED AGREEMENT DETAIL  ====')
        cy.getTableCell("Agreement", indexOfcypressAgreement).then(($agreementNameCell) => {
            cy.wrap($agreementNameCell).contains(`${agreementNumber} - ${agreementName}`).scrollIntoView().click({ waitForAnimations: false })
            cy.get("#field-agreementName", { timeout: longTimeout }).should('be.visible')

            cy.log('==== STEP: DELETE AGREEMENT PROCESS START ====')
            cy.get("#moreHorizIcon", { timeout: longTimeout }).children().click()
            cy.interceptApi('getESSimpleSearch')
            cy.interceptApi('updateCustomLayer')
            cy.deleteConfirmation()
            cy.verifyApiResponse('@updateCustomLayerApi')

            cy.get('#addButton', { timeout: longTimeout }).should('be.visible')

            cy.gridSearch(agreementName, 'getESSimpleSearch').then(response => {
                const hits = response.response.body.data.getESSimpleSearch.hits
                const isAggreementExist = hits.some(hit => hit.id === cypressAgreementId)

                if (isAggreementExist)
                    throw new Error('Agreement still exist');

                cy.wait(500)
            })

        })
    })
})

// This command will delete tract (related tract to agreement) and then will verify it
Cypress.Commands.add('deleteTractAndVerify', (tractName) => {
    cy.verifyApiResponse('@getESSimpleSearchApiByIndex', { responseTimeout: longTimeout }).then(response => {
        cy.get("#legalDescriptionTab").click()

        // cy.get('.MuiTableCell-body', { timeout: longTimeout }).contains(tractName, { timeout: longTimeout }).scrollIntoView()
        const hits = response.response.body.data.getESSimpleSearch.hits
        const tractId = hits.find(hit => hit?.tract?.tractName === tractName)?.tractId
        const indexOfSampleContact = hits.findIndex(hit => hit?.tract?.tractName === tractName) + 1

        cy.wait(5000)
        cy.get("#AgreementOwnersTractsTable").scrollIntoView()
        cy.wait(1000)
        cy.get("#AgreementOwnersTractsTable").scrollIntoView()
        cy.get("#AgreementOwnersTractsTable", { timeout: longTimeout }).scrollIntoView().getTableCell('State', indexOfSampleContact).scrollIntoView().click()

        cy.interceptApiByIndex('getESSimpleSearch', 'shapeowners_flat')
        cy.interceptApi('updateShapeOwners')
        cy.get("#tractMoreHorizIcon", { timeout: longTimeout }).click()
        cy.get("#deleteTract", { timeout: longTimeout }).click()

        cy.verifyApiResponse('@updateShapeOwnersApi', { responseTimeout: longTimeout })

        cy.verifyApiResponse('@getESSimpleSearchApiByIndex', { responseTimeout: longTimeout }).then(response => {
            const hits = response.response.body.data.getESSimpleSearch.hits

            if (hits.some(hit => hit?.tractId === tractId))
                throw new Error("Tract still exist after delete")
        })
    })
})

// AGREEMENT UPLOADERS COMMANDS

//This command will click on import to open uploader will select value from breadcrumb
Cypress.Commands.add('openAgreementUploader', (breadCrumb) => {
    cy.log('==== STEP: CLICK ON ARROW ICON ====')
    cy.get('#addButtonArrowIcon', { timeout: longTimeout }).click()

    cy.log('==== STEP: CLIN ON IMPORT BUTTON  ====')
    cy.get("[id='menu-item-Import Agreements']", { timeout: longTimeout }).click()


    cy.log('==== STEP: SELECT BREADCRUMB  ====')
    cy.get('.MuiTypography-root', { timeout: longTimeout }).contains("Agreement Upload (Agreement Header Info)", { timeout: longTimeout }).click()
    cy.get('.MuiListItem-root', { timeout: longTimeout }).contains(breadCrumb, { timeout: longTimeout }).click()
})

//This command will check all fields are mapped or not
Cypress.Commands.add('checkFieldsMapping', () => {
    cy.log('==== STEP: CHECK IF ALL FIELDS ARE MAPPED ====')
    cy.get("#headerTable", { timeout: longTimeout }).should("be.visible")
        .find("tr")
        .then((row) => {
            const totalRows = row.length - 1
            //  row.length will give you the row count
            for (let i = 0; i < totalRows; i++) {
                cy.get(`#checkbox-${i}`).scrollIntoView()
                    .should('not.be.visible') // Passes
                    .should('be.checked')
            }
        });
})

Cypress.Commands.add('getDataFromGrid', (gridField, totalRows) => {
    let gridData = []
    for (let i = 1; i < totalRows; i++) {
        // eslint-disable-next-line no-loop-func
        cy.getTableCell('Agreement Number', i).then(($tableCell) => {
            cy.wrap($tableCell).scrollIntoView().then(function ($numberCellText) {
                cy.getTableCell(gridField, i).then(($tableCell) => {
                    cy.wrap($tableCell).scrollIntoView().then(function ($nameCellText) {
                        gridData.push({ agreementNumber: $numberCellText.text(), [camelize(gridField)]: $nameCellText.text(), })
                        cy.wrap(gridData).as('gridData');
                    })

                })
            })

        })
    }
})