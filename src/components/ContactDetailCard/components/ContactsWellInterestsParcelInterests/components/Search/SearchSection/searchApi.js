import debounce from "lodash/debounce";

export const callWellSearch = debounce((request, callback) => {
    const endpoint =
        "https://m1search.search.windows.net/indexes/wellheader-index/docs?api-version=2020-06-30&queryType=full&count=true&%24filter=Latitude%20ne%20null%20and%20Longitude%20ne%20null&searchFields=WellName%2CApiNumber&$top=" +
        request.top +
        "&search=" +
        encodeURIComponent(request.input.replace(/\b(?<=\w)(?=\s+)|$(?<=\w)/g, "~"));

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("api-key", "1AE3C6346B38CEB007191D51CFDDFF65");

    const options = {
        method: "GET",
        headers: headers,
    };

    fetch(endpoint, options)
        .then((response) => response.json())
        .then((response) => {
            callback(response);
        })
        .catch((error) => {
            console.log(error);
        });
}, 500)


export const callOwnerSearch = debounce((request, callback) => {
    const endpoint =
        "https://m1search.search.windows.net/indexes/globalowner-index/docs?api-version=2020-06-30&queryType=full&count=true&searchFields=OwnerName&$top=" +
        request.top +
        "&search=" +
        encodeURIComponent(request.input.replace(/\b(?<=\w)(?=\s+)|$(?<=\w)/g, "~"));

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("api-key", "1AE3C6346B38CEB007191D51CFDDFF65");

    const options = {
        method: "GET",
        headers: headers,
    };

    fetch(endpoint, options)
        .then((response) => response.json())
        .then((response) => {
            console.log(response);
            callback(response);
        })
        .catch((error) => {
            console.log(error);
        });
}, 500)