import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useApolloClient, useLazyQuery } from '@apollo/client';

import { GET_ES_PAGINATED_LIST } from 'graphQL/useQueryESPaginatedList';
import { TENANTWELL } from 'graphQL/useQueryTenantWell';
import { PERMITDETAILQUERY } from 'graphQL/useQueryRecentPermitDetails';
import { popupController } from 'hookstate/popupStateController';
import { drawWellBoundary } from 'components/MapControls/components/DrawShapes/drawShapesHelpers';

const PermitClick = () => {
	const { id: paramId } = useParams();

	const { permitSelectedCoordinates, selectedPermit, popupStateValues } =
		popupController.useState(
			['selectedPermitId', 'permitSelectedCoordinates', 'selectedPermit'],
			'popupStateValues'
		);
	const client = useApolloClient();

	const [getRecentPermitDetail, { data: dataPermitSummary }] = useLazyQuery(
		PERMITDETAILQUERY,
		{
			fetchPolicy: 'network-only',
		}
	);

	const getElasticWell = async paramId => {
		const { data: well } = await client.query({
			query: GET_ES_PAGINATED_LIST,
			variables: {
				esIndex: 'platformData:wells',
				pagination: {
					first: 1,
					keep_alive: '1micros',
				},
				search: `_id:${paramId.toLowerCase()}`,
				filters: [],
				sort: [],
			},
		});
		const { data: tenantWell } = await client.query({
			query: TENANTWELL,
			variables: {
				globalWellId: well.getESPaginatedList.hits[0]?.id,
			},
		});
		return {
			...well.getESPaginatedList.hits[0],
			tenantWellId: tenantWell?.tenantWell?.tenantWellId,
		};
	};

	// For recently submitted permits
	useEffect(() => {
		const { selectedPermitId, permitSelectedCoordinates } = popupStateValues;

		const properties = popupController.getValue('data');

		(async () => {
			if (
				!selectedPermitId ||
				!permitSelectedCoordinates ||
				permitSelectedCoordinates?.length === 0
			)
				return;

			let currentFeature = properties ? { properties } : null;

			if (!currentFeature) {
				currentFeature = {
					properties: { ...(await getElasticWell(selectedPermitId)) },
				};
				if (currentFeature?.properties?.Id)
					currentFeature.properties.id = currentFeature.properties.Id;
			}
			if (currentFeature) {
				drawWellBoundary(permitSelectedCoordinates);
				popupController.createPopUp(currentFeature.properties, paramId);
				popupController.updateState({
					selectedPermit: currentFeature.properties,
				});
				window.mapRef?.resize();
			}
		})();
	}, [permitSelectedCoordinates]);

	useEffect(() => {
		const { selectedPermit } = popupStateValues;

		if (selectedPermit && !selectedPermit.hasOwnProperty('Lease')) {
			getRecentPermitDetail({
				variables: { id: selectedPermit.PermitId },
			});
		}
	}, [selectedPermit]);

	useEffect(() => {
		if (!dataPermitSummary?.recentPermitDetail) return;

		const { selectedPermit } = popupStateValues;

		popupController.updateState({
			selectedPermit: {
				...selectedPermit,
				...dataPermitSummary.recentPermitDetail[0],
			},
		});
	}, [dataPermitSummary]);

	return null;
};

export default PermitClick;
