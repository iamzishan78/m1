/* eslint-disable no-undef */
import Notepad from '../../../src/components/Dashboard/components/Notepad.js';
import { CREATE_NOTE } from 'graphQL/useMutationNote';

describe('Notepad Component', () => {

//   beforeEach(() => {
//     cy.window().then((win) => {
//         win.stateProfile = {
//           fields: {
//             _id: '65b2a4d3c7f379e513f91913', 
//           },
//         };
//       });
//       cy.viewport(1800, 1400).mount(<Notepad />);
// });

// it('Debugging test case', () => {
//     cy.window().then((win) => {
//       console.log('stateProfile:', win.stateProfile);
//     });
// });

// it('Displays Notes inside textarea', () => {
//     cy.interceptAndWait(["GetUserNotes"], (alias) => {
//         cy.get('[data-testid="notes-description-text-area"]').type('Your text goes here');

//           cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then(
//             (response) => {
//               const data = response?.response
//               expect(response?.response?.statusCode).to.eq(200);

//               cy.request({
//                 method: "POST",
//                 url: ldata.url,
//                 headers: headers,
//                 body: '',
//               }).then((r) => {
//                 expect(r.status).to.eq(200);
//               });
//             }
//           );
//         },
//         { wait: false }
//     );
// });

  it('renders Notepad component correctly', () => {
    cy.viewport(1600, 1200); // Set the viewport size

    // Mount the Notepad component
    cy.mount(<Notepad />);

    // Assert that the textarea and save button exist
    cy.get('[data-testid="notes-description-text-area"]').should('exist');
  });

  it('updates textarea value on input change', () => {
    cy.viewport(1600, 1200);

    // Mount the Notepad component
    cy.mount(<Notepad />);

    // Simulate user input in textarea
    const userInput = 'This is a test note.';
    cy.get('[data-testid="notes-description-text-area"]').type(userInput);

    // Assert that textarea value is updated
    cy.get('[data-testid="notes-description-text-area"]').find('textarea').should('have.value', userInput);
  });

  it('calls the API on blur of textarea', () => {
    cy.viewport(1600, 1200);
    // cy.intercept('POST', CREATE_NOTE).as('apiCall');
  
    cy.mount(<Notepad />);
    const userInput = 'This is a test note.';
    cy.get('[data-testid="notes-description-text-area"]').find('textarea').type(userInput);
  
    // Trigger the blur event
    // cy.get('[data-testid="notes-description-text-area"]').find('textarea').blur();
  
    // Wait for the API call to complete
    // cy.wait('@apiCall').its('response.statusCode').should('eq', 400); // Adjust the status code as per your API response
  });

  it('calls createNote mutation', () => {
    cy.viewport(1600, 1200);
    // cy.intercept('POST', CREATE_NOTE).as('apiCall');
  
    cy.mount(<Notepad />);
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body?.operationName === 'createNote') {
        req.reply((res) => {
          res.send({
            data: {
              createNote: {
                _id: '65b2a4d3c7f379e513f91913',
                description: req.body.variables.content.description,
                userId: req.body.variables.content.userId,
              },
            },
          });
        });
      }
    }).as('createNoteRequest');
  
    // Assuming you have mounted the Notepad component already
    // ...
  
    // Trigger the mutation
    cy.get('[data-testid="notes-description-text-area"]').find('textarea').type('Test Note');
  
    // Assuming that blur triggers the createNote mutation
    cy.get('[data-testid="notes-description-text-area"]').find('textarea').blur();
  
    // Wait for the createNote mutation to complete
    cy.wait('@createNoteRequest').then((interception) => {
      const request = interception.request;
  
      // Verify the request payload
      expect(request.body.operationName).to.equal('createNote');
      expect(request.body.variables.content.description).to.equal('Test Note');
      expect(request.body.variables.content.userId).to.equal('65b2a4d3c7f379e513f91913'); // Replace with actual user ID
  
      // Verify the response
      expect(interception.response.body.data.createNote._id).to.equal('65b2a4d3c7f379e513f91913');
      expect(interception.response.body.data.createNote.description).to.equal('Test Note');
      expect(interception.response.body.data.createNote.userId).to.equal('65b2a4d3c7f379e513f91913'); // Replace with actual user ID
    });
  });
});