/* eslint-disable no-undef */

// Importing MRTTable component
import MRTTable from 'components/MRTTable';
import { basic_timeouts } from '../../cypressUtils/data';

// Definition of columns for the table
const columns = [
	{
		name: 'Property',
		type: 'combination_value',
		selector: 'div > div > div > a',
	},
	{
		name: 'Property Description',
		type: 'string',
	},
];

const checkWellFields = job => {
	cy.wrap(job.resultsPayload.datasets[0].exportResponse[0]['Well API#']).should('exist').and('not.be.empty');
	cy.wrap(job.resultsPayload.datasets[0].exportResponse[0]['Well Name']).should('exist').and('not.be.empty');
};

// Test suite description for Properties Table
describe('Properties Table', () => {
	// Before each test, intercept network requests and mount the MRTTable component
	beforeEach(() => {
		cy.interceptAndWait(['getESSimpleSearch', 'properties_flat'], () => {
			cy.viewport(1600, 1200).mount(<MRTTable name="PropertiesTable" />, {
				spec: 'PropertiesTableSpec',
			});
		});
	});

	// it('Filters by name and checks is primary address value is exporting', () => {
	//   cy.get(`[data-testid="MoreVertIcon"]`).first().click();
	//   cy.wait(basic_timeouts.shorTimeout);
	//   cy.get('[data-testid="sentinelStart"] + div ul li:nth-child(5)').click();
	//   cy.wait(basic_timeouts.shorTimeout);
	//   cy.get(`[data-testid="MoreVertIcon"]`).first().click();
	//   cy.wait(basic_timeouts.shorTimeout);
	//   cy.get('[data-testid="sentinelStart"] + div ul li:nth-child(5)').click();
	//   cy.wait(basic_timeouts.shorTimeout);
	//   cy.get('[data-testid="sentinelStart"] + div ul li:nth-child(9):eq(1)').click();
	//   cy.get('.MuiButtonBase-root[aria-label="Show/Hide filters"]').click();

	//   // Selectingn one test property
	//   cy.mrtFilterBySearch({
	//     value: '100687',
	//     columnlabel: 'Property',
	//     alias: 'Property',
	//   });
	//   cy.get('[data-testid="download-csv"]').click();

	//   // Waiting for job to complete
	//   cy.interceptAndWait(
	//     ['initializeExportJob'],
	//     (alias) => {
	//       cy.contains('span.MuiButton-label', 'Export').click();
	//       cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then((response) => {
	//         const jobId = response.response.body.data.initializeExportJob.job._id;
	//         // passed a callback(checkWellFields) which is called after the job execution and verify the fields
	//         cy.pollJobStatus({ jobId, callback: checkWellFields });
	//       });
	//     },
	//     { wait: false }
	//   );
	// });

	// Test case to check the filter on Property Column
	it('should check the filter on Property Column', () => {
		cy.get('.MuiButtonBase-root[aria-label="Show/Hide filters"]').click();
		cy.mrtSingleSelect({ column: columns[0] });
	});

	// Test case to check the filter on Property Description Column
	it('should check the filter on Property Description Column', () => {
		cy.get('.MuiButtonBase-root[aria-label="Show/Hide filters"]').click();
		cy.mrtSingleSelect({ column: columns[1] });
	});

	// Test case to check sorting is working fine on different columns
	it('should check sorting is working fine on different columns', () => {
		cy.wait(100);

		cy.mrtSortColumn({ column: columns[0] });
		cy.mrtSortColumn({ column: columns[1] });
	});
});
