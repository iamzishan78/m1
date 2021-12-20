import { getSession } from "utils/user";
import { tenantsCredentials } from "components/Login/AADAuthConfig";

const apolloClientEndpointDev = "http://localhost:7071/api/m1graph";
const isDev = process.env.REACT_APP_NODE_ENV === "development";

export const copy = (data) => {
  return JSON.parse(JSON.stringify(data));
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
      lastName,
      firstName,
      middleName,
      createBy: formData.userId,
      tags: formData.tags,
      name: newFullName,
      lastUpdateBy: formData.userId,
      zip: owners[i].Zip,
      city: owners[i].City,
      state: owners[i].State,
      status: formData.contactStatus,
      contactOwner: formData.contactOwner,
      ownerType: owners[i].OwnerType,
      address1: owners[i].StreetAddress,
      globalOwner: owners[i].globalOwnerId,
    });
  }
  return updateOwners;
};

export const getSearchQuery = (extendSearchQuery, filters) => {
  let query = extendSearchQuery
  Object.entries(filters).map((filter, index) => {
    for (let i = 0; i < filter[1]?.length; i++) {
      if (query && i === 0) {
        query = query + " AND ";
      }
      query = `${query} ${i === 0 ? "(" : "OR"} ${filter[0]}.keyword:(${
        filter[1][i]
      }) ${i === filter[1].length - 1 ? ")" : ""}`;
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
    if(polygon && typeof polygon === 'string' && polygon.includes('POLYGON')){
      let data = polygon.replace('POLYGON((', '').replace('))', '');
      data = data.split(',');
      for(let i=0; i<data.length; i++){
        const coor = data[i].trim().split(' ');
        coordinates.push([parseFloat(coor[0]), parseFloat(coor[1])])
      }
    }
    return coordinates.length > 0 ? coordinates : undefined;
}