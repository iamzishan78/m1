import moment from "moment";

import { getSession } from "utils/user";
import { wellsKeys } from "utils/data";
import { tenantsCredentials } from "components/Login/AADAuthConfig";

const apolloClientEndpointDev = "http://localhost:7071/api/m1graph";
const isDev = process.env.REACT_APP_NODE_ENV === "development";

export const copy = (data) => {
  return data ? JSON.parse(JSON.stringify(data)) : null;
};

export const getURL = () => {
  let tenantName = window.sessionStorage.getItem("tenantName");
  if (tenantName) {
    let tenant = tenantsCredentials(tenantName);
    return isDev ? apolloClientEndpointDev : tenant.apolloClientEndpoint;
  }
};

export const getHeaders = () => {
  const session = getSession();
  const headers = { "X-ZUMO-AUTH": session.authToken };
  if (isDev) {
    headers["X-MS-TOKEN-AAD-ID-TOKEN"] = session.accessToken;
  }
  return headers;
};

export const API_TYPE = (action) => ({
  STARTED: `${action}_STARTED`,
  FULLFILLED: `${action}_FULLFILLED`,
  REJECTED: `${action}_REJECTED`,
});

export const getSelectedFeaturePolygonString = (feature) => {
  let polygonString = "POLYGON((";
  feature.geometry.coordinates[0].forEach((coordinate, index) => {
    polygonString += coordinate[0] + " " + coordinate[1];
    if (index < feature.geometry.coordinates[0].length - 1) {
      polygonString += ", ";
    }
  });
  polygonString += "))";

  return polygonString;
};

export const formatTaxOwners = (owners, formData) => {
  owners = owners.map((owner) => owner.node);
  const updateOwners = [];
  for (let i = 0; i < owners.length; i++) {
    let lastName = "";
    let firstName = "";
    let middleName = "";
    let newFullName = owners[i].name;
    if (owners[i].OwnerType === "INDIVIDUAL") {
      lastName = owners[i].name.split(" ")[0].trim();
      const remainingName = owners[i].name.replace(lastName, "").trim();
      firstName = remainingName.split(" ")[0].trim();
      middleName = remainingName.replace(firstName, "").trim();
      newFullName = [firstName, middleName, lastName]
        .filter((el) => !!el)
        .join(" ");
    }
    updateOwners.push({
      "entityDetail.lastName": lastName,
      "entityDetail.firstName": firstName,
      "entityDetail.middleName": middleName,
      createBy: formData.userId,
      tags: formData.tags,
      "entityDetail.name": newFullName,
      lastUpdateBy: formData.userId,
      campaignName: formData.campaign?.name,
      "entityDetail.zip": owners[i].Zip,
      "entityDetail.city": owners[i].City,
      "entityDetail.state": owners[i].State,
      status: formData.contactStatus,
      contactOwner: formData.contactOwner,
      ownerType: owners[i].OwnerType,
      "entityDetail.address1": owners[i].StreetAddress,
      "entityDetail.globalOwner": owners[i].globalOwnerId,
    });
  }
  return updateOwners;
};

export const getSearchQuery = (extendSearchQuery, filters) => {
  let query = extendSearchQuery;
  Object.entries(filters).map((filter, index) => {
    for (let i = 0; i < filter[1]?.length; i++) {
      if (query && i === 0) {
        query = query + " AND ";
      }
      query = `${query} ${i === 0 ? "(" : "OR"} ${filter[0]}.keyword:"${filter[1][i]}"${i === filter[1].length - 1 ? ")" : ""}`;
    }
    return true;
  });
  return query;
};

export const getFilters = (filters) => {
  const customFilters = [];
  Object.entries(filters).map((filter, index) => {
    if (filter[1].from || filter[1].to) {
      customFilters.push({
        field: filter[0],
        value: {
          range: {
            [filter[0]]: {
              gte: filter[1].from ? filter[1].from : null,
              lte: filter[1].to ? filter[1].to : null,
            },
          },
        },
      });
    }
    return true;
  });
  return customFilters;
};

export const getShapeFilter = (polygon) => {
  const coordinates = [];
  if (polygon && typeof polygon === "string" && polygon.includes("POLYGON")) {
    let data = polygon.replace("POLYGON((", "").replace("))", "");
    data = data.split(",");
    for (let i = 0; i < data.length; i++) {
      const coor = data[i].trim().split(" ");
      coordinates.push([parseFloat(coor[0]), parseFloat(coor[1])]);
    }
  }
  return coordinates.length > 0 ? coordinates : undefined;
};

export const getContactsAddress = (contact) => {
  let address = "https://www.google.com/maps/search/";
  if (contact.address1)
    address = `${address}${contact.address1.replace(/ /g, "+")}`;
  if (contact.city) address = `${address},+${contact.city.replace(/ /g, "+")}`;
  if (contact.state) address = `${address},+${contact.state}`;
  if (contact.zip) address = `${address}+${contact.zip}`;
  return {
    ...contact,
    fullContactAddress: address,
  };
};

export const getMapFilters = (stateNav, searchInput, gridPolygonString) => {
  const extendSearchQuery = (() => {
    let searchString = ""
    if (searchInput) {
      searchString = searchInput.replace(/([!*+&|()[\]{}^~?:"])/g, "\\$1").split(/\s+/)
    }

    return searchString
      ? `(wellName:(${searchString.join('* AND ')}*) OR api:(${searchString.join('* AND ')}*))^2 OR (wellName:(${searchString.join('* ')}*) OR api:(${searchString.join('* ')}*))`
      : ""
  })()

  const search = getSearchQuery(extendSearchQuery, {
    wellType: stateNav.typeName,
    operator: stateNav.operatorName,
    wellStatus: stateNav.statusName,
    wellBoreProfile: stateNav.profileName,
  });

  const filters = getFilters({
    spudDate: {
      from: stateNav.spudDateFrom
        ? moment.parseZone(stateNav.spudDateFrom).utc(true).valueOf()
        : null,
      to: stateNav.spudDateTo
        ? moment.parseZone(stateNav.spudDateTo).utc(true).valueOf()
        : null,
    },
    permitApprovedDate: {
      from: stateNav.permitDateFrom
        ? moment.parseZone(stateNav.permitDateFrom).utc(true).valueOf()
        : null,
      to: stateNav.permitDateTo
        ? moment.parseZone(stateNav.permitDateTo).utc(true).valueOf()
        : null,
    },
    completionDate: {
      from: stateNav.completetionDateFrom
        ? moment.parseZone(stateNav.completetionDateFrom).utc(true).valueOf()
        : null,
      to: stateNav.completetionDateTo
        ? moment.parseZone(stateNav.completetionDateTo).utc(true).valueOf()
        : null,
    },
    firstProductionDate: {
      from: stateNav.firstProdDateFrom
        ? moment.parseZone(stateNav.firstProdDateFrom).utc(true).valueOf()
        : null,
      to: stateNav.firstProdDateTo
        ? moment.parseZone(stateNav.firstProdDateTo).utc(true).valueOf()
        : null,
    },
  });

  const polygon = getShapeFilter(gridPolygonString);
  return { search, filters, polygon };
};

const dataToCsv = (wells, keys, csv) => {
  for (let i = 0; i < wells.length; i++) {
    csv = csv + "\n";
    for (let j = 0; j < keys.length; j++) {
      const value = wells[i][keys[j]]
      if (typeof value === "string") {
        csv = `${j !== 0 ? csv + "," : csv}"${value}"`;
      } else {
        let stringValue = JSON.stringify(value);
        stringValue = stringValue ? stringValue.replace(/"/g, '') : '';
        csv = `${j !== 0 ? csv + "," : csv}"${stringValue}"`;
      }
    }
  }
  return csv
}

export const jsonToCSV = (wells) => {
  const keys = [];
  let csv = "";
  Object.keys(wells[0]).forEach((key) => {
    csv = `${csv ? csv + "," : ""}${key}`;
    keys.push(key);
  });
  return dataToCsv(wells, keys, csv)
};

export const wellsToCSV = (wells) => {
  let csv = "";
  for (let i = 0; i < wellsKeys.length; i++) {
    csv = `${csv ? csv + "," : ""}${wellsKeys[i]}`;
  }
  return dataToCsv(wells, wellsKeys, csv)
};
