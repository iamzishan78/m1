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
import './commands';
import '../component/MRT/commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

import { mount } from 'cypress/react';

import Providers from 'Providers';
import { globalStateController } from 'hookstate/globalStateController';
import { userData } from '../data';
import ldata from '../fixtures/ldata.json';
import { ConnectedRouter } from 'connected-react-router';
import { history } from 'store';

// Adds a new command 'mount' to Cypress for mounting a React component with custom global state and providers.
Cypress.Commands.add(
  'mount',
  (component, { disableContactBulkProgress, testCase, spec, mrtOverrideMeta } = {}) => {
    // Updates the global state with specific parameters before mounting the component.
    // This includes setting various authentication and user data, as well as specific flags and metadata for the test.
    globalStateController.updateState({
      apolloClientEndpoint: ldata.url, // Sets the GraphQL endpoint URL.
      x_zumo_auth: ldata.x_zumo_auth, // Authentication token for Azure Mobile Services.
      access_token: ldata.access_token, // OAuth2 access token.
      user: userData, // User data object.
      cypress: {
        spec, // The current test specification.
        disableContactBulkProgress: disableContactBulkProgress ?? true, // Disables contact bulk progress by default.
        mrtOverrideMeta: {
          isDefaultGridView: true,
          columnVirtualization: false,
          ...mrtOverrideMeta,
        }, // Overrides for MRT (Material React Table) settings.
      },
      testCase, // The specific test case being run.
    });

    // Wraps the component with Providers and a ConnectedRouter, ensuring that the component has access to Redux state, routing, etc.
    const wrapped = (
      <Providers>
        <ConnectedRouter history={history}>{component}</ConnectedRouter>
      </Providers>
    );

    // Mounts the wrapped component within the Cypress test, making it ready for testing.
    return mount(wrapped);
  }
);

// Example use:
// cy.mount(<MyComponent />)
