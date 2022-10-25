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
import { findInObject, isApiWithSearchString } from "../cypressUtils/helper";

// Constants
const workSpace = Cypress.env('WORK_SPACE') || "enerx"
const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts

// Common Commands
Cypress.Commands.add("checkAndLogin", () => {
    //This command will logged in if it is not already logged in
    cy.get('body').then(($body) => {
        if ($body.find('#workSpaceSignin').length) {
            cy.get('input').type(workSpace)
            cy.get('.MuiButtonBase-root').click()

            cy.get('#signInName', { timeout: longTimeout }).should('be.visible').type(loginCredential.email)
            cy.get('#password').type(loginCredential.passsword)

            cy.get('#next').click()
        }
    })
})

// This command is to type  in autocomplete search bar and then select first matched option
Cypress.Commands.add('typeAndSelect', (searchId, stringToType, optionId = null) => {
    cy.get(searchId).type(stringToType)

    if (optionId)
        cy.get(`[id="${optionId}"]`, { timeout: longTimeout }).should('be.visible')

    cy.get(searchId).type('{downArrow}{enter}')
})

/*This command is to intercept graphql api by operation name and if searchString is passed it will only
intercept if api payload has that string in search */
Cypress.Commands.add('interceptApi', (operationName, payloadKey = null) => {

    cy.intercept('POST', baseUrls[workSpace], req => {

        if (req.body.operationName === operationName) {
            if (payloadKey) {
                const { variables } = req.body
                if (payloadKey.searchString && isApiWithSearchString(payloadKey.searchString, variables))
                    req.alias = `${operationName}WithSearchStringApi`;
                else if (payloadKey?.sortOrder && variables?.sort?.order === payloadKey.sortOrder) {
                    req.alias = `${operationName}WithSortOrderApi`;
                }
                else if (payloadKey?.filter && variables?.filters.length &&
                    deepEqualObjects(variables.filters[0], payloadKey.filter)) {
                    req.alias = `${operationName}WithFilterApi`;
                }
            }
            else {
                // req.alias will use as api title 
                req.alias = `${operationName}Api`;
            }
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

        const errors = interception?.response?.body?.errors
        if (errors)
            throw new Error(`Api returned error: ${JSON.stringify(errors)}`)

        assert.isNotNull(interception.response.body, `${apiTitle} run succesfully`)
        return interception
    })
})

Cypress.Commands.add('deleteConfirmation', () => {
    cy.log('==== STEP: CLICKING ON HORIZON ICON ====')
    cy.get(".MuiTypography-root").contains('Delete').click()

    cy.log('==== STEP: CLICKING ON DELETE FROM CONFIRMATION DIALOGUE BOX  ====')
    cy.get(".MuiButton-label").contains('Delete', { timeout: longTimeout }).should('be.visible').click()
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
    cy.interceptApi(gridOperationName, { searchString: searchString })

    const commonSearchClass = ".MuiInputBase-input.MuiOutlinedInput-input.MuiInputBase-inputAdornedStart"
    cy.get(searchId || commonSearchClass).focus().clear().type(searchString)

    cy.verifyApiResponse(`@${gridOperationName}WithSearchStringApi`, { responseTimeout: longTimeout }).then((apiResponse) => {
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
    cy.contains('th', columnName)
        .invoke('index')
        .then(colIndex => {
            cy.get('tr')
                .eq(rowIndex)
                .within((row) => {
                    cy.get('td').eq(colIndex).as('cell')
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
    cy.get('#attachedDocument').trigger('mouseover')
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
    cy.get(".MuiButtonBase-root").contains('+ ADD Tract To AGREEMENT').click({ force: true })

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
