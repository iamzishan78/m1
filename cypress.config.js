const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'hzhfd6',
  chromeWebSecurity: false,

  video: true,
  videoCompression: 32,
  videoUploadOnPasses: false,
  // retries: 3,

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});