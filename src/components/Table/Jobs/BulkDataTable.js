import { Container } from '@material-ui/core';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { copy, deepEqualObjects } from 'components/Shared/functions';
import Table from 'components/Shared/M1nTable/components/Table';
import TableHeader from 'components/Table/constants/bulk-data-header-schema';

import { usetableStyles } from '../Styles';
import TableESHOC from '../TableESHOC';

function BulkDataTable(props) {
	// const classes = useStyles();
	const classes = usetableStyles({ isFullHeight: true, isAgreementsTable: true });

	const history = useHistory();

	// queries
	const esIndex = 'jobs_flat';

	const formatHits = hits => {
		hits = hits.map(hit => {
			hit.by = hit?.user?.name;
			hit.progress = `${(hit.progress / hit.totalProgress) * 100} %`;
			hit.on = moment(hit.createAt).format('MM/DD/YYYY');

			return hit;
		});
		return hits;
	};

	useEffect(() => {
		props.setTableMeta({
			TableHeader: copy(TableHeader),
			esIndex,
			startPaginationAt: 25,
			defaultSort: { field: 'ts', order: 'desc' },
			formatHits,
		});
	}, []);

	useEffect(() => {
		if (props.clickedRow) {
			history.push({ pathname: `/admin/bulk-editing/${props.clickedRow._id}` });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.clickedRow]);

	// const createJobTest = () => {
	// 	createJob({
	// 		variables: {
	// 			jobId: props.rows[0]._id,
	// 			sendEmail: true,
	// 		},
	// 	});
	// };

	delete props.options.customRender;
	return (
		<>
			<Container maxWidth={false} className={classes.container} id={props.id ? props.id : props.parent}>
				{/* <Button
        id="addSaveButton"
        color="secondary"
        variant="contained"
        onClick={(event) => {
          createJobTest();
        }}
      >
        Edit Data
      </Button> */}
				<Table
					style={{ backgroundColor: '#fff' }}
					header={props.header}
					columns={props.columns}
					rows={props.rows}
					total={false}
					loading={props.loading}
					targetLabel={props.targetLabel}
					uploadIcon={null}
					dense={props.dense ? props.dense : undefined}
					orderByTracks={false}
					startPaginationAt={null}
					onTableChange={props.onTableChange}
					options={{
						...props.options,
					}}
					parent={props.parent}
					setColumnsBase={[]}
					{...props.esHocProps}
				/>
			</Container>
		</>
	);
}

export default React.memo(TableESHOC(BulkDataTable), deepEqualObjects);
