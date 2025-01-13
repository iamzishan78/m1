import React, { useEffect, useState } from 'react';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import AspectRatioIcon from '@material-ui/icons/AspectRatio';

import { SRCenter } from 'components/Map/MapBoxDrawRotate';
import { drawShapeLayerToggle } from 'components/MapControls/commonHelper';
import { getRotateAbleShapeFromSelectedQuarters } from 'components/MapControls/components/DrawShapes/drawShapesHelpers';
import HighlightAltIcon from 'components/Shared/svgIcons/highlightAlt';
import DrawPoly from 'components/Shared/svgIcons/polygon';

import { drawController } from 'hookstate/drawStateController';

import { copy } from 'utils/helper';

export default function ShapeEditActions({ shapeEdit, shapeEditMode, actionFullEdit }) {
	const [feature, setFeature] = useState();

	const onRotateHandle = mode => {
		if (mode !== 'rotate') {
			window.drawRef?.deleteAll();
			drawController.updateState({ shapeEdit: false, shapeEditMode: '' });
		} else {
			const _feature = copy(drawController.getValue('currentFeature'));

			drawShapeLayerToggle('visible');
			window.drawRef?.deleteAll();
			getRotateAbleShapeFromSelectedQuarters(_feature, window.drawRef);
			drawController.updateState({ shapeEdit: true, shapeEditMode: 'rotate' });
		}
	};

	useEffect(() => {
		if (shapeEdit) {
			if (shapeEditMode === 'rotate') {
				onRotateHandle('rotate');
			}
			if (shapeEditMode === '' && shapeEdit) {
				drawController.updateState({ shapeEdit: false });
			}
			if (!feature) {
				setFeature(drawController.getValue('currentFeature'));
			}
		}
	}, [shapeEdit, shapeEditMode]);

	const _shapeEditMode = React.useMemo(() => {
		if (shapeEdit) {
			return shapeEditMode;
		}
		return '';
	}, [shapeEdit, shapeEditMode]);

	const onEditModeChange = mode => {
		if (mode !== 'fullEdit') {
			drawController.updateState({ shapeEditMode: '' });
			actionFullEdit();
		} else {
			if (_shapeEditMode === 'rotate') {
				window.drawRef?.deleteAll();
			}
			drawController.updateState({ shapeEditMode: 'fullEdit' });
			if (window.drawRef?.get(feature.id)) {
				window.drawRef?.delete(feature.id);
				window.drawRef?.add(feature);
			}
		}
	};

	const onPreciseEdit = mode => {
		if (mode !== 'resize') {
			drawController.updateState({ shapeEditMode: '' });
			actionFullEdit();
		} else {
			const editMode = _shapeEditMode;
			if (editMode === 'rotate') {
				window.drawRef?.deleteAll();
			}
			drawController.updateState({ shapeEditMode: 'resize' });

			setFeature(feature => {
				if (!feature.properties.isCircle) {
					const _feature = copy(feature);
					// const _bbox = bbox(feature);
					// const _bboxPolygon = bboxPolygon(_bbox);
					// _feature.geometry = _bboxPolygon.geometry;
					_feature.properties.isrotate = 1;
					window.drawRef?.deleteAll();
					if (window.drawRef?.get(_feature.id) || editMode) {
						window.drawRef?.delete(_feature.id);
						window.drawRef?.add(_feature);
					}

					window.drawRef?.changeMode('tx_poly', {
						// required
						featureId: feature.id,
						canScale: true,
						canRotate: false, // only rotation enabled
						canTrash: false, // disable feature delete

						rotatePivot: SRCenter.Center, // rotate around center
						scaleCenter: SRCenter.Opposite, // scale around opposite vertex

						singleRotationPoint: true, // only one rotation point
						rotationPointRadius: 1.4, // offset rotation point

						canSelectFeatures: false,
					});
				}
				return feature;
			});
		}
	};

	const onShapeRedraw = mode => {
		if (mode !== 'redraw') {
			drawController.updateState({ shapeEditMode: '' });
			actionFullEdit();
		} else {
			window.drawRef?.deleteAll();
			window.drawRef?.changeMode('static');
			drawController.updateState({
				shapeEditMode: 'redraw',
				reDrawShape: true,
			});
		}
	};

	const isMultiPolygon = feature?.geometry?.type === 'MultiPolygon';
	return (
		<>
			<Tooltip title="Redraw Shape">
				<IconButton
					size="small"
					aria-label="Redraw Shape"
					data-testid="redraw-shape"
					onClick={() => onShapeRedraw(_shapeEditMode !== 'redraw' ? 'redraw' : '')}
				>
					<HighlightAltIcon color="secondary" className={_shapeEditMode === 'redraw' ? 'selected' : ''} />
				</IconButton>
			</Tooltip>

			<Tooltip title="Resize Shape">
				<IconButton
					disabled={!!isMultiPolygon}
					size="small"
					aria-label="Resize Shape"
					data-testid="resize-shape"
					onClick={() => onPreciseEdit(_shapeEditMode !== 'resize' ? 'resize' : '')}
				>
					<AspectRatioIcon
						color="colorDisabled"
						className={_shapeEditMode === 'resize' ? 'selected' : isMultiPolygon ? 'disabled' : ''}
					/>
				</IconButton>
			</Tooltip>

			<Tooltip title="Adjust Shape Points">
				<IconButton
					size="small"
					aria-label="Adjust Shape Points"
					data-testid="adjust-shape-points"
					onClick={() => onEditModeChange(_shapeEditMode !== 'fullEdit' ? 'fullEdit' : '')}
				>
					<DrawPoly color="secondary" className={_shapeEditMode === 'fullEdit' ? 'selected' : ''} />
				</IconButton>
			</Tooltip>
		</>
	);
}
