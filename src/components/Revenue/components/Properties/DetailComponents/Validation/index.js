import React, { useState, useEffect } from 'react';

import { Grid } from '@material-ui/core';

import { useLazyQuery } from '@apollo/client';
import sortBy from 'lodash/sortBy';

import Grids from 'components/Revenue/components/Properties/DetailComponents/Validation/Grids';
import MonthlyProductionChart from 'components/Revenue/components/Properties/DetailComponents/Validation/MonthlyProductionChart';
import OverShortComparison from 'components/Revenue/components/Properties/DetailComponents/Validation/OverShortComparison';
import ValidationFilter from 'components/Revenue/components/Properties/DetailComponents/Validation/ValidationFilter';
import { WellCardContextProvider } from 'components/WellCard/WellCardContext';
import { WellProdChartContextProvider } from 'components/WellProdChart/WellProdChartContext';

import { GET_DB_DATA } from 'graphQL/useQueryDbQuery';

const Validation = ({ propertyId }) => {
	const [esFilters, setESFilters] = useState([]);
	const [filterToggle, setFilterToggle] = useState(false);
	const [associatedWellIds, setAssociatedWellIds] = useState([]);
	const [wellProductionData, setWellProductionData] = useState([]);
	const [checkDetailsData, setCheckDetailsData] = useState([]);
	const [startDate, setStartDate] = useState(null);

	const [getDbData, { data: elasticData }] = useLazyQuery(GET_DB_DATA, { fetchPolicy: 'no-cache' });

	useEffect(() => {
		getDbData({
			variables: {
				index: 'checkdetails_flat',
				pagination: {
					first: 10000,
					after: null,
				},
				search: {
					query: '',
					fields: [],
				},
				filters: [
					{ field: 'property._id.keyword', value: propertyId },
					{ field: 'date', type: 'range', value: esFilters[0]?.value?.range?.date },
				],
			},
		});
	}, [esFilters]);

	useEffect(() => {
		if (elasticData?.getDbData?.hits?.length > 0) {
			let data = [];
			for (let i = 0; i < elasticData?.getDbData?.hits?.length; i++) {
				const check = elasticData?.getDbData?.hits[i];
				data.push({
					product: check.product,
					ReportDate: check.date,
					oil: check.product === 'OIL' ? check.grossPropertyVolume : 0,
					gas: check.product === 'GAS' ? check.grossPropertyVolume : 0,
					water: check.product === 'WATER' ? check.grossPropertyVolume : 0,
				});
			}
			data = sortBy(data, ['ReportDate']);
			setCheckDetailsData(data);
		}
	}, [elasticData]);

	return (
		<div style={{ background: 'white', padding: '10px' }}>
			<ValidationFilter
				field={'date'}
				defaultStartDate={startDate}
				setESFilters={setESFilters}
				setFilterToggle={setFilterToggle}
				filterToggle={filterToggle}
			/>

			<Grid container direction="row" display="flex" justify="space-between">
				<Grid item xs={6}>
					<WellCardContextProvider>
						<WellProdChartContextProvider>
							<MonthlyProductionChart
								filter={esFilters}
								propertyId={propertyId}
								setStartDate={setStartDate}
								wellProductionData={wellProductionData}
								setWellProductionData={setWellProductionData}
								setAssociatedWellIds={setAssociatedWellIds}
							/>
						</WellProdChartContextProvider>
					</WellCardContextProvider>
				</Grid>
				<Grid item xs={6}>
					<OverShortComparison productionData={wellProductionData} checkData={checkDetailsData} />
				</Grid>
			</Grid>

			<Grids associatedWellIds={associatedWellIds} propertyId={propertyId} />
		</div>
	);
};

export default Validation;
