const mapStyles = [
    [
        {
            "version": 8,
            "name": "Dark",
            "center": [
                -100.77473566012304,
                30.92211900794169
            ],
            "zoom": 5.48051563562383,
            "bearing": 0,
            "pitch": 0,
            "sources": {
                "composite": {
                    "type": "vector",
                    "url": "mapbox://mapbox.mapbox-streets-v8,m1neral.6qq4gyn2,m1neral.41wg2sqd,m1neral.65ec6y45,m1neral.3ixc467w,m1neral.wells2020_03_30T19_36_13Z,mapbox.mapbox-terrain-v2"
                }
            },
            "created": "2020-03-30T20:19:58.061Z",
            "id": "ck8ex27k71y0d1imqf7inm7c4",
            "modified": "2020-03-30T20:19:58.061Z",
            "owner": "m1neral",
            "visibility": "private"
        },
        {
            "version": 8,
            "name": "Basic Wells",
            "center": [
                -98.96953539022269,
                28.59063229495895
            ],
            "zoom": 4.113726838418518,
            "bearing": 0,
            "pitch": 0,
            "sources": {
                "composite": {
                    "type": "vector",
                    "url": "mapbox://m1neral.wells2020_03_30T19_36_13Z,mapbox.mapbox-streets-v8,m1neral.ck5rci62q3eti2tmfk9a1234e-6yowe,m1neral.65ec6y45"
                }
            },
            "created": "2020-03-30T20:19:58.030Z",
            "id": "ck8ex27jx1yjj1imlz9amy0de",
            "modified": "2020-03-30T20:19:58.030Z",
            "owner": "m1neral",
            "visibility": "private"
        },
        {
            "version": 8,
            "name": "Satellite",
            "center": [
                -98.9,
                31.56
            ],
            "zoom": 4.74,
            "bearing": 0,
            "pitch": 0,
            "sources": {
                "mapbox://mapbox.satellite": {
                    "url": "mapbox://mapbox.satellite",
                    "type": "raster",
                    "tileSize": 256
                },
                "composite": {
                    "type": "vector",
                    "url": "mapbox://mapbox.mapbox-streets-v8,m1neral.6qq4gyn2,m1neral.ck5rci62q3eti2tmfk9a1234e-6yowe,m1neral.6872fhws,m1neral.41wg2sqd,m1neral.65ec6y45,m1neral.awmmnpgr,m1neral.3ixc467w,m1neral.wells2020_03_30T19_36_13Z"
                }
            },
            "created": "2020-03-30T20:19:58.003Z",
            "id": "ck8ex27j2098s1iqpbaqqh3f3",
            "modified": "2020-03-30T20:19:58.003Z",
            "owner": "m1neral",
            "visibility": "private"
        },
        {
            "version": 8,
            "name": "Light",
            "center": [
                -99.0432488897647,
                31.86991720750308
            ],
            "zoom": 5.323877822304273,
            "bearing": 0.07305040037226718,
            "pitch": 0,
            "sources": {
                "composite": {
                    "type": "vector",
                    "url": "mapbox://mapbox.mapbox-streets-v8,m1neral.6qq4gyn2,m1neral.ck5rci62q3eti2tmfk9a1234e-6yowe,m1neral.41wg2sqd,m1neral.65ec6y45,m1neral.awmmnpgr,m1neral.3ixc467w,m1neral.wells2020_03_30T19_36_13Z"
                }
            },
            "created": "2020-03-30T20:19:57.987Z",
            "id": "ck8ex27j40mw41iq9g1yczqaw",
            "modified": "2020-03-30T20:19:57.987Z",
            "owner": "m1neral",
            "visibility": "private"
        },

    ]


 ];

export default mapStyles[0];

// import React, {
//     useContext,
//     useState,
//     useLayoutEffect,
//     useRef,
//     useEffect
//   } from "react";


// export default function MapStyles() {

//     const [mapStyles,setMapStyles] = useState();

//     useEffect(() => {
//         //let session = sessionStorage.getItem("user");
//         //let info = JSON.parse(session);
//         //let token = info.authToken;

//         const req = new Request(
//         "https://api.mapbox.com/styles/v1/m1neral?access_token=sk.eyJ1IjoibTFuZXJhbCIsImEiOiJjazdkbGg1YXAwMjVqM2VwanZzbm95Z2dvIn0.cdoQNZU42xxbybyGxlBNkw",
//         {
//             method: "GET",
//             mode: "cors",
//             headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json"
//             }
//         }
//         );
        
        
//         // fetch(req)
//         //   .then((response) => {
//         //     return response.json();
//         //   })
//         //   .then((data) => {
//         //     console.log(data);
//         //     var mapStyles2 = data;
//         //   });

//         return fetch(req)
//         .then((response) => {
//             if(response.ok) {
//                 return response.json();
//             } else {
//                 throw new Error('Server response wasn\'t OK');
//             }
//         })
//         .then((json) => {
//             console.log(json);
//             console.log(json.slice(0,5));
//             setMapStyles(json.slice(0,5));
//             return json;
//         });

//     }, []);

 // }