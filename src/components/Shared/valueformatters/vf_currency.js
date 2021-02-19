
// this function is intended to convert a numeric string to currency

export default function vf_currency(value) {
    var formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumSignificantDigits: 21,
      });

    const valueFormatter = (v) => {
        console.log('formatter',formatter.format(parseInt(v)))
        return formatter.format(parseInt(v));
      };

          
    return valueFormatter(value)
}
