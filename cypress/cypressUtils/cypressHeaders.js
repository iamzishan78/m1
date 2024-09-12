const ldata = require('../fixtures/ldata.json');

const headers = {
  'Content-Type': 'application/json',
  'X-ZUMO-AUTH': ldata.x_zumo_auth,
  'X-MS-TOKEN-AAD-ID-TOKEN': ldata.access_token,
  CYPRESS: 'true',
};

module.exports = { headers };
