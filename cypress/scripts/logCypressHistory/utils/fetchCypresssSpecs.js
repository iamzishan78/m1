const glob = require('glob');

const fetchCypressSpecs = () => {
	const { CYPRESS_FILE_PATTERN } = require('./constants');

	return new Promise((resolve, reject) => {
		glob(CYPRESS_FILE_PATTERN, (err, files) => {
			if (err) {
				reject(err);
			} else {
				resolve(files);
			}
		});
	});
};

module.exports = { fetchCypressSpecs };
