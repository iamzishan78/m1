import React from 'react';
import { debounce } from 'lodash';
import SelectFilter from 'components/Shared/ui/SelectFilter';
import ToggleSwitch from 'components/Shared/ui/ToggleSwitch';
import ToolbarButton from 'components/Shared/ui/ToolbarButton';
import { simpleTableController } from 'hookstate/simpleTableController';

const PotentialOwnersToolbar = ({ table, tableKey }) => {
    const Controller = simpleTableController(tableKey);
    const isSomeRowsSelected = table.getIsSomeRowsSelected();
    const isAllRowsSelected = table.getIsAllRowsSelected();
    const isSomethingSelected = isSomeRowsSelected || isAllRowsSelected;

    const updateCustomProps = debounce(Controller.updateCustomProps, 500);

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <SelectFilter
                options={[2019, 2020, 2021, 2022]}
                initialValue={2022}
                onValueChange={year => updateCustomProps({ year })}
            />

            <ToggleSwitch
                label="Filter by unit wells"
                onChange={filterByWells => updateCustomProps({ filterByWells })}
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
