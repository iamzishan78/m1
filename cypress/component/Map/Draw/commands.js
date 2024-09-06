/* eslint-disable no-undef */
import { capitalize, isEqual } from 'lodash';
import { basic_timeouts } from '../../../cypressUtils/data';
import { copy } from 'components/Shared/functions';
import { popupController } from 'hookstate/popupStateController';

// Custom Cypress command to open a shape on the map
Cypress.Commands.add('openShape', ({ x, y, callback, newCustomLayer }) => {
  let jsonLayer;
  let popupStateVal;

  if (newCustomLayer.shapeJson) jsonLayer = copy(newCustomLayer.shapeJson);

  jsonLayer.layer = { id: newCustomLayer.layer };
  jsonLayer.id = newCustomLayer._id;

  const selectedShape = {
    ...jsonLayer.properties,
    feature: jsonLayer,
    id: newCustomLayer._id,
  };

  if (jsonLayer.properties.sdType === 'parcel') {
    popupStateVal = {
      expandedCard: true,
      selectedParcel: selectedShape,
    };
  } else {
    popupStateVal = {
      expandedCard: true,
      selectedShape,
    };
  }

  // Opening the side dialog
  popupController.setState(popupStateVal);

  // Wait for popup to load data
  cy.wait(5000);

  // Executing the provided callback function with the extracted custom layer data
  callback(newCustomLayer);
});

// Custom Cypress command to delete a shape
Cypress.Commands.add('deleteShape', ({ customLayer }) => {
  // Expanding the shape's card details
  cy.get('#expandCardVertIcon').click();
  // Clicking on the delete button to delete the shape
  cy.get('[data-testid="delete-icon"]').click();

  // Intercepting the 'updateCustomLayer' API call after deleting the shape
  cy.interceptAndWait(
    ['updateCustomLayer'], // Intercepting API call for updateCustomLayer
    alias => {
      // Clicking on the delete button to confirm deletion
      cy.get('#deleteButton').click();

      // Waiting for the intercepted API call to respond after deletion
      cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then(response => {
        const { success } = response.response.body.data.updateCustomLayer; // Extracting response data

        // Verifying that the deleted shape does not exist in the search results
        expect(success).to.be.equal(true);
      });
    },
    { wait: false } // Setting wait option to false to avoid waiting for this command to complete
  );
});

// Custom Cypress command to open and delete a shape
Cypress.Commands.add('openAndDeleteShape', ({ x, y, shapeType, newCustomLayer }) => {
  // Callback function to delete the shape once it's opened
  const callback = customLayer => {
    // Calling the 'verifyShape' command with the custom layer data and shapeType
    cy.verifyShape({ customLayer, shapeType, close: false });

    // Calling the 'deleteShape' command with the custom layer data and label getter
    cy.deleteShape({ customLayer });
  };

  // Opening the shape at the specified coordinates and invoking the callback to delete it
  cy.openShape({ x, y, callback, newCustomLayer });
});

// Custom Cypress command to draw a shape on the map based on the provided draw type and points
Cypress.Commands.add('drawShape', ({ drawType, points }) => {
  // Switching based on the draw type to determine the shape to be drawn
  switch (drawType) {
    case 'rectangle':
      // Clicking on the rectangle draw tool
      cy.get('#mapRectangle', { scrollBehavior: false }).click({ scrollBehavior: false });

      // Clicking on the canvas to start drawing the rectangle
      cy.get('.mapboxgl-canvas')
        .click(points[0].x, points[0].y) // First click to start drawing
        .trigger('mousedown', { button: 0, which: 1 }) // Triggering mouse down event
        .trigger('mousemove', points[1].x, points[1].y) // Moving mouse to draw rectangle
        .trigger('mouseup', { force: true }); // Releasing mouse to complete drawing

      break;

    case 'polygon':
      // Clicking on the polygon draw tool
      cy.get('#mapPolygon', { scrollBehavior: false }).click({ scrollBehavior: false });

      const canvas = cy.get('.mapboxgl-canvas');

      // Iterating over each point to draw the polygon
      points.forEach((point, index) => {
        if (index > 0) canvas.trigger('mousemove', point.x, point.y); // Moving mouse to draw next point

        canvas.click(point.x, point.y); // Clicking to add a point

        if (index === points.length - 1) canvas.click(point.x, point.y); // Clicking on the last point to complete the polygon
      });

      break;

    case 'circle':
      // Clicking on the circle draw tool
      cy.get('#mapCircle', { scrollBehavior: false }).click({ scrollBehavior: false });

      // Starting to draw the circle by triggering mouse down, moving, and then mouse up
      cy.get('.mapboxgl-canvas')
        .trigger('mousedown', points[0].x, points[0].y, { which: 1 }) // Mouse down event to start drawing
        .trigger('mousemove', points[1].x, points[1].y, { which: 1 }) // Moving mouse to draw circle
        .trigger('mouseup', { force: true }); // Releasing mouse to complete drawing

      break;

    case 'landgrid':
      // Clicking on the landgrid draw tool
      cy.get('.MuiButtonBase-root[aria-label="Multiple Select"]', {
        scrollBehavior: false,
      }).click({ scrollBehavior: false, force: true });

      // Click on the canvas to select points, ensuring clicks are processed correctly
      cy.get('.mapboxgl-canvas')
        .click(points[0].x, points[0].y, { force: true }) // Click the first point
        .then(() => {
          cy.wait(500); // Wait for the first click to be processed
          cy.get('.mapboxgl-canvas') // Re-select the canvas element
            .click(points[1].x, points[1].y, { force: true }); // Click the second point
        });

      // Clicking to set the boundary of the landgrid
      cy.wait(5000);
      cy.get('.MuiButtonBase-root[aria-label="Set Boundary"]', {
        scrollBehavior: false,
      }).should('be.visible').click({ scrollBehavior: false });

      break;

    default:
      break;
  }
});

// Custom Cypress command to veriify a shape by its shapeType
Cypress.Commands.add('verifyShape', ({ customLayer, shapeType, close = true }) => {

  cy.wait(5000);
  // Switching based on the shape type to verify the created shape details
  switch (shapeType) {
    case 'unit':
      // Verifying that the shape's name is displayed correctly
      cy.get('.MuiCardHeader-content .MuiBox-root.name').contains(
        customLayer.shapeJson.properties.shapeLabel.toUpperCase()
      );
      // Verifying that the shape's name is displayed in the data cell
      cy.get('[data-testid="data-cell-Unit Name"]').contains(
        customLayer.shapeJson.properties.shapeLabel
      );
      // Verifying that the shape's type is 'Unit'
      cy.get('.MuiCardHeader-content .MuiBox-root.type').contains('Unit');

      if (close) {
        // Closing the shape's details card
        cy.get('[aria-label="close"]').click();

        // Verifying that the shape's name is no longer displayed in the data cell after closing the card
        cy.get('[data-testid="data-cell-Unit Name"]').should('not.exist');
      }
      break;

    case 'tract':
    case 'parcel':
      // Verifying that the shape's name is displayed correctly
      cy.get('.MuiCardHeader-content .MuiBox-root.name').contains(
        customLayer.shapeJson.properties.shapeLabel.toUpperCase()
      );
      // Verifying that the shape's name is displayed in the data cell
      cy.get('[data-testid="data-cell-Tract Name"]').contains(
        customLayer.shapeJson.properties.shapeLabel
      );
      // Verifying that the shape's type is 'Tract'
      cy.get('.MuiCardHeader-content .MuiBox-root.type').contains('Tract');

      if (close) {
        // Closing the shape's details card
        cy.get('[aria-label="close"]').click();

        // Verifying that the shape's name is no longer displayed in the data cell after closing the card
        cy.get('[data-testid="data-cell-Tract Name"]').should('not.exist');
      }

      break;

    case 'contract':
    case 'deed':
    case 'lease':
    case 'surface':
      // Verifying that the shape's name is displayed correctly
      cy.get('.MuiCardHeader-content .MuiBox-root.name').contains(
        customLayer.shapeJson.properties.shapeLabel.toUpperCase()
      );
      // Verifying that the shape's name is displayed in the data cell
      cy.get('[data-testid="data-cell-Agreement Name"]').contains(
        customLayer.shapeJson.properties.agreementName
      );
      // Verifying that the shape's type is 'Agreement'
      cy.get('.MuiCardHeader-content .MuiBox-root.type').contains(capitalize(shapeType));

      // // Updating Agreement Number if not present as it is required
      // if (!customLayer.shapeJson.properties.agreementNumber) {
      //   cy.get('[data-testid="data-cell-Agreement Number"]', {
      //     timeout: basic_timeouts.midTimeout,
      //   }).trigger('mouseover');

      //   cy.get('button[data-testid="edit-Agreement Number"]').click();

      //   cy.interceptAndWait(['updateCustomLayer'], () => {
      //     cy.get('[data-testid="data-cell-Agreement Number"] input').clear().type('123').type('{enter}');
      //   });
      // }

      if (close) {
        // Closing the shape's details card
        cy.get('[aria-label="close"]').click();

        // Verifying that the shape's name is no longer displayed in the data cell after closing the card
        cy.get('[data-testid="data-cell-Agreement Name"]').should('not.exist');
      }

      break;

    default:
      break;
  }
});

// Custom Cypress command to draw a shape and create it on the map
Cypress.Commands.add('drawAndCreateShape', ({ drawType, shapeType, points }) => {
  // Drawing the shape on the map based on the provided draw type and points
  cy.drawShape({ drawType, points });

  // Clicking on the button to add the drawn shape to the layer
  cy.get('[data-testid="add-shape-to-layer"]').click();

  let createdShapeName, shapeId;

  // Intercepting the 'getCustomLayer' API call after creating the shape
  cy.interceptAndWait(
    ['getCustomLayer'], // Intercepting API call for custom layer
    alias => {
      // Switching based on the shape type to determine further actions
      switch (shapeType) {
        case 'unit':
          // Clicking to select the unit boundary item
          cy.get('#unitBoundaryItem').click();

          break;

        case 'tract':
        case 'parcel':
          // Clicking to select the tract item
          cy.get('#tractItem').click();

          break;

        case 'contract':
        case 'deed':
        case 'lease':
        case 'surface':
          // Clicking to select the agreement item
          cy.get('#agreementItem').should('be.visible').click();

          // Clicking on sub type agreement dropdown
          cy.get('#agreement-outlined').should('be.visible').click();

          cy.get(`li[data-value="${shapeType}"]`).should('be.visible').click();

          cy.get('#addShapeButton').should('be.visible').click();

          break;

        default:
          break;
      }

      // Waiting for the intercepted API call to respond after creating the shape
      cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then(response => {
        const { customLayer } = response.response.body.data; // Extracting custom layer data from response

        // Calling the 'verifyShape' command with the custom layer data and shapeType
        cy.verifyShape({ customLayer, shapeType });

        // Return values from command
        cy.wrap({
          createdShapeName: customLayer.name,
          createdShapeId: customLayer._id,
          customLayer
        });
      });
    },
    { wait: false } // Setting wait option to false to avoid waiting for this command to complete
  );

  // // Returning createdShapeName value
});

// Custom Cypress command to open and edit a shape on the map
Cypress.Commands.add(
  'openAndEditShape',
  ({ x, y, points, type, shapeType, expectedShape, openPoint, drawType, newCustomLayer }) => {
    // Callback function to be executed after opening the shape
    const callback = customLayer => {
      // Clicking on the button to edit the shape boundary
      cy.get('[data-testid="edit-shape-boundary"]').should('be.visible').click();

      // Waiting for 1 second before performing map actions
      cy.wait(1000).then(() => {
        // Centering the map to a specific location
        window.mapRef.jumpTo({
          center: {
            lng: -104.55022961850318,
            lat: 34.84921034658842,
          },
          zoom: 12.9,
        });

        // Waiting for 1 second after centering the map
        cy.wait(1000);
      });

      // Switching based on the type of edit action to perform
      switch (type) {
        case 'edit':
          // Editing the shape by triggering mouse events to move points
          cy.get('.mapboxgl-canvas')
            .trigger('mousedown', points[0].x, points[0].y, { which: 1 }) // Mouse down event to start editing
            .trigger('mousemove', points[1].x, points[1].y, { which: 1 }) // Moving mouse to edit the shape
            .trigger('mouseup'); // Releasing mouse to complete editing

          break;

        case 'resize':
          // Resizing the shape by clicking on the resize button and then dragging points
          cy.get('[data-testid="resize-shape"]').click(); // Clicking to enable shape resizing
          cy.get('.mapboxgl-canvas')
            .trigger('mousedown', points[0].x, points[0].y, { which: 1 }) // Mouse down event to start resizing
            .trigger('mousemove', points[1].x, points[1].y, { which: 1 }) // Moving mouse to resize the shape
            .trigger('mouseup'); // Releasing mouse to complete resizing

          break;

        case 'relocate':
          // Relocating the shape by dragging it to a new position
          cy.get('.mapboxgl-canvas')
            .trigger('mousedown', points[0].x, points[0].y, { which: 1 }) // Mouse down event to start relocation
            .trigger('mousemove', points[1].x, points[1].y, { which: 1 }) // Moving mouse to relocate the shape
            .trigger('mouseup'); // Releasing mouse to complete relocation

          break;

        case 'redraw':
          // Redrawing the shape by clicking on the redraw button and then drawing a new shape
          cy.get('[data-testid="redraw-shape"]').click(); // Clicking to enable shape redrawing

          cy.drawShape({ drawType, points }); // Drawing a new shape on the map

          break;

        case 'addshape':
          // Adding a new shape by clicking on the add shape button and then drawing a new shape
          cy.get('[data-testid="add-shape"]').click(); // Clicking to add a new shape

          cy.drawShape({ drawType, points }); // Drawing a new shape on the map

          break;

        default:
          break;
      }

      // Intercepting API calls to verify the changes made to the shape
      cy.interceptAndWait(
        ['updateCustomLayer'], // Intercepting API call to search for shapes
        (alias) => {
          // Clicking on the button to set the boundary of the shape
          cy.wait(5000);
          cy.get('.MuiButtonBase-root[aria-label="Set Boundary"]', {
            scrollBehavior: false,
          })
            .should('be.visible')
            .click({ scrollBehavior: false });

          // Waiting for the intercepted API call to respond
          cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then(
            (response) => {
              const { customLayer } = response.response.body.data.updateCustomLayer; // Extracting custom layer data from response

              // Verifying that the shape's geometry matches the expected shape
              expect(
                isEqual(customLayer.shapeJson.geometry, expectedShape)
              ).to.be.equal(true);

              // Return values from command
              cy.wrap({
                createdShapeName: customLayer.name,
                createdShapeId: customLayer._id,
                customLayer,
              });
            }
          );
        },
        { wait: false } // Setting wait option to false to avoid waiting for this command to complete
      );
    };
    // Opening the shape at the specified coordinates and executing the callback function
    cy.openShape({ x, y, callback, newCustomLayer });
  }
);

// Custom Cypress command to simulate a right-click on the map
Cypress.Commands.add('mapRightClick', ({ x, y, groupName, shapeName, callback }) => {

  // cy.get('.mapboxgl-canvas').first()
  //   .rightClick(x, y, { force: true })
  //   .click(x, y, { button: 2, force: true })
  //   .trigger('pointerdown', x, y, { button: 2, force: true })
  //   .trigger('mousedown', x, y, { button: 2, force: true })
  //   .trigger('pointerup', x, y, { button: 2, force: true })
  //   .trigger('mouseup', x, y, { button: 2, force: true });

  // Intercepting API calls to wait for the custom layer data after right-clicking
  cy.interceptAndWait(
    ['getCustomLayer'], // Intercepting API call for custom layer data
    alias => {
        // Simulating a right-click on the map at the specified coordinates
        cy.wait(5000);
        cy.get('.mapboxgl-canvas').click(x, y, { force: true, shiftKey: true });
        
        // Clicking on the specified shape name in the layer selection popup
        cy.get(
        `div[data-testid="layer-selection-popup"] div[data-testid="${groupName}-group"] span.MuiTypography-root`,
        {
          timeout: basic_timeouts.longTimeout,
        })
        .should('be.visible')
        .contains(shapeName) // Finding the specified shape name in the popup
        .click({ force: true }); // Clicking on the shape name

      // Waiting for the intercepted API call to respond
      cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then(response => {
        const { customLayer } = response.response.body.data; // Extracting custom layer data from response

        // Executing the callback function with the custom layer data
        callback(customLayer);
      });
    },
    { wait: false } // Setting wait option to false to avoid waiting for this command to complete
  );
});

// Custom Cypress command to perform a right-click on the map at specified coordinates, select a shape from the context menu, and delete it
Cypress.Commands.add(
  'rightClickAndDeleteShape',
  ({ x, y, groupName, shapeName, shapeType, newCustomLayer }) => {
    // Callback function to be executed after selecting the shape
    const callback = customLayer => {
      // Calling the 'verifyShape' command with the custom layer data and shapeType
      cy.verifyShape({ customLayer, shapeType, close: false });

      // Calling the deleteShape command to delete the selected shape
      cy.deleteShape({ customLayer });
    };

    // Calling the mapRightClick command to perform a right-click and select the shape
    cy.openShape({ x, y, callback, newCustomLayer });
  }
);

// Custom Cypress command to open and edit a shape's quarter (quarter-quarter)
Cypress.Commands.add('openAndEditShapeQuater', ({ x, y, expectedShape, newCustomLayer }) => {
  // Callback function to be executed after opening the shape's quarter for editing
  const callback = customLayer => {
    // Clicking on the quarter-southwest button to open the shape's quarter for editing
    cy.get('[data-testid="qtr-sw"]').click();

    // Intercepting and waiting for the updateCustomLayer request
    cy.interceptAndWait(
      ['updateCustomLayer'],
      alias => {
        // Clicking on the update quarter button to confirm the edits
        cy.get('[data-testid="update-qtr"]').click();

        // Waiting for the response to the updateCustomLayer request
        cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then(response => {
          // Extracting the updated custom layer data from the response
          const { customLayer } = response.response.body.data.updateCustomLayer;

          // Asserting that the updated shape's geometry matches the expected shape
          expect(isEqual(customLayer.shapeJson.geometry, expectedShape)).to.be.equal(
            true
          );

          // Return values from command
          cy.wrap({
            createdShapeName: customLayer.name,
            createdShapeId: customLayer._id,
            customLayer
          });
        });
      },
      { wait: false }
    );
  };

  // Calling the openShape command to open the shape for editing and execute the callback function
  cy.openShape({ x, y, callback, newCustomLayer });
});

// Custom Cypress command to open and verify a shape
Cypress.Commands.add('openAndVerifyShape', ({ x, y, shapeType }) => {
  // Callback function to delete the shape once it's opened
  const callback = customLayer => {
    // Calling the 'verifyShape' command with the custom layer data and shapeType
    cy.verifyShape({ customLayer, shapeType });
  };

  // Opening the shape at the specified coordinates and invoking the callback to delete it
  cy.openShape({ x, y, callback });
});

// Define a custom Cypress command named 'waitUntilMapRefDefined'
Cypress.Commands.add('waitUntilMapRefDefined', ({ timeout = basic_timeouts.longTimeout, interval = 1000 } = {}) => {
  // Use Cypress' built-in 'waitUntil' command to wait until a condition becomes truthy
  return cy.waitUntil(
    // Define the condition to check whether 'window.mapRef' is defined
    () => window.mapRef,
    // Specify options for waiting, including timeout, interval, and error message
    {
      timeout, // Timeout value in milliseconds (defaults to 'basic_timeouts.longTimeout')
      interval, // Polling interval in milliseconds (defaults to 1000 milliseconds or 1 second)
      errorMsg: 'mapRef was not defined within the timeout period', // Error message displayed if timeout occurs
    }
  );
});
