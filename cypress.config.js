const { defineConfig } = require("cypress");

let globalData = { agreementData: {}, relatedTractData: {} };
module.exports = defineConfig({
  projectId: "hzhfd6",
  chromeWebSecurity: false,
  video: true,
  videoCompression: 32,
  videoUploadOnPasses: false,
  retries: 2,
  numTestsKeptInMemory: 2,  // Number of tests to keep in memory for debugging purposes

  env: {
    TENENT: 'm1production'
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("task", {
        setAgreementData: (data) => {
          globalData = { ...globalData, agreementData: data };
          return null;
        },
        setRelatedTractData: (data) => {
          globalData = { ...globalData, relatedTractData: data };
          return null;
        },
        getGlobalData: () => {
          return globalData;
        },
      });
    },
  },

  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
    specPattern: 'cypress/component/**/*.cy.*'
  },
});
