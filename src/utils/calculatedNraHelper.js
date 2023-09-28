import { addTrailingZeros } from "components/Shared/functions";

export const calculateNRAForShapeTaxOwnersTable = (uAcres, ownershipPercentage, workspaceSettings) => {
  let nra = parseFloat(uAcres || 0) * ownershipPercentage;
  if (workspaceSettings.settings?.map?.unitNra?.type === "custom" && workspaceSettings.settings?.map?.unitNra?.value) {
    nra = nra / Number(workspaceSettings.settings?.map?.unitNra?.value);
  }
  nra = addTrailingZeros(nra.toFixed(8));
  return nra;
};

export const calculateNRAForAgreementOwnerAndTractDialog = (interest1, interest2, net_acres) => {
  if (!interest1 && !interest2) return null;
  let nra = parseFloat(net_acres || 0) * (parseFloat(interest1 || 0) + parseFloat(interest2 || 0)) * 8;
  nra = addTrailingZeros(nra.toFixed(8));

  return nra;
};

export const calculateNRAForUnitOwnerDialog = (interest1, interest2, interest3, unitAcres, workspaceSettings) => {
  if (!interest3 && (!interest1 && !interest2)) return null;

  let nra = parseFloat(unitAcres || 0) * (parseFloat(interest1 || 0) + parseFloat(interest2 || 0));

  if (interest3) nra = parseFloat(interest3 || 0) * parseFloat(unitAcres || 0)

  if (workspaceSettings.settings?.map?.unitNra?.type === "custom" && workspaceSettings.settings?.map?.unitNra?.value)
    nra = nra / Number(workspaceSettings.settings?.map?.unitNra?.value);

  nra = addTrailingZeros(nra.toFixed(8));
  return nra;
};

// export const calculateNRAForParcelOwnerDialog = (interest1, interest2, interest3, net_acres, gross_acers, workspaceSettings) => {
//   if (!interest3 && (!interest1 && !interest2)) return null;

//   let nra = parseFloat(net_acres || 0) * (parseFloat(interest1 || 0) + parseFloat(interest2 || 0)) * 8;

//   if (interest3) nra = parseFloat(interest3 || 0) * parseFloat(gross_acers || 0)

//   if (workspaceSettings?.settings?.map?.unitNra?.type === "custom" && workspaceSettings.settings?.map?.unitNra?.value) {
//     nra = nra / Number(workspaceSettings.settings?.map?.unitNra?.value);
//   }

//   nra = addTrailingZeros(nra.toFixed(8));
//   return nra;
// };

export const calculateNRAForParcelOwnerDialog = (tract_gross_acres, mineral_interest, sum_of_ri, orri, workspaceSettings) => {
  const isStandardType = workspaceSettings?.settings?.map?.tractNra?.type === "standard";
  const divisor = isStandardType ? 0.125 : parseFloat(workspaceSettings?.settings?.map?.tractNra?.value || 0);
  let nra = (parseFloat(tract_gross_acres || 0) * parseFloat(mineral_interest || 0) * (parseFloat(sum_of_ri || 0) + parseFloat(orri || 0)))
  nra /= divisor;
  nra = addTrailingZeros(nra.toFixed(8));
  console.log('nra', nra)
  return nra;
};