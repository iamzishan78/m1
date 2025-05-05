import React, { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { uniqBy } from 'lodash';
import Chip from '@material-ui/core/Chip';
import ClearIcon from '@material-ui/icons/Clear';

import CustomAutoComplete from 'components/Shared/components/Fields/CustomAutoComplete';

import 'components/Shared/Tagger.css';

import { OPENDEALS } from 'graphQL/useQueryOpenDeals';

const styleClasses = {
	root: {
		backgroundColor: '#ECEDED',
		color: '#606060',
	},
	showIcon: {
		caretColor: 'transparent',
		color: '#008ebf',
		backgroundColor: '#D5F4FF',
		maxWidth: '33px',
		width: '33px',
		height: '32px',
		fontSize: '25px',
		margin: '3px',
		padding: '0px !important',
		borderRadius: '50%',
		textAlign: 'center',
		cursor: 'pointer',
	},
};

export default function AssociatedDealField(props) {
	const [options, setOptions] = useState([]);
	const [tFActive, setTFActive] = useState(false);

	const [getOpenDeals, { data: dealsData }] = useLazyQuery(OPENDEALS, {
		fetchPolicy: 'network-only',
	});

	useEffect(() => {
		if (dealsData?.openDeals?.deals) {
			const allFiltersData = dealsData?.openDeals?.deals.map(deal => ({ name: deal.name, _id: deal._id }));
			// making records uniq
			const uniqData = uniqBy(allFiltersData, '_id').filter(d => d);
			setOptions(uniqData);
		}
	}, [dealsData]);

	useEffect(() => {
		getOpenDeals();
	}, [getOpenDeals]);

	const showPlusAddIcon = () => {
		if (tFActive || props.disabled || props.simpleChips) {
			return false;
		}
		return true;
	};

	const handleChange = ({ value, reason }) => {
		let deal,
			payload = {
				relatedObjectType: props.targetLabel,
				relatedObject: props.targetLabelId,
				isDeleted: false,
			};
		if (reason === 'select-option') {
			deal = dealsData?.openDeals?.deals.find(deal => deal.name === value[value.length - 1]);
			if (deal) {
				payload.descriptorObject = deal._id;
			}
		} else {
			const currentValue = Array.isArray(value) ? value : [];
			const previousValue = Array.isArray(props.value) ? props.value : [];
			const deletedDeal = dealsData?.openDeals?.deals.find(
				deal => deal.name === previousValue.find(v => !currentValue.includes(v))
			);
			if (deletedDeal) {
				payload.descriptorObject = deletedDeal._id;
			}
			payload.isDeleted = true;
		}
		props.onChange(value, payload.descriptorObject);
	};

	const getOptionDisabled = option => {
		const currentValue = Array.isArray(props.value) ? props.value : [];
		return currentValue.findIndex(selectedOption => selectedOption._id === option._id) !== -1;
	};

	return (
		<div id="taggerRoot">
			<CustomAutoComplete
				getOptionDisabled={getOptionDisabled}
				renderTags={(value, getTagProps) => {
					return value.map((tag, index) => (
						<Chip
							key={tag._id}
							id={tag._id}
							label={tag.name}
							{...getTagProps({ index })}
							deleteIcon={!props.disabled ? <ClearIcon /> : <></>}
						/>
					));
				}}
				fieldConfig={{
					variant: 'standard',
					multiple: true,
					disabled: props.disabled,
					chipStyles: styleClasses.root,
					textFieldInputProps: {
						disableUnderline: !props.simpleChips,
						style: showPlusAddIcon() ? styleClasses.showIcon : {},
					},
				}}
				fieldAttributes={{
					value: props.value,
					optionArray: options,
					placeholder: !showPlusAddIcon() ? '' : '+',
				}}
				fieldEvents={{
					onChange: handleChange,
					onBlur: () => setTFActive(false),
					onTextFieldChange: () => {
						if (props.type === 'textfield') {
							setTFActive(true);
						}
					},
				}}
			/>
		</div>
	);
}

AssociatedDealField.defaultProps = {
	type: 'textfield',
	simpleChips: false,
};
