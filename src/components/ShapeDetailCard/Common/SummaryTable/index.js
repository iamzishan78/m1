import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { set, get } from "lodash";
import TextField from "@material-ui/core/TextField";
import moment from "moment";
import { IconButton, Grid, Table, TableCell, TableBody, FormControl } from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import { showErrorMessage } from "actions";
import CreateTwoToneIcon from "@material-ui/icons/CreateTwoTone";
import AutoCompleteTypeComponent from "components/Shared/Forms/Fields/AutoCompleteType";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { summaryTableStyles } from "components/ShapeDetailCard/style";
import UserList from "components/Shared/UserList";
import CampaignNameField from "components/ContactDetailCard/components/FieldContent/CampaignNameField";
import vf_currency from "components/Shared/valueformatters/vf_currency";
import vf_number from "components/Shared/valueformatters/vf_number";
import { getCustomMetaFields } from "components/Shared/Agreement/helpers";
import CustomFieldSelect from "components/Shared/M1nTable/components/SubComponents/CustomFieldSelect";
import CustomFieldMultiSelect from "components/Shared/M1nTable/components/SubComponents/CustomFieldMultiSelect";
import ReactSelectField from "components/Shared/M1nTable/components/SubComponents/ReactSelectField";
import NumberField from "components/Shared/components/Fields/NumberField";


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
        onChange(e, data, type);
      }}
      onKeyDown={(e) => {
        if (e.keyCode === 13) {
          e.stopPropagation();
          onKeyDown(e, data, type);
        }
      }}
      onWheel={onWheel ? onWheel : () => { }}
      onBlur={() => {
        onBlur(data, type);
      }}
      InputProps={{
        ...InputProps,
        endAdornment: showMessage && (
          <p className={classes.foodText}>
            <span>Return</span> to save
          </p>
        ),
      }}
      fullWidth
    />
  );
}

export default function SummartyTableInfo({ tableData, properties, updateProperties, updateCustomProperties, search, metaData = [] }) {
  const classes = summaryTableStyles();
  const dispatch = useDispatch();
  const [tableDataState, setTableDataState] = useState({});
  const [editIconState, setEditIconState] = useState({});

  const [filteredTableData, setFilteredTableData] = useState(tableData);

  const [tableTempProperties, setTableTempProperties] = useState(properties);

  useEffect(() => {
    const customMetaData = getCustomMetaFields(properties, metaData);
    if (customMetaData.length === 0) return;
    let filteredKeys = tableData.concat(customMetaData);
    customMetaData.forEach(md => {
      if (!md.isCustomData) {
        set(tableTempProperties, md.key, md.value);
        set(tableTempProperties, [`${md.key}key`], md.key);
      }
    });
    setFilteredTableData(filteredKeys);
    setTableTempProperties({ ...tableTempProperties });
    setTableDataState({});
  }, [properties, metaData]);

  useEffect(() => {
    if (search) {
      const td = tableData.concat(properties?.custom_data_arr || []);
      const newTableData = td.filter(
        (row) =>
          row.key?.toLowerCase()?.includes(search.toLowerCase()) ||
          row.label?.toLowerCase()?.includes(search.toLowerCase()) ||
          tableTempProperties[row.key]?.toLowerCase()?.includes(search.toLowerCase())
      );

      setFilteredTableData(newTableData);
    } else {
      setFilteredTableData(tableData.concat(properties?.custom_data_arr || []));
    }
  }, [search]);

  const getKey = (data, type) => {
    const appendValue = type === "key" ? type : "";
    if (appendValue)
      return `${data.key}.${appendValue}`;
    return `${data.key}`;
  }

  const onChange = (e, data, type) => {
    const obj = { ...tableTempProperties };
    set(obj, getKey(data, type), e.target.value);
    setTableTempProperties(obj);
  };

  const onKeyDown = (e, data, type) => {
    if (type === "value") {
      if (data.isCustom || data.isCustomData) {
        if (!get(tableTempProperties, `${data.key}key`) && !data.isCustomData) {
          dispatch(showErrorMessage("Please provide key value first"));
          return;
        } else {
          updateCustomProperties(type, get(tableTempProperties, `${data.key}`), data.key);
        }
      } else updateProperties(e, data.key, get(tableTempProperties, `${data.key}`), data.isCustom);
    } else {
      const exists = filteredTableData.find((row) => row.key === get(tableTempProperties, `${data.key}key`) && row.id !== data.id);
      if (exists) {
        dispatch(showErrorMessage("Key with this name already exists"));
        return;
      }
      updateCustomProperties(type, get(tableTempProperties, `${data.key}key`), data.key);
    }
  };

  const onBlur = (e, data, type) => {
    setTableDataState({});
    if (type === "value") {
      setTableTempProperties({ ...tableTempProperties, [data.key]: data.isCustom ? data.value : properties[data.key] });
    } else setTableTempProperties({ ...tableTempProperties, [`${data.key}key`]: data.key });
  };

  const checkFieldChange = (e, data, type, func) => {
    if (data.isCustomData) func(e, data, type);
    else func(e, data, type);
  }

  return (
    <Table className={classes.table} size="small" aria-label="unit table">
      <TableBody>
        {filteredTableData.map((data, index) => (
          <>
            <TableRow className={index % 2 === 0 ? classes.rowGrey : classes.rowWhite}>
              <TableCell
                className={classes.cell1}
                align="left"
                onMouseEnter={() => {
                  setEditIconState({ [`${data.key}key`]: true });
                }}
                onMouseLeave={() => {
                  setEditIconState({ [`${data.key}key`]: false });
                }}
              >
                {data.isCustom ? (
                  <>
                    {" "}
                    {tableDataState[`${data.key}key`] ? (
                      <TableTextField
                        data={data}
                        value={tableTempProperties[`${data.key}key`]}
                        showMessage={tableDataState[`${data.key}key`] === true}
                        onChange={onChange}
                        onKeyDown={onKeyDown}
                        onBlur={onBlur}
                        type="key"
                      />
                    ) : (
                      <div style={{ minWidth: "30px", cursor: "pointer" }}>
                        <Grid container direction="row" justifyContent="space-between" alignItems="center">
                          <Grid item md={10}>
                            {data.key || "-"}
                          </Grid>
                          <Grid item md={2}>
                            {editIconState[`${data.key}key`] && (
                              <Tooltip title={"Edit"} placement="top">
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setTableDataState({ [`${data.key}key`]: true });
                                  }}
                                >
                                  <CreateTwoToneIcon id="contPencilIcon" className={classes.pencilIcon} />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Grid>
                        </Grid>
                      </div>
                    )}{" "}
                  </>
                ) : (
                  <>{data.label}</>
                )}
              </TableCell>
              <TableCell
                className={classes.cell2}
                onMouseEnter={() => {
                  setEditIconState({ [data.key]: true });
                }}
                onMouseLeave={() => {
                  setEditIconState({ [data.key]: false });
                }}
              >
                {tableDataState[data.key] ? (
                  <>
                    {(data.type === "select" || data.type === "dropdown") && (
                      <FormControl fullWidth margin="dense">
                        <ReactSelectField
                          isSingleSelect={true}
                          fullWidth
                          index={`field${index}`}
                          dropdownOptions={data.options}
                          column={data}
                          value={get(properties, data.key) ?? []}
                          onCustomKeyChange={(value) => {
                            set(tableTempProperties, data.key, value);
                            setTableTempProperties(tableTempProperties);
                            updateProperties(null, data.key, value);
                          }}
                        />
                      </FormControl>
                    )}
                    {(data.type === "multiselect") && (
                      <FormControl fullWidth margin="dense">
                        <ReactSelectField
                          fullWidth
                          index={`field${index}`}
                          dropdownOptions={data.options}
                          column={data}
                          value={get(properties, data.key) ?? []}
                          onCustomKeyChange={(value) => {
                            set(tableTempProperties, data.key, value);
                            setTableTempProperties(tableTempProperties);
                            updateProperties(null, data.key, value);
                          }}
                        />
                      </FormControl>
                    )}
                    {(data.type === "text" || data.type === "number" || data.type === "currency" || data.type === "comma-number") && (
                      <TableTextField
                        data={data}
                        value={get(tableTempProperties, `${data.key}`)}
                        showMessage={tableDataState[data.key] === true}
                        onChange={(e, data, type) => {
                          checkFieldChange(e, data, type, onChange);
                        }}
                        onKeyDown={(e, data, type) => {
                          checkFieldChange(e, data, type, onKeyDown);
                        }}
                        onBlur={(e, data, type) => {
                          checkFieldChange(e, data, type, onBlur);
                        }}
                        onWheel={(e) => e.target.blur()}
                        type="value"
                        InputProps={data.InputProps}
                      />
                    )}
                    {/* {
                      (data.type === "number") && (
                        <NumberField
                          InputProps={{
                            endAdornment: (
                              <p className={classes.foodText}>
                                <span>Return</span> to save
                              </p>
                            ),
                          }}
                          value={get(tableTempProperties, `agreementTerm`)}
                          offClickHandler={(key, value) => {
                            setTableTempProperties({ ...tableTempProperties, ['agreementTerm']: value || '' });
                            updateProperties(null, 'agreementTerm', value);
                          }} />
                      )
                    } */}
                    {data.type === "date" && (
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
                        onOpen={() => {
                          tableDataState[`${data.key}date`] = true;
                        }}
                        onClose={() => {
                          tableDataState[`${data.key}date`] = false;
                          setTableDataState({});
                          setTableTempProperties({ ...tableTempProperties, [data.key]: properties[data.key] });
                        }}
                        onKeyDown={(e) => {
                          if (e.keyCode === 13) {
                            e.stopPropagation();
                            onKeyDown(e, data, "value");
                          }
                        }}
                        onBlur={() => {
                          setTimeout(() => {
                            if (!tableDataState[`${data.key}date`]) {
                              setTableDataState({});
                              setTableTempProperties({ ...tableTempProperties, [data.key]: properties[data.key] });
                            }
                          }, 100);
                        }}
                        onChange={(date) => {
                          if (date === null) {
                            setTableTempProperties({ ...tableTempProperties, [`${data.key}`]: date });
                          }
                          if (date && date?._d?.toString() !== "Invalid Date") {
                            tableTempProperties[`${data.key}`] = date ? String(date["_d"]) : null;
                            setTableTempProperties({ ...tableTempProperties });
                            if (date?._pf?.overflow === -2 || !date?._strict) {
                              onKeyDown(null, data, "value");
                            }
                          }
                        }}
                        KeyboardButtonProps={{ "aria-label": "change date" }}
                      />
                    )}
                    {data.type === "autocomplete" && (
                      <>
                        <AutoCompleteTypeComponent
                          data={data}
                          value={properties[data.key]}
                          shapeType={"Unit"}
                          typeKey={data.key}
                          onBlur={() => {
                            setTableDataState({});
                            setTableTempProperties({ ...tableTempProperties, [data.key]: properties[data.key] });
                          }}
                          onChange={(e, value) => {
                            e.keyCode = 13;
                            if (value?.name) updateProperties(e, data.key, value.name);
                          }}
                        />
                      </>
                    )}
                    {data.type === "custom" && (
                      <>
                        {data.key === "qualifier" && (
                          <UserList
                            value={properties[data.key]}
                            setValue={(user) => {
                              updateProperties(null, data.key, user);
                            }}
                          />
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <div style={{ minWidth: "30px", cursor: "pointer" }}>
                    <Grid
                      style={data.key === "campaignName" ? { display: "block" } : { display: "flex" }}
                      container
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      {data.formatValue ? (
                        <Grid item>{data.formatValue(data.value || properties[data.key]) || "-"}</Grid>
                      ) : (
                        <Grid item>
                          {data.type === "date" &&
                            (properties[data.key] ? moment.parseZone(new Date(properties[data.key])).format("MM/DD/yyyy") : "-")}
                          {data.type === "custom" && (
                            <>
                              {data.key === "qualifier" && (properties[data.key]?.name || "-")}
                              {data.key === "campaignName" && (
                                <CampaignNameField
                                  className={classes.maxWidth}
                                  onChange={(value) => {
                                    updateProperties(null, data.key, value);
                                  }}
                                  value={properties[data.key] ? properties[data.key] : []}
                                  fullWidth
                                />
                              )}
                            </>
                          )}
                          {data.type !== "date" &&
                            data.type !== "custom" &&
                            data.type !== "currency" &&
                            data.type !== "comma-number" &&
                            data.type !== "multiselect" &&
                            (data.value || get(properties, `${data.key}`, "-"))}
                          {data.type === "multiselect" && get(properties, `${data.key}`, []).join(", ")}
                          {data.type === "currency" && (vf_currency(data.value) || vf_currency(properties[data.key]) || "-")}
                          {data.type === "comma-number" && (vf_number(data.value) || vf_number(properties[data.key]) || "-")}
                        </Grid>
                      )}
                      {!data.nonEditable && (
                        <Grid item>
                          {editIconState[data.key] && (
                            <Tooltip title={"Edit"} placement="top">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setTableDataState({ [data.key]: true });
                                }}
                              >
                                <CreateTwoToneIcon id="contPencilIcon" className={classes.pencilIcon} />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Grid>
                      )}
                    </Grid>
                  </div>
                )}
              </TableCell>
            </TableRow>
          </>
        ))}
      </TableBody>
    </Table>
  );
}
