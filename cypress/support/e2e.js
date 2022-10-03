/* eslint-disable no-undef */
// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

Cypress.on('uncaught:exception', (err, runnable) => {
    console.log("err : ", err)
    console.log("err.message : ", err.message)

    expect(err.message).to.include('AI (Internal)')

    // using mocha's async done callback to finish
    // this test so we prove that an uncaught exception
    // was thrown


    return false
})

// Alternatively you can use CommonJS syntax:
// require('./commands')