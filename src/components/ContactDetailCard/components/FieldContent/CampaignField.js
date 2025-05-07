import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import ClearIcon from '@material-ui/icons/Clear';
import Chip from '@material-ui/core/Chip';

import { useLazyQuery, useMutation } from '@apollo/client';
import PropTypes from 'prop-types';

import CustomAutoComplete from 'components/Shared/components/Fields/CustomAutoComplete';
import { UPSERT_CAMPAIGN_DESCRIPTORS } from 'graphQL/useMutationCampaign';
import { GET_DB_FILTERS } from 'graphQL/useQueryDbQuery';

import 'components/Shared/Tagger.css';

const SPACING = 5;

const useStyles = makeStyles(theme => ({
	rootDiv: {
		'& > * + *': {
			marginTop: theme.spacing(SPACING),
		},
		'& .MuiAutocomplete-clearIndicator': {
			display: 'none',
		},
	},
	chip: {
		'& .MuiChip-root': {
			backgroundColor: '#ECEDED',
			color: '#606060',
			whiteSpace: 'normal',
			height: 'auto',
			maxWidth: '100%',
			borderRadius: '4px',
		},
		'& .MuiChip-label': {
			whiteSpace: 'normal',
			textAlign: 'left',
			padding: '8px 12px',
			overflowWrap: 'break-word',
		},
		'& .MuiChip-root.Mui-disabled': {
			backgroundColor: '#f0f0f0 !important',
		},
		'& .MuiInputBase-input.Mui-disabled': {
			display: 'none',
		},
	},
	input: {
		'& input': {
			caretColor: ({ showPlusAddIcon }) => (!showPlusAddIcon ? '' : 'transparent'),
			color: ({ showPlusAddIcon }) => (!showPlusAddIcon ? '' : '#008ebf'),
			backgroundColor: ({ showPlusAddIcon }) => (!showPlusAddIcon ? '' : '#D5F4FF'),
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
			// "&.MuiChip-root.Mui-disabled": {
			//   backgroundColor: "#f0f0f0"
			// },
			transition: ({ showPlusAddIcon }) =>
				!showPlusAddIcon
					? ''
					: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
		},
	},
}));

export default function CampaignField(props) {
	const [options, setOptions] = useState([]);
	const [inputValue, setInputValue] = useState([]);
	const [tFActive, setTFActive] = useState(false);

	const [getCampaignFilters, { data: campaignfiltersData }] = useLazyQuery(GET_DB_FILTERS, {
		fetchPolicy: 'no-cache',
	});
	const [upsertCampaignDescriptors] = useMutation(UPSERT_CAMPAIGN_DESCRIPTORS);

	useEffect(() => {
		if (campaignfiltersData?.getDbFilters?.hits) {
			const allFiltersData = campaignfiltersData.getDbFilters.hits.map(hit => ({
				_id: hit.original[0]._id,
				name: hit.key,
			}));
			setOptions(allFiltersData.filter(d => d));
		}
	}, [campaignfiltersData]);

	useEffect(() => {
		setInputValue(props.value || []);
	}, [props.value]);

	useEffect(() => {
		getCampaignFilters({
			variables: {
				index: 'campaigns_flat',
				filterAggs: {
					field: 'name.keyword',
					size: 1000,
					type: 'withOriginalIds',
				},
			},
		});
	}, [getCampaignFilters]);

	const showPlusAddIcon = () => {
		if (tFActive || props.disabled || props.simpleChips) {
			return false;
		}
		return true;
	};
	const classes = useStyles({ ...props, showPlusAddIcon: showPlusAddIcon() });

	const handleChange = ({ value: values, reason }) => {
		let campaign,
			payload = {
				relatedObjectType: props.targetLabel,
				relatedObject: props.targetLabelId,
				isDeleted: false,
			};

		if (reason === 'selectOption') {
			campaign = values[values.length - 1];
			if (campaign) {
				payload.descriptorObject = campaign._id;
			}
		} else {
			const deletedCampaign = inputValue.find(iv => !values.some(val => val._id === iv._id));
			if (deletedCampaign) {
				payload.descriptorObject = deletedCampaign._id;
			}
			payload.isDeleted = true;
		}

		if (!payload.descriptorObject) {
			return;
		}

		props.onChange(values, payload.descriptorObject);
		if (payload.relatedObject) {
			upsertCampaignDescriptors({
				variables: {
					descriptors: [payload],
				},
			});
		}
		setInputValue(values);
	};

	return (
		<CustomAutoComplete
			fieldConfig={{
				variant: 'standard',
				disabled: props.disabled,
				multiple: true,
				textFieldInputProps: {
					disableUnderline: !props.simpleChips,
				},
				inputClassName: !showPlusAddIcon() ? '' : classes.input,
				textfieldRestProps: {
					onClick: () => {
						if (props.type === 'textfield') {
							setTFActive(true);
						}
					},
					onBlur: () => {
						setTFActive(false);
					},
				},
			}}
			fieldAttributes={{
				value: inputValue,
				optionArray: options,
				placeholder: !showPlusAddIcon() ? '' : '+',
			}}
			fieldEvents={{
				onChange: handleChange,
			}}
			freeSolo
			data-testid="campaign-name-autocomplete"
			renderTags={(value, getTagProps) => {
				return value.map((tag, index) => (
					<Chip
						key={tag._id}
						id={index}
						label={tag.name}
						{...getTagProps({ index })}
						deleteIcon={!props.disabled ? <ClearIcon /> : <></>}
						data-testid="campaign-name-chip"
					/>
				));
			}}
		/>
	);
}

CampaignField.propTypes = {
	value: PropTypes.arrayOf(
		PropTypes.shape({
			_id: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
		})
	),
	onChange: PropTypes.func.isRequired,
	disabled: PropTypes.bool,
	simpleChips: PropTypes.bool,
	targetLabel: PropTypes.string.isRequired,
	targetLabelId: PropTypes.string.isRequired,
	type: PropTypes.string,
};

CampaignField.defaultProps = {
	value: [],
	disabled: false,
	simpleChips: false,
	type: '',
};
