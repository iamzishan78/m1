import React, { memo, useEffect } from "react";
import { get } from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import { Clear, ErrorOutline } from "@material-ui/icons";
import moment from "moment";
import debounce from "lodash/debounce";

import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { UPDATE_CHECK_DATA } from "graphQL/useMutationUpdateCheck";
import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";
import AutocompEntityNamesList from "components/Shared/Forms/Fields/AutocompEntityNamesList";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { showInfoMessage } from "actions";
import { GET_ES_AGGS_LIST } from "graphQL/useQueryESAggsList";
import AutoCompleteWithAddNew from "components/Shared/AutoCompleteWithAddNew";
import { CurrencyFormatCustomWithoutPrefix } from "components/Shared/Forms/Formatting/CurrencyFormatCustomWithoutPrefix";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const useStyles = makeStyles(() => ({
  root: {
    color: "black",
    "&.MuiAccordion-root.Mui-expanded": {
      margin: 0,
    },
    "& .MuiFilledInput-root, & .MuiSelect-select.MuiSelect-select": {
      background: `none!important`,
    },
  },
  titleText: {
    textTransform: "uppercase",
    margin: "5px 16px 10px",
    fontWeight: "bold",
  },
  fieldsSection: {
    margin: "0px 0px",
    "& .MuiOutlinedInput-root": {
      paddingTop: 0,
      paddingBottom: 0,
      height: `46px !important`,
      borderRadius: "6px !important",
    },
  },
  gridStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  boldLabel: {
    fontWeight: "bold",
  },
  datePicker: {
    "& .MuiIconButton-root": {
      padding: "12px 0px"
    }
  },
}));

function HeaderFunction(props) {
  const classes = useStyles();
  const params = useParams();
  const { check, setCheck } = props
  const [updateCheck] = useMutation(UPDATE_CHECK_DATA);
  const { data: elasticData } = useQuery(GET_ES_AGGS_LIST, {
    variables: {
      esIndex: "checkdetails_flat",
      filters: [
        {
          field: "check._id.keyword",
          value: params.id,
        },
      ],
      search: "",
      aggs: {
        totalNetOwnerValue: { sum: { field: "netOwnerValue" } },
      },
    },
    fetchPolicy: "cache-first",
  });
  const history = useHistory();
  const dispatch = useDispatch();
  const [getPayorList, { data: payorList }] = useLazyQuery(GET_ES_FILTER_LIST, { fetchPolicy: "no-cache" });

  const { control, reset, watch } = useForm();


  useEffect(() => {
    return () => {
      const watchCheckNumber = watch("checkNumber")
      const watchCheckDate = watch("checkDate");
      if (((!watchCheckDate || watchCheckDate === '') || (watchCheckDate === 'Invalid date')) && (!watchCheckNumber || watchCheckNumber === '')) {
        dispatch(showInfoMessage("Check Number and Check Date  is required"));
        history.goBack();
      } else {
        if (!watchCheckNumber || watchCheckNumber === '') {
          dispatch(showInfoMessage("Check Number is required"));
          history.goBack();
        }
        if ((!watchCheckDate || watchCheckDate === '') || (watchCheckDate === 'Invalid date')) {
          dispatch(showInfoMessage("Check Date is required"));
          history.goBack();
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getPayorList({
      variables: {
        search: "*",
        filterKey: "payor.name.keyword",
        esIndex: "checks_flat",
        size: 50,
      }
    })
  }, [getPayorList])

  useEffect(() => {
    if (check) {
      reset({ ...check })
      setCheck(check);
    }
  }, [props.check]);

  const handleUpdateCheck = debounce((checkKey) => {
    setCheck({ ...check, ...checkKey })
    updateCheck({
      variables: {
        check: { ...check, ...checkKey }
      },
    });
  }, 500);

  const handleCheckAmount = () => {
    if (check) {
      let checkAmount = check.checkAmount;
      if (checkAmount) {
        const data = checkAmount.toString().split(".");
        if (data[1] && data[1].length === 1 && !/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(data[1])) {
          checkAmount = Number(checkAmount).toFixed(2);
        }
      }
      reset({ ...check, checkAmount })
      setCheck(check);
    }
  };

  const isEqualCheckAmount = (checkAmount) => {
    if (isNaN(elasticData?.getESAggsList?.aggregations?.totalNetOwnerValue?.value) || isNaN(checkAmount))
      return true

    const totalSum = formatter.format(
      elasticData?.getESAggsList?.aggregations?.totalNetOwnerValue?.value || 0
    );
    const fCheckAmount = formatter.format(checkAmount || 0);

    return totalSum === fCheckAmount
  }


  return (
    <div className={classes.root}>
      <Grid
        container
        direction="row"
        display="flex"
        justify="flex-start"
        alignItems="center"
        spacing={1}
        className={classes.fieldsSection}
      >
        <Grid item xs={3}>
          <Grid container className={classes.gridStyle}>
            <Grid item xs={6}>
              <div className={classes.boldLabel}>Check Number</div>
            </Grid>
            <Grid item xs={5}>
              <Controller
                control={control}
                name="checkNumber"
                defaultValue={""}
                render={(props) => (
                  <TextField
                    margin="dense"
                    type="text"
                    variant="outlined"
                    onChange={(e) => {
                      props.onChange(e.target.value);
                      handleUpdateCheck({ checkNumber: e.target.value });
                    }}
                    value={props.value || ""}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={5}>
          <Grid container className={classes.gridStyle}>
            <Grid item xs={3}>
              <div className={classes.boldLabel}>Purchaser</div>
            </Grid>
            <Grid item xs={9}>
              <Controller
                control={control}
                name="payor"
                render={(params) => (
                  <AutoCompleteWithAddNew
                    {...params}
                    value={get(params, "value.name", "")}
                    variant="outlined"
                    setValue={(value) => {
                      if (value?._id)
                        params.onChange({ _id: value._id, name: value.name });
                      else params.onChange({});
                      if (value?._id === "newEntity") delete value._id;
                      handleUpdateCheck({
                        payor: {
                          ...check.payor,
                          name: value?.name,
                          _id: value?._id,
                        },
                      });
                    }}
                    options={get(
                      payorList,
                      "getESFilterList.hits",
                      []
                    )?.map((payor) => ({
                      _id: get(payor, `original.hits.hits.${0}._id`),
                      name: payor.key,
                    }))}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Check date */}
        <Grid item xs={4}>
          <Grid container className={classes.gridStyle}>
            <Grid item xs={5} style={{ paddingLeft: "25px" }}>
              <div className={classes.boldLabel}>Check Date</div>
            </Grid>
            <Grid item xs={6} className={classes.datePicker}>
              <Controller
                control={control}
                name="checkDate"
                defaultValue={moment(props?.value || "").format("MM/DD/YYYY")}
                render={(props) => (
                  <TextField
                    type="date"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={moment(props?.value || "").format("yyyy-MM-DD")}
                    onChange={(e) => {
                      props.onChange(e.target.value);
                    }}
                    onBlur={(e) => {
                      handleUpdateCheck({
                        checkDate: moment(e.target.value).toISOString(),
                      });
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disableToolbar
                    KeyboardButtonProps={{ "aria-label": "change date" }}
                    format="MM/DD/YYYY"
                    PopoverProps={{ disablePortal: false }}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={(event) =>
                            handleUpdateCheck({
                              checkDate: null,
                            })
                          }
                        >
                          <Clear style={{ height: 22, width: 22 }} />
                        </IconButton>
                      ),
                      classes: {
                        root: classes.dateRoot,
                      },
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Owner number */}
        <Grid item xs={3}>
          <Grid container className={classes.gridStyle}>
            <Grid item xs={6}>
              <div className={classes.boldLabel}>Owner Number</div>
            </Grid>
            <Grid item xs={5}>
              <Controller
                control={control}
                name="payee.number"
                defaultValue={""}
                render={(props) => (
                  <TextField
                    margin="dense"
                    type="text"
                    variant="outlined"
                    onChange={(e) => {
                      props.onChange(e.target.value);
                      handleUpdateCheck({
                        payee: { ...check.payee, number: e.target.value },
                      });
                    }}
                    value={props.value || ""}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Owner name */}
        <Grid item xs={5}>
          <Grid container className={classes.gridStyle}>
            <Grid item xs={3}>
              <div className={classes.boldLabel}>Owner</div>
            </Grid>
            <Grid item xs={9}>
              <Controller
                control={control}
                name="payee"
                defaultValue={check?.payee || {}}
                render={({ onChange, value, ref }) => (
                  <AutocompEntityNamesList
                    variant="outlined"
                    margin=""
                    size=""
                    nameAutValue={value}
                    withContactCard={true}
                    setNameAutValue={(value) => {
                      if (value?._id)
                        onChange({ _id: value._id, name: value.name });
                      else onChange({});
                      handleUpdateCheck({
                        payee: {
                          ...check.payee,
                          name: value?.name,
                          _id: value?._id,
                        },
                      });
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Deposit date */}
        <Grid item xs={4}>
          <Grid container className={classes.gridStyle}>
            <Grid item xs={5} style={{ paddingLeft: "25px" }}>
              <div className={classes.boldLabel}>Deposit Date</div>
            </Grid>
            <Grid item xs={6} className={classes.datePicker}>
              <Controller
                control={control}
                name="depositDate"
                defaultValue={null}
                render={(props) => (
                  <TextField
                    type="date"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={moment(props?.value || "").format("yyyy-MM-DD")}
                    onChange={(e) => {
                      props.onChange(e.target.value);
                    }}
                    onBlur={(e) => {
                      handleUpdateCheck({
                        depositDate: moment(e.target.value).toISOString(),
                      });
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disableToolbar
                    KeyboardButtonProps={{ "aria-label": "change date" }}
                    format="MM/DD/YYYY"
                    PopoverProps={{ disablePortal: false }}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={(event) =>
                            handleUpdateCheck({
                              depositDate: null,
                            })
                          }
                        >
                          <Clear style={{ height: 22, width: 22 }} />
                        </IconButton>
                      ),
                      classes: {
                        root: classes.dateRoot,
                      },
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Check amount */}
        <Grid item xs={3}>
          <Grid container className={classes.gridStyle}>
            <Grid item xs={6}>
              <div className={classes.boldLabel}>Check Amount</div>
            </Grid>
            <Grid item xs={5}>
              <Controller
                control={control}
                name="checkAmount"
                defaultValue={""}
                render={(params) => (
                  <TextField
                    margin="dense"
                    type="text"
                    variant="outlined"
                    onChange={(e) => {
                      params.onChange(parseFloat(e.target.value).toFixed(2));
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start"> $</InputAdornment>
                      ),
                      inputComponent: CurrencyFormatCustomWithoutPrefix,
                      endAdornment:
                        !isEqualCheckAmount(params.value) ? (
                          <Tooltip title="Sum of line items not equal to check amount">
                            <ErrorOutline style={{ color: "red" }} />
                          </Tooltip>
                        ) : null,
                    }}
                    value={parseFloat(params.value).toFixed(2) || ""}
                    onBlur={(e) => handleUpdateCheck({ checkAmount: Number(params.value) })}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={5}>
          <Grid container className={classes.gridStyle}>
            <Grid item xs={3}>
              <div className={classes.boldLabel}>Source</div>
            </Grid>
            <Grid item xs={9}>
              <Controller
                control={control}
                name="source"
                defaultValue={""}
                render={(props) => (
                  <Select
                    fullWidth
                    variant="outlined"
                    value={props.value || ""}
                    onChange={(e) => {
                      props.onChange(e.target.value);
                      handleUpdateCheck({ source: e.target.value });
                    }}
                  >
                    <MenuItem value={"Manual Entry"}>Manual Entry</MenuItem>
                    <MenuItem value={"Imported"}>Imported</MenuItem>
                  </Select>
                )}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={4}>
          <Grid container className={classes.gridStyle}>
            <Grid item xs={5} style={{ paddingLeft: "25px" }}>
              <div className={classes.boldLabel}>Source ID</div>
            </Grid>
            <Grid item xs={6}>
              <Controller
                control={control}
                name="sourceId"
                defaultValue={""}
                render={(props) => (
                  <TextField
                    margin="dense"
                    type="text"
                    variant="outlined"
                    onChange={(e) => {
                      props.onChange(e.target.value);
                      handleUpdateCheck({ sourceId: e.target.value });
                    }}
                    value={props.value || ""}
                    fullWidth
                  />
                )}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default memo(HeaderFunction);
