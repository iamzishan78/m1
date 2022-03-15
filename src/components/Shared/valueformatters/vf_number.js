export default function vf_number(value) {
  return new Intl.NumberFormat("en-IN", { maximumSignificantDigits: 21 }).format(value);
}
