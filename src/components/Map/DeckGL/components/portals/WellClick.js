import { memo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';

import { GET_ES_PAGINATED_LIST } from 'graphQL/useQueryESPaginatedList';
import { TENANTWELL } from 'graphQL/useQueryTenantWell';
import { popupController } from 'hookstate/popupStateController';

function WellClick() {
	const { paramId } = useParams();

	const { wellSelectedCoordinates, selectedWellId } = popupController.useState([
		'wellSelectedCoordinates',
		'selectedWellId',
	]);

	const client = useApolloClient();

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
				globalWellId: well.getESPaginatedList.hits?.[0]?.id,
			},
		});
		return {
			...well.getESPaginatedList.hits[0],
			tenantWellId: tenantWell?.tenantWell?.tenantWellId,
		};
	};

	useEffect(() => {
		(async () => {
			const { selectedWellId: selectedWellIdVal, data } = popupController.getValues(['selectedWellId', 'data']);

			if (!selectedWellIdVal) return;

			const currentFeature = {};

			if (data) {
				currentFeature.properties = { ...data };
				await new Promise(resolve => setTimeout(resolve, 0));
			} else {
				currentFeature.properties = { ...(await getElasticWell(selectedWellIdVal)) };
			}

			if (currentFeature?.properties?.Id) currentFeature.properties.id = currentFeature.properties.Id;

			if (currentFeature) {
				popupController.createPopUp(currentFeature.properties, paramId);
				popupController.updateState({
					selectedWell: currentFeature.properties,
				});

				window.mapRef?.resize();

				if (data) {
					currentFeature.properties = { ...(await getElasticWell(selectedWellIdVal)) };

					if (popupController.getValue('data'))
						popupController.updateState({
							selectedWell: currentFeature.properties,
							data: undefined,
						});
				}
			}
		})();
	}, [wellSelectedCoordinates, selectedWellId]);

	return null;
}

export default memo(WellClick);
