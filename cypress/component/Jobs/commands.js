/* eslint-disable no-undef */
import { GET_JOBS_STATUS } from 'graphQL/useQueryGetJobStatus';
import { headers } from '../../cypressUtils/cypressHeaders';
import ldata from '../../fixtures/ldata.json';

// headers for job polling
const getJobPayload = {
  operationName: 'getJobsStatus',
  variables: {
    userId: '659ce7cf97935e0ffa857858',
    showProgress: true,
  },
  query: GET_JOBS_STATUS.loc.source.body,
};

// Custom Cypress command for comparing sorting order of elements
Cypress.Commands.add(
  'pollJobStatus',
  // Destructuring parameters to extract jobId, callback
  ({ jobId, callback }) => {
    // Make a POST request to get jobs
    cy.request({
      method: 'POST',
      url: ldata.url,
      headers: headers,
      body: getJobPayload,
    }).then(response => {
      // Find the job with the specified jobId in the response
      console.log("response.body.data: ", response.body.data)
      const job = response.body.data.getJobsStatus.jobs.find(job => job._id === jobId);
      console.log("job: ", job)

      // Check if the job status is 'Failed'
      if (job.status === 'Failed') {
        cy.fail('The job has failed.');
      }

      // Check if the job status is 'Completed'
      if (job.status === 'Completed') {
        // If completed, invoke the callback with the job details
        callback(job);
      } else {
        // If the job is still in progress, wait for 5 seconds and then recursively call the function
        cy.wait(5000);
        cy.pollJobStatus({ jobId, callback });
      }
    });
  }
);
