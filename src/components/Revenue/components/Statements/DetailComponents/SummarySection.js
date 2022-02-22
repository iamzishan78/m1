import { useState, useEffect, useMemo } from "react";
import { get } from "lodash";
import { Typography, Grid, Divider, Popover, List, ListItem, ListItemText, Button } from "@material-ui/core";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import { makeStyles } from "@material-ui/styles";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import vf_number from "components/Shared/valueformatters/vf_number";

import { useLazyQuery } from "@apollo/client";
import { GET_ES_AGGS_LIST } from "graphQL/useQueryESAggsList";

// Components
import PieChartWithLegend from "./Charts/PieChartWithLegend";
import BarChartWithController from "./Charts/BarChartWithController";

export const TabButtons = ({ tab, actiiveId, setActive }) => {
  return (
    <div className={tab?.id === actiiveId ? "tab_button active" : "tab_button inactive"} onClick={() => setActive(tab?.id)}>
      {tab.label}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 0,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
  },
  textTransform: {
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  tabButtons: {
    maxWidth: 440,
    margin: "20px 0 32px",
  },
  totalLabelField: {
    marginBottom: 24,
    maxWidth: 400,
  },
  totalLabelTextColor: {
    color: "#959595",
  },
  graphCard: {
    border: "2px solid #959595",
    borderRadius: 8,
    maxWidth: "440px",
    padding: "0px 10px",
    height: "300px",
  },
  dataCardWidth: {
    maxWidth: 400,
  },
  dataCardMargin: {
    margin: "22px 0px",
  },
  productNameBox: {
    background: "#00000070",
    borderRadius: 8,
    padding: "8px 12px",
  },
  productName: {
    fontSize: 14,
    color: "#ffffff",
    margin: 0,
  },
  field: {
    margin: "16px 0 0",
  },
  fieldLabel: {
    fontSize: 14,
    textAlign: "center",
  },
  fieldValue: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    margin: 0,
  },
  analyticTable: {
    width: "240px",
    marginLeft: "45px",
    "& .MuiDivider-root": {
      backgroundColor: "#c5c5c5",
      height: "1.5px",
    },
  },
  productGridRow: {
    margin: "15px 0px",
  },
  headerRow: {
    "& .MuiGrid-item": {
      fontSize: "13px",
      fontWeight: "bold",
      textAlign: "center",
    },
  },
  contentRow: {
    "& .MuiGrid-item": {
      fontSize: "15px",
      textAlign: "center",
    },
  },
  optionsList: {
    maxHeight: "450px",
  },
  optionButton: {
    backgroundColor: "white",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "white",
    },
  },
}));

const ProductDropdown = () => {
  const classes = useStyles();
  const [selectedProductOption, setProductOption] = useState("Gross Production");

  const options = useMemo(() => ["Gross Production", "Net Production", "Net Revenue", "Average Price"], []);
  return (
    <PopupState variant="popper" popupId="RevenueSummaryProduct">
      {(popupState) => (
        <>
          <div style={{ cursor: "pointer", textAlign: "center" }} {...bindTrigger(popupState)}>
            <Button className={classes.optionButton} endIcon={<KeyboardArrowDownIcon fontSize="small" />}>
              {selectedProductOption}
            </Button>
          </div>
          <Popover
            {...bindPopover(popupState)}
            getContentAnchorEl={null}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <List className={classes.optionsList}>
              {options.map((option, index) => (
                <ListItem
                  button
                  key={index}
                  onClick={() => {
                    popupState.close();
                    setProductOption(option);
                  }}
                  style={{ textTransform: "uppercase" }}
                  selected={option === selectedProductOption}
                >
                  <ListItemText primary={option} />
                </ListItem>
              ))}
            </List>
          </Popover>
        </>
      )}
    </PopupState>
  );
};

const SummarySection = ({ checkId }) => {
  const classes = useStyles();
  const [activeTabId, setActiveTabId] = useState(1);
  const [revenueSummaryDetails, setRevenueSummaryDetails] = useState([]);
  const [adjustmentSummaryDetails, setAdjustmentSummaryDetails] = useState([]);
  const [productSummaryDetails, setProductSummaryDetails] = useState([]);

  // queries
  const [getESAggsRevenue, { data: revenueSummary }] = useLazyQuery(GET_ES_AGGS_LIST, {
    context: { batch: true },
    fetchPolicy: "no-cache",
  });

  const [getESAggAdjustment, { data: adjustmentSummary }] = useLazyQuery(GET_ES_AGGS_LIST, {
    context: { batch: true },
    fetchPolicy: "no-cache",
  });

  const [getESProductSummary, { data: productSummary }] = useLazyQuery(GET_ES_AGGS_LIST, {
    context: { batch: true },
    fetchPolicy: "no-cache",
  });

  let revSummary = revenueSummary?.getESAggsList?.aggregations;
  let adjSummary = adjustmentSummary?.getESAggsList?.aggregations;
  let prodSummary = productSummary?.getESAggsList?.aggregations;

  const summaryTabs = [
    { id: 1, label: "Revenue" },
    { id: 2, label: "Products" },
    { id: 3, label: "Adjustments" },
  ];

  useEffect(() => {
    getESAggsRevenue({
      variables: {
        esIndex: "checkdetails_flat",
        search: "",
        filters: [
          {
            field: "check._id.keyword",
            value: checkId,
          },
        ],
        aggs: {
          grossRevenue: { sum: { field: "grossOwnerValue" } },
          netOwnerValue: { sum: { field: "netOwnerValue" } },
          ownerDeducts: { sum: { field: "ownerDeducts" } },
          ownerTax: { sum: { field: "ownerTax" } },
        },
      },
    });

    getESAggAdjustment({
      variables: {
        esIndex: "checkdetails_flat",
        search: "",
        filters: [
          {
            field: "check._id.keyword",
            value: checkId,
          },
        ],
        aggs: {
          taxType: {
            terms: { field: "taxType.keyword" },
            aggs: { ownerTax: { sum: { field: "ownerTax" } } },
          },
          deductType: {
            terms: { field: "deductType.keyword" },
            aggs: { ownerDeducts: { sum: { field: "ownerDeducts" } } },
          },
        },
      },
    });

    getESProductSummary({
      variables: {
        esIndex: "checkdetails_flat",
        search: "",
        filters: [
          {
            field: "check._id.keyword",
            value: checkId,
          },
        ],
        aggs: {
          product: {
            terms: { field: "product.keyword" },
            aggs: {
              grossPropertyVolume: { sum: { field: "grossPropertyVolume" } },
              grossOwnerVolume: { sum: { field: "grossOwnerVolume" } },
              netRevenue: { sum: { field: "netOwnerValue" } },
              avgPrice: { avg: { field: "price" } },
            },
          },
        },
      },
    });
  }, [checkId]);

  // revenue summary
  useEffect(() => {
    if (revSummary) {
      setRevenueSummaryDetails([
        { name: "Gross Revenue", value: `${revSummary?.grossRevenue?.value.toFixed(2)}` },
        { name: "Adjustments", value: `(${(revSummary?.ownerDeducts?.value + revSummary?.ownerTax?.value).toFixed(2)})` },
        { name: "Net Revenue", value: `${(revSummary?.netOwnerValue?.value).toFixed(2)}` },
        { name: "Lease Payments", value: revSummary?.leasePayments?.value ? `${revSummary.leasePayments.value.toFixed(2)}` : "-" },
        { name: "Other", value: revSummary?.other?.value ? `${revSummary.other.value.toFixed(2)}` : "-" },
        {
          name: "Total Income",
          value: `${(
            get(revSummary, "netOwnerValue.value", 0) +
            get(revSummary, "leasePayments.value", 0) +
            get(revSummary, "other.value", 0)
          ).toFixed(2)}`,
        },
      ]);
    }
  }, [revSummary]);

  // products summary
  useEffect(() => {
    if (prodSummary) {
      const products = ["OIL", "GAS", "NGL", "OTHER"];
      let buckets = [];
      products.forEach((p) => {
        const index = prodSummary?.product?.buckets.findIndex((b) => b.key === p);
        if (index !== -1) buckets.push(prodSummary?.product?.buckets[index]);
      });

      buckets = buckets.map((b) => ({
        ...b,
        grsProd: b.grossPropertyVolume ? vf_number((Math.round(get(b, "grossPropertyVolume.value") * 100) / 100).toFixed(2)) : "-",
        netProd: b.grossOwnerVolume ? vf_number((Math.round(get(b, "grossOwnerVolume.value") * 100) / 100).toFixed(2)) : "-",
        netRevenue: b.netRevenue ? vf_number((Math.round(get(b, "netRevenue.value") * 100) / 100).toFixed(2)) : "-",
        avgPrice: b.avgPrice ? vf_number((Math.round(get(b, "avgPrice.value") * 100) / 100).toFixed(2)) : "-",
      }));
      buckets.push({
        key: "OTHER",
        grsProd: "-",
        netProd: "-",
        netRevenue: "-",
        avgPrice: "-",
      });
      setProductSummaryDetails(buckets);
    }
  }, [prodSummary]);

  // adjustment summary
  useEffect(() => {
    if (adjSummary) {
      let { deductType, taxType } = adjSummary;

      const deducts =
        deductType?.buckets?.length > 0 ?
        deductType?.buckets?.map((item) => ({ name: item.key, value: (item.ownerDeducts?.value).toFixed(2) })) :
        [];
      const taxes =
        taxType?.buckets?.length > 0 ?
        taxType?.buckets?.map((item) => ({ name: item.key, value: (item.ownerTax?.value).toFixed(2) })) :
        [];

      const adjustments = [...deducts, ...taxes];
      let totalAdjustment = 0;
      adjustments.forEach((a) => {
        totalAdjustment += parseFloat(a.value);
      });
      adjustments.push({ name: "Total Adjustments", value: `${totalAdjustment}` });
      setAdjustmentSummaryDetails(adjustments);
    }
  }, [adjSummary]);

  const wrapWithBrackets = (string) => {
    return `${string ? `(${string})` : "-"}`;
  };

  return (
    <div className={`${classes.root} flex column justifyStart alignStart w-100`}>
      <div className={`${classes.tabButtons} flex justifyBetween alignCenter w-100`}>
        {summaryTabs.map((tab, index) => (
          <TabButtons key={index + 1} tab={tab} actiiveId={activeTabId} setActive={(selectedId) => setActiveTabId(selectedId)} />
        ))}
      </div>

      {/* Revenue */}
      {activeTabId === 1 && (
        <Grid container display="flex" direction="row" alignItems="center" justify="flex-start" spacing={3}>
          <Grid item xs={6}>
            <div className={classes.graphCard}>
              <PieChartWithLegend type="revenue" chartData={revenueSummaryDetails} />
            </div>
          </Grid>
          <Grid item xs={5}>
            <div className={classes.analyticTable}>
              {revenueSummaryDetails?.length > 0 &&
                revenueSummaryDetails.map((item, index) => (
                  <>
                    {item.name === "Total Income" && <Divider />}
                    <div
                      key={index + 1}
                      className={`${classes.dataCardWidth} ${classes.dataCardMargin} flex justifyBetween alignCenter w-100`}
                    >
                      <div className="flex alignCenter justifyStart">
                        <Typography varient="h6" className={classes.textTransform}>
                          {item.name || ""}
                        </Typography>
                      </div>

                      <div className="flex" style={{ minWidth: "60px", alignItems: "center", justifyContent: "center" }}>
                        <Typography varient="h6" className={classes.textTransform}>
                          {item.value}
                        </Typography>
                      </div>
                    </div>
                  </>
                ))}
            </div>
          </Grid>
        </Grid>
      )}

      {/* Property */}
      {activeTabId === 2 && (
        <div className="flex alignCenter w-100" style={{ justifyContent: "flex-start" }}>
          <Grid item xs={5}>
            <div className={classes.graphCard}>
              <ProductDropdown />
              <BarChartWithController productSummaryDetails={productSummaryDetails} />
            </div>
          </Grid>
          <Grid item xs={5}>
            <div>
              <Grid container display="flex" direction="row" alignItems="center">
                <Grid item xs={12}>
                  <Grid
                    container
                    display="flex"
                    direction="row"
                    alignItems="center"
                    justify="space-between"
                    className={`${classes.productGridRow} ${classes.headerRow}`}
                  >
                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}>
                      GRS PROD
                    </Grid>
                    <Grid item xs={2}>
                      NET PROD
                    </Grid>
                    <Grid item xs={2}>
                      NET REV
                    </Grid>
                    <Grid item xs={2}>
                      AVG PRICE
                    </Grid>
                    <Grid item xs={2}></Grid>
                  </Grid>
                </Grid>
                {productSummaryDetails.map((product, index) => (
                  <Grid item xs={12}>
                    <Grid
                      container
                      display="flex"
                      direction="row"
                      alignItems="center"
                      justify="space-between"
                      className={`${classes.productGridRow} ${classes.contentRow}`}
                    >
                      <Grid item xs={2} style={{ fontWeight: "bold" }}>
                        {product.key}
                      </Grid>

                      <Grid item xs={2}>
                        {product.grsProd}
                      </Grid>
                      <Grid item xs={2}>
                        {product.netProd}
                      </Grid>
                      <Grid item xs={2}>
                        {product.netRevenue}
                      </Grid>
                      <Grid item xs={2}>
                        {product.avgPrice}
                      </Grid>
                      <Grid item xs={2}></Grid>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </div>
          </Grid>
        </div>
      )}

      {/* Adjustments */}
      {activeTabId === 3 && (
        <Grid container display="flex" direction="row" alignItems="center" justify="flex-start" spacing={3}>
          <Grid item xs={6}>
            <div className={classes.graphCard}>
              <PieChartWithLegend type="adjustments" chartData={adjustmentSummaryDetails} />
            </div>
          </Grid>
          <Grid item xs={5}>
            <div className={classes.analyticTable} style={{ width: "285px !important" }}>
              {adjustmentSummaryDetails?.length > 0 &&
                adjustmentSummaryDetails.map((item, index) => (
                  <>
                    {item.name === "Total Adjustments" && <Divider />}
                    <div
                      key={index + 1}
                      className={`${classes.dataCardWidth} ${classes.dataCardMargin} flex justifyBetween alignCenter w-100`}
                    >
                      <div className="flex alignCenter justifyStart">
                        <Typography varient="h6" className={classes.textTransform}>
                          {item.name}
                        </Typography>
                      </div>

                      <div className="flex" style={{ minWidth: "60px", alignItems: "center", justifyContent: "center" }}>
                        <Typography varient="h6" className={classes.textTransform}>
                          {item.name === "Total Adjustments" ? item.value : wrapWithBrackets(item.value)}
                        </Typography>
                      </div>
                    </div>
                  </>
                ))}
            </div>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default SummarySection;
