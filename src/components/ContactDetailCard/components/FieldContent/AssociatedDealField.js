import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import ClearIcon from '@material-ui/icons/Clear';
import { useLazyQuery } from '@apollo/client';

import 'components/Shared/Tagger.css';
import { OPENDEALS } from 'graphQL/useQueryOpenDeals';
import { uniqBy } from 'lodash';

const useStyles = makeStyles(theme => ({
	rootDiv: {
		'& > * + *': {
			marginTop: theme.spacing(5),
		},
		'& .MuiAutocomplete-clearIndicator': {
			display: 'none',
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
		'& .MuiChip-root': {
			backgroundColor: '#ECEDED',
			color: '#606060',
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

			transition: ({ showPlusAddIcon }) =>
				!showPlusAddIcon
					? ''
					: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
		},
	},
}));

export default function AssociatedDealField(props) {
	const [options, setOptions] = useState([]);
	const [inputValue, setInputValue] = useState([]);
	const [tFActive, setTFActive] = useState(false);

	const [getOpenDeals, { data: dealsData }] = useLazyQuery(OPENDEALS, {
		fetchPolicy: 'network-only',
	});

	useEffect(() => {
		if (dealsData?.openDeals?.deals) {
			const allFiltersData = dealsData?.openDeals?.deals.map(deal => ({ name: deal.name, _id: deal._id }));
			// making records uniq
			const uniqData = uniqBy(allFiltersData, '_id');
			setOptions(uniqData.filter(d => d));
		}
	}, [dealsData]);

	useEffect(() => {
		const associatedDeal = props.value ? (typeof props.value === 'string' ? [props.value] : props.value) : [];
		setInputValue(associatedDeal);
	}, [props.value]);

	useEffect(() => {
		getOpenDeals();
	}, [getOpenDeals]);

	const showPlusAddIcon = () => {
		if (tFActive || props.disabled || props.simpleChips) return false;
		return true;
	};
	const classes = useStyles({ ...props, showPlusAddIcon: showPlusAddIcon() });

	const handleChange = (values, reason) => {
		let deal,
			payload = {
				relatedObjectType: props.targetLabel,
				relatedObject: props.targetLabelId,
				isDeleted: false,
			};
		if (reason === 'select-option') {
			deal = dealsData?.openDeals?.deals.find(deal => deal.name === values[values.length - 1]);
			if (deal) {
				payload.descriptorObject = deal._id;
			}
		} else {
			const deletedDeal = dealsData?.openDeals?.deals.find(
				deal => deal.name === inputValue.find(v => !values.includes(v))
			);
			if (deletedDeal) {
				payload.descriptorObject = deletedDeal._id;
			}
			payload.isDeleted = true;
		}
		props.onChange(values, payload.descriptorObject);

		setInputValue(values);
	};

	const getOptionDisabled = option => inputValue.findIndex(selectedOption => selectedOption._id === option._id) !== -1;

	return (
		<div id="taggerRoot" className={classes.rootDiv}>
			<Grid container>
				<Grid item xs={12} md={12}>
					<Autocomplete
						className={classes.chip}
						id="tags-outlined"
						onChange={(e, newValue, reason) => handleChange(newValue, reason)}
						multiple
						options={options}
						getOptionLabel={option => option.name}
						value={inputValue || null}
						getOptionSelected={option => option._id === inputValue._id}
						getOptionDisabled={getOptionDisabled}
						freeSolo
						disabled={props.disabled}
						renderTags={(value, getTagProps) => {
							return value.map((tag, index) => (
								<Chip
									key={index}
									id={tag._id}
									label={tag.name}
									{...getTagProps({ index })}
									deleteIcon={!props.disabled ? <ClearIcon /> : <></>}
								/>
							));
						}}
						renderInput={params => (
							<TextField
								{...params}
								variant={'standard'}
								className={classes.input}
								placeholder={!showPlusAddIcon() ? '' : '+'}
								fullWidth
								onClick={() => {
									if (props.type === 'textfield') {
										setTFActive(true);
									}
								}}
								onBlur={() => {
									setTFActive(false);
								}}
								InputProps={{
									...params.InputProps,
									disableUnderline: !props.simpleChips,
								}}
							/>
						)}
					/>
				</Grid>
			</Grid>
		</div>
	);
}

AssociatedDealField.defaultProps = {
	type: 'textfield',
	simpleChips: false,
};
