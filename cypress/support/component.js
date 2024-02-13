/* eslint-disable no-undef */
// ***********************************************************
// This example support/component.js is processed and
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
import '../component/MRT/commands'
import '../component/TableESHOC/commands'
import '../component/M1nTable/commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

import { mount } from 'cypress/react'

import Providers from 'Providers';
import { globalStateController } from 'hookstate/globalStateController';
import { userData } from '../data';
import ldata from '../fixtures/ldata.json';
import { ConnectedRouter } from "connected-react-router";
import { history } from "store";

Cypress.Commands.add('mount', (component, { disableContactBulkProgress, testCase, spec } = {}) => {
  globalStateController.updateState({
    apolloClientEndpoint: ldata.url,
    x_zumo_auth: ldata.x_zumo_auth,
    access_token: ldata.access_token,
    user: userData,
    cypress: {
      spec,
      disableContactBulkProgress: disableContactBulkProgress ?? true,
      mrtOverrideMeta: { isDefaultGridView: true, columnVirtualization: false },
    },
    testCase,
  });


  const wrapped = <Providers>
    <ConnectedRouter history={history}>
      {component}
    </ConnectedRouter>
  </Providers>;

  return mount(wrapped);
});

// Example use:
// cy.mount(<MyComponent />)