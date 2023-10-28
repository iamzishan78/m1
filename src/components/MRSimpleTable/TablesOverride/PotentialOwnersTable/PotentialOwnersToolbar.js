import React from 'react';
import SelectFilter from 'components/Shared/ui/SelectFilter';
import ToggleSwitch from 'components/Shared/ui/ToggleSwitch';
import ToolbarButton from 'components/Shared/ui/ToolbarButton';

const PotentialOwnersToolbar = ({ table, tableKey }) => {
    const isSomeRowsSelected = table.getIsSomeRowsSelected();
    const isAllRowsSelected = table.getIsAllRowsSelected();
    const isSomethingSelected = isSomeRowsSelected || isAllRowsSelected;

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <SelectFilter
                options={[2019, 2020, 2021, 2022]}
                initialValue={2022}
                onValueChange={() => { }}
            />

            <ToggleSwitch
                label="Filter by unit wells"
                onChange={() => { }}
                customLabelStyle={{ marginRight: '0px' }}
            />

            <ToolbarButton
                label="+ ADD TO Unit"
                disabled={!isSomethingSelected}
                onClick={() => { }}
            />
        </div>
    );
};

export default PotentialOwnersToolbar;
