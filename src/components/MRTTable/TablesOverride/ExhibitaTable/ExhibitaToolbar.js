import React, { useState, useEffect, memo } from "react";
import { tableController,
    tableGlobalController,
} from "hookstate/tableController";
import Switch from '@material-ui/core/Switch';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    root: {
        width: 54,
        height: 40,
        padding: 0,
        '&. MuiIconButton-root': {
            margin: 0
        }
    },
    switchBase: {
        padding: 0,
        backgroundColor: "transparent !important",
        '&$checked': {
            color: 'white',
            '& + $track': {
                backgroundColor: '#D4E7F1',
                opacity: 1,
                border: 'none',
            },
        },
    },
    thumb: {
        width: 20,
        height: 20,
        marginTop: 9
    },
    track: {
        backgroundColor: '#616A6E',
        opacity: 1,
    },
    checked: {},
    focusVisible: {},
})
);


function ExhibitaToolBar({ tableKey }) {
    const styles = useStyles();
    const tableState = tableController(tableKey).useState(['filters', 'data']);
    const tableStateValues = tableState.stateValues;
    const [toggle, setToggle] = useState(false)

    useEffect(() => {
        const formatedFilter = tableStateValues.filters || [];
        const fixedFilters = [];
        if(!toggle){
          fixedFilters.push({ field: "shape.shapeJson.properties.agreementStatus", value: ["Active", "ACTIVE", "active"] })
        }
        if (formatedFilter[0] && formatedFilter[0].value.range) {
          formatedFilter[0].type = "range";
          formatedFilter[0].value = formatedFilter[0].value.range[formatedFilter[0].field];
          fixedFilters.push(formatedFilter[0]);
        }
        fixedFilters.push({ field: "shape.shapeJson.properties.type", value: 'agreement' });
      
        tableController(tableKey).setFilters(fixedFilters);
        // eslint-disable-next-line
      }, [toggle]);


      useEffect(() => {
        tableGlobalController.refetch();
      }, [tableState?.filters]);

    return (
        <>
            <div>
                <>Includes inactive agreements</>
                <Switch
                    classes={{
                        switchBase: styles.switchBase,
                        thumb: styles.thumb,
                        track: styles.track,
                        checked: styles.checked,
                    }}
                    checked={toggle}
                    onChange={() => setToggle(!toggle)}
                    name="checkedB"
                    color="primary"
                />
            </div>

        </>
    );
}

export default memo(ExhibitaToolBar);
