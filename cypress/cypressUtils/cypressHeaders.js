import ldata from "../fixtures/ldata.json";

export const headers = {
  "Content-Type": "application/json",
  "X-ZUMO-AUTH": ldata.x_zumo_auth,
  'X-MS-TOKEN-AAD-ID-TOKEN': ldata.access_token,
  'CYPRESS': 'true',
};



