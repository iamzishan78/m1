export default function vf_number(value) {
  return new Intl.NumberFormat("en-US", { maximumSignificantDigits: 21 }).format(value);
}
