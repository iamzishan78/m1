import React, { useContext, useState, useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import mapboxgl from 'mapbox-gl';
import { AppContext } from '../../../AppContext';
import { uid } from 'uid';
import { popupController } from 'hookstate/popupStateController';
import { mapStateController } from 'hookstate/mapStateController';

const useStyles = makeStyles(theme => ({
	MSWrapper: {
		width: '100%',
		minHeight: '419.556px !important',
		overflow: 'hidden !important',
		padding: '10px',
	},
	map: {
		width: '100%',
		height: '100%',
		overflow: 'hidden !important',
		'& canvas': {
			height: '100% !important',
		},
		'& .mapboxgl-canvas-container': {
			width: '100% !important',
			height: '100% !important',
		},
		'& a.mapboxgl-ctrl-logo, .mapboxgl-ctrl.mapboxgl-ctrl-attrib, .mapboxgl-ctrl-compass': {
			display: 'none',
		},
		'& .mapboxgl-ctrl-group': { backgroundColor: '#0e111a' },
		'& .mapboxgl-ctrl button.mapboxgl-ctrl-zoom-in .mapboxgl-ctrl-icon': {
			backgroundImage:
				'url(\'data:image/svg+xml;charset=utf-8,%3Csvg width="29" height="29" viewBox="0 0 29 29" xmlns="http://www.w3.org/2000/svg" fill="%23FFFFFF"%3E%3Cpath d="M14.5 8.5c-.75 0-1.5.75-1.5 1.5v3h-3c-.75 0-1.5.75-1.5 1.5S9.25 16 10 16h3v3c0 .75.75 1.5 1.5 1.5S16 19.75 16 19v-3h3c.75 0 1.5-.75 1.5-1.5S19.75 13 19 13h-3v-3c0-.75-.75-1.5-1.5-1.5z"/%3E%3C/svg%3E\')',
		},
		'& .mapboxgl-ctrl button.mapboxgl-ctrl-zoom-out .mapboxgl-ctrl-icon': {
			backgroundImage:
				'url(\'data:image/svg+xml;charset=utf-8,%3Csvg width="29" height="29" viewBox="0 0 29 29" xmlns="http://www.w3.org/2000/svg" fill="%23FFFFFF"%3E%3Cpath d="M10 13c-.75 0-1.5.75-1.5 1.5S9.25 16 10 16h9c.75 0 1.5-.75 1.5-1.5S19.75 13 19 13h-9z"/%3E%3C/svg%3E\')',
		},
		'& .mapboxgl-ctrl-top-left': {
			marginTop: '140px',
			marginLeft: ({ expandedPanel }) => (expandedPanel ? '425px' : '2px'),
		}, // Update zoom icon position on toggle side bar
	},
	footerLeftLogo: {
		position: 'absolute',
		bottom: '5px',
		zIndex: '1',
		left: '10px',
	},
}));

export default function CardDetailsMap() {
	const [stateApp] = useContext(AppContext);
	const [map, setMap] = useState(null);
	const [mapStyles, setMapStyles] = useState([]);
	const mapEl = useRef(null);
	const [flyVar1, setFlyVar1] = useState([null]);
	mapboxgl.accessToken = stateApp.mapboxglAccessToken;

	const popupState = popupController.useState(['selectedWell']);

	const selectedWell = popupState?.stateValues?.selectedWell;

	//   useEffect(() => {
	//     const req = new Request(
	//       "https://api.mapbox.com/styles/v1/m1neral?access_token=sk.eyJ1IjoibTFuZXJhbCIsImEiOiJjazdkbGg1YXAwMjVqM2VwanZzbm95Z2dvIn0.cdoQNZU42xxbybyGxlBNkw",
	//       {
	//         method: "GET",
	//         mode: "cors",
	//         headers: {
	//           Accept: "application/json",
	//           "Content-Type": "application/json",
	//         },
	//       }
	//     );

	//     const abortController = new AbortController();
	//     const signal = abortController.signal;

	//     fetch(req, { signal: signal })
	//       .then((results) => results.json())
	//       .then((data) => {
	//         setMapStyles(data.slice(0, 5));
	//       });

	//     //clean up
	//     return function cleanup() {
	//       abortController.abort();
	//     };
	//   }, []);

	function getIndex(value, arr, prop) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i][prop] === value) {
				return i;
			}
		}
		return -1; //to handle the case where the value doesn't exist
	}

	useEffect(() => {
		map.jumpTo({
			center: [selectedWell.longitude, selectedWell.latitude],
			zoom: 16,
			bearing: -10,
			// flyTo v
			// speed: 0.4,
			// duration: 10000,
			// easing: function (t) {
			//   return Math.sin((t * Math.PI) / 2);
			// },
		});

		setFlyVar1(false);

		map.on('moveend', function (e) {
			if (
				map.getBearing() === -10 &&
				map.getZoom() === 16
				// && map.getCenter()===[
				//                       selectedWell.longitude,
				//                       selectedWell.latitude,
				//                     ]
			) {
				map.jumpTo({
					center: [selectedWell?.longitude, selectedWell?.latitude],
					zoom: 16,
					bearing: 540,
					// flyTo v
					// speed: 0.4,
					// duration: 100000,
					// easing: function (t) {
					//   return Math.sin((t * Math.PI) / 2);
					// },
				});
			}
		});
	}, [popupState.selectedWell]);

	useEffect(() => {
		if (mapStyles.length > 0) {
			const SET_INITIAL_MAP_STYLE = 'Satellite';
			var index = getIndex(SET_INITIAL_MAP_STYLE, mapStyles, 'name');
			const mapVars = mapStateController.getValue('mapVars');

			const initializeMap = ({ setMap, mapEl, setStateApp }) => {
				let id = mapEl.current.id;

				let newMap;

				if (selectedWell && selectedWell.longitude && selectedWell.latitude)
					newMap = new mapboxgl.Map({
						container: `${id}`,
						style: 'mapbox://styles/m1neral/' + mapStyles[index].id,
						center: [selectedWell.longitude, selectedWell.latitude],
						zoom: 5,
						pitch: 70,
						bearing: 20,
					});
				else
					newMap = new mapboxgl.Map({
						container: `${id}`,
						style: 'mapbox://styles/m1neral/' + mapStyles[index].id,
						center: mapVars.center,
						zoom: mapVars.zoom,
						pitch: mapVars.pitch,
						bearing: mapVars.bearing,
					});

				var el = document.createElement('div');
				el.style.backgroundImage = 'url(icons/favicon-inverted.png)';
				el.style.width = '28px';
				el.style.height = '64px';

				/// optimized interactions w/ map
				newMap.scrollZoom.enable();
				newMap.dragPan.enable();
				newMap.dragRotate.enable();
				newMap.keyboard.enable();
				newMap.doubleClickZoom.disable();
				newMap.boxZoom.enable();
				newMap.touchZoomRotate.enable();

				newMap.addControl(
					new mapboxgl.ScaleControl({
						maxWidth: 80,
						unit: 'imperial',
					}),
					'bottom-right'
				);

				newMap.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

				if (selectedWell && selectedWell.longitude && selectedWell.latitude)
					new mapboxgl.Marker(el).setLngLat([selectedWell.longitude, selectedWell.latitude]).addTo(newMap);

				newMap.on('load', function (e) {
					setMap(newMap);
				});
			};

			if (!map) {
				initializeMap({ setMap, mapEl });
			} else {
				map.setLayoutProperty('wellpoints', 'visibility', 'visible');
				map.setLayoutProperty('welllines', 'visibility', 'visible');

				map.on('moveend', ({ originalEvent }) => {
					if (originalEvent) {
						map.fire('usermoveend');
					} else {
						map.fire('flyend');
					}
				});

				if (selectedWell && selectedWell.longitude && selectedWell.latitude) setFlyVar1(true);

				// map.jumpTo({
				//     center: [
				//       selectedWell.longitude,
				//       selectedWell.latitude,
				//     ],
				//     // zoom: 16,
				//     bearing: 540,
				//     // flyTo v
				//     // speed: 0.4,
				//     // duration: 10000,
				//   });

				// map.on("click", function (e) {
				//   map.rotateTo.disable()
				// });

				// map.on("flyend", function (e) {
				//     // map.jumpTo({
				//     //   center: [
				//     //     selectedWell.longitude,
				//     //     selectedWell.latitude,
				//     //   ],
				//     //   //zoom: 16,
				//     //   bearing: 180,
				//     //   // flyTo v
				//     //   // speed: 0.0001,
				//     //   // screenSpeed: 0.001,
				//     // });
				//     map.jumpTo({
				//       // center: [
				//       //   selectedWell.longitude,
				//       //   selectedWell.latitude,
				//       // ],
				//       // //zoom: 16,
				//       bearing: 540,
				//       //essential: false,
				//       // // flyTo v
				//       // // speed: 0.0001,
				//       // // duration: 10000,
				//       // // screenSpeed: 0.001,
				//     });
				// });
			}
		}
	}, [map, mapStyles]);

	let classes = useStyles();

	return (
		<div className={classes.MSWrapper}>
			<div className={classes.map} ref={mapEl} id={`cardDetailsMap${uid()}`}>
				<div className={classes.footerLeftLogo}>
					<img src="icons/M1LogoWhiteTransparent.png" alt="logo" width="75" />
				</div>
			</div>
		</div>
	);
}
