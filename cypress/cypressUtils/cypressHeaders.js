const ldata = require('../fixtures/ldata.json');

const headers = {
	'Content-Type': 'application/json',
	'ID-TOKEN': ldata.access_token,
	CYPRESS: 'true',
};

module.exports = { headers };
