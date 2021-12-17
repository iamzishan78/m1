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
