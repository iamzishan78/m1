import commaNumber from "comma-number";
export default function vf_number(value, toFixed) {
  const numberValue = typeof value === 'number' ? value : parseFloat(value);
  const formattedValue = commaNumber(typeof toFixed === 'number' ? numberValue.toFixed(toFixed) : numberValue);
  return formattedValue === 'NaN' ? '0' : formattedValue;
}
