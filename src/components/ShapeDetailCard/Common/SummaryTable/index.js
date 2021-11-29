import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import TextField from "@material-ui/core/TextField";
import debounce from "lodash/debounce";
import moment from "moment";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { IconButton, Grid, Table, TableCell, TableBody, FormControl } from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import { showErrorMessage } from "actions";
import CreateTwoToneIcon from "@material-ui/icons/CreateTwoTone";
import AutoCompleteTypeComponent from "components/Shared/Forms/Fields/AutoCompleteType";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { summaryTableStyles } from "components/ShapeDetailCard/style";

function TableTextField({ data, value, onChange, onKeyDown, onBlur, onWheel, showMessage, type, InputProps }) {
    const classes = summaryTableStyles();
    return (
        <TextField
            size="small"
            type={data.type}
            value={value}
            variant="outlined"
            autoFocus
            onChange={(e) => {
                e.persist();
                onChange(e, data, type)
            }}
            onKeyDown={(e) => {
                if (e.keyCode === 13) {
                    e.stopPropagation();
                    onKeyDown(e, data, type)
                }
            }}
            onWheel={onWheel ? onWheel : () => { }}
            onBlur={() => { onBlur(data, type) }}
            InputProps={{
                ...InputProps,
                endAdornment: (showMessage &&
                    <p className={classes.foodText}>
                        <span>Return</span> to save
                    </p>)
            }}
            fullWidth
        />
    )
}

export default function SummartyTableInfo({ tableData, properties, updateProperties, updateCustomProperties, search }) {
    const classes = summaryTableStyles();
    const dispatch = useDispatch();
    const [tableDataState, setTableDataState] = useState({});
    const [editIconState, setEditIconState] = useState({});

    const [filteredTableData, setFilteredTableData] = useState(tableData);

    const [tableTempProperties, setTableTempProperties] = useState(properties);


    useEffect(() => {
        setFilteredTableData(tableData.concat(properties?.custom_data_arr || []))
        properties?.custom_data_arr?.forEach((data) => {
            tableTempProperties[data.key] = data.value
            tableTempProperties[`${data.key}key`] = data.key
        })
        setTableTempProperties({ ...tableTempProperties })
        setTableDataState({})

    }, [properties]);

    useEffect(() => {
        if (search) {
            const td = tableData.concat(properties?.custom_data_arr || [])
            const newTableData = td.filter((row) =>
                row.key?.toLowerCase()?.startsWith(search.toLowerCase()) || row.label?.toLowerCase()?.startsWith(search.toLowerCase()) || tableTempProperties[row.key]?.toLowerCase()?.startsWith(search.toLowerCase()))

            setFilteredTableData(newTableData)
        } else {
            setFilteredTableData(tableData.concat(properties?.custom_data_arr || []))
        }
    }, [search]);

    const onChange = (e, data, type) => {
        const appendValue = type === 'key' ? type : ''
        setTableTempProperties({ ...tableTempProperties, [`${data.key}${appendValue}`]: e.target.value });
    }

    const onKeyDown = (e, data, type) => {
        if (type === 'value') {
            if (data.isCustom) {
                if (!tableTempProperties[`${data.key}key`]) {
                    dispatch(showErrorMessage("Please provide key value first"));
                    return
                } else {
                    updateCustomProperties(type, tableTempProperties[data.key], data.id)
                }
            } else
                updateProperties(e, data.key, tableTempProperties[data.key], data.isCustom);
        } else {
            const exists = filteredTableData.find((row) => row.key === tableTempProperties[`${data.key}key`] && row.id !== data.id)
            if (exists) {
                dispatch(showErrorMessage('Key with this name already exists'));
                return
            }
            updateCustomProperties(type, tableTempProperties[`${data.key}key`], data.id)
        }
    }

    const onBlur = (e, data, type) => {
        setTableDataState({});
        if (type === 'value') {
            setTableTempProperties({ ...tableTempProperties, [data.key]: data.isCustom ? data.value : properties[data.key] })
        } else
            setTableTempProperties({ ...tableTempProperties, [`${data.key}key`]: data.key })
    }

    return <Table
        className={classes.table}
        size="small"
        aria-label="unit table"
    >
        <TableBody>
            {filteredTableData.map((data, index) => <>
                <TableRow className={index % 2 === 0 ? classes.rowGrey : classes.rowWhite}>
                    <TableCell className={classes.cell1} align="left"
                        onMouseEnter={() => { setEditIconState({ [`${data.key}key`]: true }) }}
                        onMouseLeave={() => { setEditIconState({ [`${data.key}key`]: false }) }}
                    >
                        {data.isCustom ?
                            <> {
                                tableDataState[`${data.key}key`] ?
                                    <TableTextField data={data} value={tableTempProperties[`${data.key}key`]} showMessage={tableDataState[`${data.key}key`] === true}
                                        onChange={onChange} onKeyDown={onKeyDown} onBlur={onBlur} type='key' />
                                    :
                                    <div style={{ minWidth: '30px', cursor: "pointer" }} >
                                        <Grid container direction="row" justifyContent="space-between" alignItems="center">
                                            <Grid item md={10}>
                                                {data.key || '-'}
                                            </Grid>
                                            <Grid item md={2}>
                                                {editIconState[`${data.key}key`] && <Tooltip title={"Edit"} placement="top">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => { setTableDataState({ [`${data.key}key`]: true }) }}
                                                    >
                                                        <CreateTwoToneIcon
                                                            id="contPencilIcon"
                                                            className={classes.pencilIcon}
                                                        />
                                                    </IconButton>
                                                </Tooltip>}
                                            </Grid>
                                        </Grid>
                                    </div>
                            } </> : <>{data.label}</>
                        }


                    </TableCell>
                    <TableCell className={classes.cell2} align="right"
                        onMouseEnter={() => { setEditIconState({ [data.key]: true }) }}
                        onMouseLeave={() => { setEditIconState({ [data.key]: false }) }}
                    >
                        {
                            tableDataState[data.key] ?
                                <>
                                    {data.type === 'select' &&
                                        <FormControl variant="outlined">
                                            <Select
                                                className={classes.select}
                                                fullWidth
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={tableTempProperties[data.key]}
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={(e) => {
                                                    e.keyCode = 13
                                                    updateProperties(e, data.key, e.target.value);
                                                }}
                                                onBlur={() => { setTableDataState({}); setTableTempProperties({ ...tableTempProperties, [data.key]: properties[data.key] }) }}
                                            >
                                                {data.options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                            </Select>
                                        </FormControl>
                                    }  {(data.type === 'text' || data.type === 'number') &&
                                        <TableTextField data={data} value={tableTempProperties[data.key]} showMessage={tableDataState[data.key] === true}
                                            onChange={onChange} onKeyDown={onKeyDown} onBlur={onBlur} onWheel={(e) => e.target.blur()} type='value' InputProps={data.InputProps} />
                                    }

                                    {data.type === 'date' &&
                                        <KeyboardDatePicker
                                            autoFocus
                                            className={classes.select}
                                            disableToolbar
                                            variant="inline"
                                            fullWidth
                                            inputVariant="outlined"
                                            format="MM/DD/YYYY"
                                            margin="normal"
                                            id="date-picker-inline"
                                            value={tableTempProperties[data.key] || null}

                                            onOpen={() => { tableDataState[`${data.key}date`] = true }}
                                            onClose={() => { tableDataState[`${data.key}date`] = false; setTableDataState({}); setTableTempProperties({ ...tableTempProperties, [data.key]: properties[data.key] }) }}
                                            onKeyDown={(e) => {
                                                if (e.keyCode === 13) {
                                                    e.stopPropagation();
                                                    onKeyDown(e, data, 'value')
                                                }
                                            }}
                                            onBlur={() => {
                                                setTimeout(() => {
                                                    if (!tableDataState[`${data.key}date`]) {
                                                        console.log('blur'); setTableDataState({}); setTableTempProperties({ ...tableTempProperties, [data.key]: properties[data.key] })
                                                    }
                                                }, 100)

                                            }}
                                            onChange={(date) => {
                                                if (date === null) {
                                                    setTableTempProperties({ ...tableTempProperties, [`${data.key}`]: date });
                                                }
                                                if ((date && date?._d?.toString() !== 'Invalid Date')) {
                                                    tableTempProperties[`${data.key}`] = date ? String(date["_d"]) : null
                                                    setTableTempProperties({ ...tableTempProperties });
                                                    if (date?._pf?.overflow === -2 || !date?._strict) {
                                                        onKeyDown(null, data, 'value')
                                                    }
                                                }
                                            }}
                                            KeyboardButtonProps={{ "aria-label": "change date" }}
                                        />
                                    }

                                    {data.type === 'autocomplete' &&
                                        <>
                                            <AutoCompleteTypeComponent data={data} value={properties[data.key]} shapeType={'Unit'} typeKey={data.key}
                                                onBlur={() => { setTableDataState({}); setTableTempProperties({ ...tableTempProperties, [data.key]: properties[data.key] }) }}
                                                onChange={(e, value) => {
                                                    e.keyCode = 13
                                                    if (value?.name)
                                                        updateProperties(e, data.key, value.name);
                                                }} />
                                        </>
                                    }
                                </> :
                                <div style={{ minWidth: '30px', cursor: "pointer" }} >
                                    <Grid container direction="row" justifyContent="space-between" alignItems="center">
                                        {data.formatValue ?
                                            <Grid item>
                                                {data.formatValue(data.value || properties[data.key]) || '-'}
                                            </Grid> :
                                            <Grid item>
                                                {(data.type === 'date') && (properties[data.key] ? moment.parseZone(new Date(properties[data.key])).format("MM/DD/yyyy") : '-')}
                                                {data.type !== 'date' && ((data.value || properties[data.key]) || '-')}
                                            </Grid>
                                        }
                                        <Grid item>
                                            {editIconState[data.key] && <Tooltip title={"Edit"} placement="top">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => { setTableDataState({ [data.key]: true }) }}
                                                >
                                                    <CreateTwoToneIcon
                                                        id="contPencilIcon"
                                                        className={classes.pencilIcon}
                                                    />
                                                </IconButton>
                                            </Tooltip>}
                                        </Grid>
                                    </Grid>
                                </div>
                        }
                    </TableCell>
                </TableRow>
            </>
            )}
        </TableBody>
    </Table>

}
