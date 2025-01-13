import gql from 'graphql-tag';

export const UPSERT_MAP_VIEW = gql`
	mutation upsertMapView($mapView: JSON) {
		upsertMapView(mapView: $mapView)
	}
`;
