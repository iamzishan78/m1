import React, { useContext, useMemo } from 'react';

import { Container, Button, ButtonGroup } from '@material-ui/core';

import RelatedFile from 'components/Document/components/RelatedFile';
import { DrawerContext } from 'components/Land/components/Agreements/detailComponents/DrawerContext';
import MRTTable from 'components/MRTTable';

import { AppContext } from 'AppContext';

import { usetableStyles } from './style';

function RelatedDocumentsTable(props) {
	const { moduleId, relatedObjectType } = props;
	const classes = usetableStyles();

	const [, setStateApp] = useContext(AppContext);
	const [drawer, setDrawer] = useContext(DrawerContext);

	// On row click action
	const onClickedRow = selectedRow => {
		setDrawer('dcmnt');
		setStateApp(state => ({
			...state,
			selectedDocument: selectedRow,
		}));
	};

	const RelatedDocumentsOverrideMeta = useMemo(
		() => ({
			...props.overrideMeta,
			onClickedRow: onClickedRow,
			CustomToolBar: () => {
				return (
					<ButtonGroup variant="contained" style={{ height: '30px' }} color="primary" aria-label="split button">
						<Button
							id="addRelatedDocumentButton"
							size="small"
							color="primary"
							aria-label="select merge strategy"
							aria-haspopup="menu"
							onClick={() => {
								setDrawer('dcmnt');
								setStateApp(stateApp => ({ ...stateApp, selectedDocument: null }));
							}}
						>
							+ ADD DOCUMENT
						</Button>
					</ButtonGroup>
				);
			},
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[props.overrideMeta]
	);

	return (
		<Container maxWidth={false} className={classes.container} id={props.id ? props.id : props.parent}>
			<MRTTable name="RelatedDocumentTable" overrideMeta={RelatedDocumentsOverrideMeta} />

			{drawer === 'dcmnt' && (
				<RelatedFile
					relatedObjectType={relatedObjectType}
					relatedObjectId={moduleId}
					setShowDocumentSlider={setDrawer}
				/>
			)}
		</Container>
	);
}

export default React.memo(RelatedDocumentsTable);
