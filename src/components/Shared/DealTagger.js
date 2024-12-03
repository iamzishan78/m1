import React, { useContext, useState, useEffect, useRef } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import { AppContext } from '../../AppContext';
import { CircularProgress } from '@material-ui/core';
import { isEqual, differenceWith, filter } from 'lodash';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { TAGSBYOBJECTIDQUERY } from '../../graphQL/useQueryTagsByObjectId';
import { UPSERTTAG } from '../../graphQL/useMutationUpsertTag';
import { REMOVETAG } from '../../graphQL/useMutationRemoveTag';
import ClearIcon from '@material-ui/icons/Clear';
import './Tagger.css';

// import value formatters
import capitalizeFirstLetter from './valueformatters/capitalize-first-letter.js';
import { generateColor, getOppositeHexColor } from 'utils/helper';
import { GETDEALTAGOPTIONS } from 'graphQL/useQueryUserAvailableTags';

const useStyles = makeStyles(theme => ({
	rootDiv: {
		'& > * + *': {
			marginTop: theme.spacing(5),
		},
		'& .MuiAutocomplete-clearIndicator': {
			display: 'none',
		},

		'& .MuiInputBase-root': {
			padding: 0,
		},

		'& fieldset': {
			padding: 0,
			border: 0,
		},
	},
	switchButtom: {
		float: 'right',
		width: 'fit-content',
		alignSelf: 'flex-end',
		marginRight: 0,
		'& span.MuiTypography-body1': {
			fontSize: '0.9rem',
		},
	},
	switchTextDeselected: {
		color: 'rgb(141, 141, 141)',
	},
	publicLeftBottom: {
		float: 'none',
		flexDirection: 'row',
		alignSelf: 'unset',
		margin: 0,
		'& .MuiTypography-root': {
			display: 'none',
		},
		'& .h4Before': { margin: '0 13px', color: '#202020 !important' },
		'& .h4After': { margin: '0 0 0 13px', color: '#B7B7B7 !important' },
	},
	chip: {
		'& .MuiAutocomplete-inputRoot': { minHeight: '56px' },
		'& .MuiChip-root': {
			backgroundColor: '#ECEDED',
			color: '#606060',
		},
	},
	input: {
		'& input': {
			caretColor: ({ showPlusAddIcon }) => (!showPlusAddIcon ? '' : 'transparent'),
			color: ({ showPlusAddIcon, disabled }) => (!showPlusAddIcon ? '' : disabled ? 'gray' : '#008ebf'),
			backgroundColor: ({ showPlusAddIcon, disabled }) => (!showPlusAddIcon ? '' : disabled ? 'lightgray' : '#D5F4FF'),
			maxWidth: ({ showPlusAddIcon }) => (!showPlusAddIcon ? '' : '33px'),
			width: ({ showPlusAddIcon }) => (!showPlusAddIcon ? '' : '33px'),
			height: ({ showPlusAddIcon }) => (!showPlusAddIcon ? '' : '32px'),
			fontSize: ({ showPlusAddIcon }) => (!showPlusAddIcon ? '' : '25px'),
			margin: ({ showPlusAddIcon }) => (!showPlusAddIcon ? '' : '3px'),
			padding: ({ showPlusAddIcon }) => (!showPlusAddIcon ? '' : '0px !important'),
			borderRadius: ({ showPlusAddIcon }) => (!showPlusAddIcon ? '' : '50%'),
			textAlign: ({ showPlusAddIcon }) => (!showPlusAddIcon ? '' : 'center'),
			cursor: ({ showPlusAddIcon }) => (!showPlusAddIcon ? '' : 'pointer'),
			'&:hover': {
				boxShadow: ({ showPlusAddIcon }) =>
					!showPlusAddIcon
						? ''
						: '0px 2px 2px -1px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.12), 0px 1px 10px 0px rgba(0,0,0,0.1)',
				backgroundColor: ({ showPlusAddIcon }) => (!showPlusAddIcon ? '' : 'rgba(0, 0, 0, 0.08)'),
			},
			transition: ({ showPlusAddIcon }) =>
				!showPlusAddIcon
					? ''
					: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
		},
	},
}));

export default function Tags(props) {
	const [stateApp] = useContext(AppContext);
	const [tagsArray, setTagsArray] = useState([]);
	const [dealTagOptions, setDealTagOptions] = useState([]);
	const [tFActive, setTFActive] = useState(false);
	const [textValue, setTextValue] = useState('');
	const [loadingTags, setLoadingTags] = useState(true);
	const [addInDropDown, setAddInDropDown] = useState(false);

	const showPlusAddIcon = () => {
		if (tFActive || textValue || props.hidePlusIcon) return false;
		return true;
	};

	const classes = useStyles({ ...props, showPlusAddIcon: showPlusAddIcon(), disabled: !props.targetSourceId });
	const [getTagsByObjectId, { data: dataTags }] = useLazyQuery(TAGSBYOBJECTIDQUERY, {
		fetchPolicy: 'cache-and-network',
	});
	const [getDealTagOptions, { data: dataDealTagOptions }] = useLazyQuery(GETDEALTAGOPTIONS, {
		fetchPolicy: 'cache-and-network',
	});

	const [upsertTag, { data: upsertedTag, loading: upsertLoading }] = useMutation(UPSERTTAG);
	const [removeTag] = useMutation(REMOVETAG);

	useEffect(() => {
		if (props.targetSourceId) {
			setLoadingTags(true);
			getTagsByObjectId({
				variables: {
					objectId: props.targetSourceId,
				},
			});
		}
	}, [props.targetSourceId, props.multipleIds]);

	useEffect(() => {
		if (stateApp.user && stateApp.user.mongoId) {
			getDealTagOptions({
				variables: {
					userId: stateApp.user.mongoId,
				},
			});
		}
	}, [stateApp.user]);

	useEffect(() => {
		if (dataDealTagOptions && dataDealTagOptions.getDealTagOptions && tagsArray) {
			setDealTagOptions([
				...dataDealTagOptions.getDealTagOptions.map(tag => ({
					tag: tag.tag,
					value: tag.tag,
					_id: tag._id,
					color: tag.color,
				})),
			]);
		}
	}, [dataDealTagOptions, tagsArray]);

	useEffect(() => {
		if (upsertedTag?.upsertTag?.tag && props.targetSourceId === 'new') {
			const tags = JSON.parse(JSON.stringify(tagsArray));
			tags.push(upsertedTag.upsertTag.tag);
			setTagsArray(tags);
			if (props.setTagId) {
				props.setTagId(upsertedTag.upsertTag.tag._id);
			}
		}
	}, [upsertedTag]);

	useEffect(() => {
		if (dataTags && dataTags.tagsByObjectId) {
			setTagsArray(dataTags.tagsByObjectId);
		}
		setLoadingTags(false);
	}, [dataTags]);

	const UpperAndCleanTagText = (tagText = '') => {
		return tagText
			?.trim()
			?.split(' ')
			?.filter(word => word !== '')
			?.map(word => capitalizeFirstLetter(word))
			?.join(' ');
	};

	const NewTag = tag => {
		setTextValue('');

		upsertTag({
			variables: {
				tag: {
					tag: tag.value,
					public: false,
					user: stateApp.user.mongoId,
					taggedOn: props.targetSourceId,
					objectType: props.targetLabel,
					color: tag.color,
				},
			},
			refetchQueries: ['getTagsByObjectId', 'getUserAvailableTags', 'getPipeline'],
			awaitRefetchQueries: true,
		});
	};

	///////////////////// DELETING A TAG ///////////////////////////////////////////////

	const removeTagFromList = id => {
		const tags = JSON.parse(JSON.stringify(tagsArray));
		const index = tags.findIndex(tag => tag._id === id);
		if (index > -1) {
			tags.splice(index, 1);
		}
		setTagsArray(tags);
		if (props.removeTagId) {
			props.removeTagId(id);
		}
	};

	const DeleteTag = tagIds => {
		for (let i = 0; i < tagIds.length; i++) {
			removeTagFromList(tagIds[i]);
			removeTag({
				variables: {
					tagId: tagIds[i]._id,
				},
				refetchQueries: ['getTagsByObjectId', 'getUserAvailableTags', 'getPipeline'],
				awaitRefetchQueries: true,
			});
		}
	};

	////////////////////////////////////////////////////////////////////////////////////////

	const handleChangeTags = (e, newTagsArray) => {
		e.persist();

		let tag = newTagsArray[newTagsArray.length - 1];
		if (!tag.color && typeof tag === 'object') tag.color = generateColor();

		if (e.key === 'Enter') {
			// On enter newTagsArray will be a String value
			NewTag({ tag: tag, color: generateColor(), value: tag });
		} else if (e.target.tagName === 'svg' || e.target.tagName === 'path') {
			const deletedTags = differenceWith(tagsArray, tag, isEqual);

			DeleteTag(deletedTags);
		} else {
			if (e.type === 'click') {
				NewTag(tag);
			}
		}
	};

	const cleanDropDownArray = () => {
		const tags = tagsArray.map(tag => tag.tag);

		let cleanArray = dealTagOptions.filter(tag => tags.indexOf(tag) === -1);
		cleanArray = [...new Set(cleanArray)];
		cleanArray.sort();
		return { cleanArray, tags };
	};

	const AddingAddRowToDropDown = () => {
		let { cleanArray } = cleanDropDownArray();

		if (addInDropDown) {
			cleanArray.unshift(addInDropDown);
		}
		return cleanArray;
	};

	useEffect(() => {
		const { cleanArray, tags } = cleanDropDownArray();
		if (
			cleanArray.indexOf(UpperAndCleanTagText(textValue)) === -1 &&
			tags.indexOf(UpperAndCleanTagText(textValue)) === -1 &&
			textValue.trim() !== ''
		) {
			setAddInDropDown({
				tag: `Add "${UpperAndCleanTagText(textValue)}"`,
				value: UpperAndCleanTagText(textValue),
				color: generateColor(),
			});
		} else {
			setAddInDropDown(false);
		}
	}, [textValue]);

	return (
		<div id="taggerRoot" className={classes.rootDiv}>
			{!loadingTags ? (
				<Autocomplete
					disabled={!props.targetSourceId}
					className={classes.chip}
					multiple
					debug={['developement', 'test'].includes(process.env)}
					id="tags-outlined"
					onChange={(e, newValue) => {
						handleChangeTags(e, newValue);
					}}
					options={AddingAddRowToDropDown().map(({ tag, value, color }) => ({
						tag: tag,
						value: value || tag,
						color: color,
					}))}
					getOptionLabel={option => option.tag}
					value={tagsArray}
					freeSolo
					renderTags={(value, getTagProps) => {
						return value.map((tag, index) => (
							<Chip
								key={index}
								id={tag._id}
								label={tag.tag}
								{...getTagProps({ index })}
								deleteIcon={<ClearIcon />}
								style={{
									background: tag.color || 'powderblue',
									color: getOppositeHexColor(tag.color || 'powderblue'),
									fontWeight: 'bold',
								}}
							/>
						));
					}}
					renderInput={params => (
						<TextField
							disabled={!props.targetSourceId}
							{...params}
							variant={props.variant ? props.variant : 'outlined'}
							className={classes.input}
							placeholder={!showPlusAddIcon() ? '' : '+'}
							fullWidth
							value={textValue}
							onChange={e => {
								setTextValue(e.target.value);
							}}
							onClick={() => {
								if (props.type === 'textfield' && props.targetSourceId) {
									setTFActive(true);
								}
							}}
							onBlur={() => {
								setTFActive(false);
							}}
							InputProps={{
								...params.InputProps,
								endAdornment: upsertLoading ? <CircularProgress color="secondary" /> : <></>,
							}}
						/>
					)}
				/>
			) : (
				<CircularProgress color="secondary" />
			)}
		</div>
	);
}

Tags.defaultProps = {
	shareable: true,
	type: 'textfield',
};
