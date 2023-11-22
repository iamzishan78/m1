import { addTrailingZeros } from "components/Shared/functions";

export const calculateNRAForAgreementOwnerAndTractDialog = (interest1, interest2, net_acres) => {
  if (!interest1 && !interest2) return null;
  let nra = parseFloat(net_acres || 0) * (parseFloat(interest1 || 0) + parseFloat(interest2 || 0)) * 8;
  nra = addTrailingZeros(nra.toFixed(8));

  return nra;
};

export const calculateStandardNraForUnit = ({ uAcres, working_interest, royalty_interest, orri, nri, ownershipPercentage, workspaceSettings }) => {
  const sumOfDecimalInterest = ownershipPercentage ? ownershipPercentage : (parseFloat(working_interest || 0) + parseFloat(royalty_interest || 0) + parseFloat(orri || 0) + parseFloat(nri || 0))
  const isCustomType = workspaceSettings?.settings?.map?.unitNra?.type === "custom";
  const divisor = parseFloat(workspaceSettings?.settings?.map?.unitNra?.value || 0);
  let nra = parseFloat(uAcres || 0) * sumOfDecimalInterest
  if (isCustomType)
    nra /= divisor;
  nra = addTrailingZeros(nra.toFixed(8));
  return nra;
};

export const calculateStandardNraForTract = (tract_gross_acres, mineral_interest, ri, orri, workspaceSettings) => {
  const isStandardType = workspaceSettings?.settings?.map?.tractNra?.type === "standard";
  const divisor = isStandardType ? 0.125 : parseFloat(workspaceSettings?.settings?.map?.tractNra?.value || 0);
  let nra = (parseFloat(tract_gross_acres || 0) * parseFloat(mineral_interest || 0) * (parseFloat(ri || 0) + parseFloat(orri || 0)))
  nra /= divisor;
  nra = addTrailingZeros(nra.toFixed(8));
  return nra;
};