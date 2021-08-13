export * from "./deepEqual";
export * from "./setStateIfDeepEqual";
export * from "./getPolygonString";


export function truncate(str, n) {
    str = str || "";
    return (str.length > n) ? str.substr(0, n - 1) + '...' : str;
};

export function addTrailingZeros(num) {
    return num ? num.toLocaleString("en", { useGrouping: false, minimumFractionDigits: 8, maximumFractionDigits: 20 }) : num;
};