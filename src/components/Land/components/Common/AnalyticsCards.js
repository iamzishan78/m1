import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/styles";
import { Grid, Card, CardContent, Typography } from "@material-ui/core";
import { Warning as WarningIcon } from "@material-ui/icons";
import { useLazyQuery } from "@apollo/client";

import { GET_ES_AGGS_LIST } from "graphQL/useQueryESAggsList";

export const useStyles = makeStyles(() => ({
  root: {},
  card: { borderRadius: "8px" },
  cardHeaderTypography: {
    fontWeight: "bolder",
    marginBottom: "25px",
  },
  cardNumberTypography: {
    fontWeight: 900,
    fontSize: "xx-large",
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "160px",
    textAlign: "left",
  },
  issuesBadges: {
    display: "flex",
    alignItems: "center",
    color: "red",
    height: "20px",
  },
}));

export default function AnalyticsCards({ parent, esIndex, esFilters, totalCount, cardsDefault, landSearchQuery }) {
  const classes = useStyles();
  const [cards, setCards] = useState(cardsDefault);

  const setCardPoint = (count, index) => {
    const newCards = JSON.parse(JSON.stringify(cards));
    newCards[index].heading = cardsDefault[index].heading;
    newCards[index].points = count;
    setCards(newCards);
  };

  const [getESAggsActiveCount] = useLazyQuery(GET_ES_AGGS_LIST, {
    context: { batch: true },
    fetchPolicy: "no-cache",
    onCompleted: (aggsData) => {
      if (aggsData?.getESAggsList?.aggregations?.activeCount) {
        const count = aggsData.getESAggsList.aggregations.activeCount.value;
        cards[1].points = count;
        cards[2].points = totalCount - count;
        setCards(cards);
      }
    },
  });

  const [getESAggsApprovedCount] = useLazyQuery(GET_ES_AGGS_LIST, {
    context: { batch: true },
    fetchPolicy: "no-cache",
    onCompleted: (aggsData) => {
      if (aggsData?.getESAggsList?.aggregations?.approvedCount) {
        const count = aggsData.getESAggsList.aggregations.approvedCount.value;
        setCardPoint(totalCount - count, 3);
      }
    },
  });

  const [getESAggsGrossAcresSum, { }] = useLazyQuery(GET_ES_AGGS_LIST, {
    context: { batch: true },
    fetchPolicy: "no-cache",
    onCompleted: (aggsData) => {
      if (aggsData?.getESAggsList?.aggregations?.grossAcresSum) {
        const grossAcresSum = aggsData.getESAggsList.aggregations.grossAcresSum.value.sum;
        setCardPoint(
          (Math.round((grossAcresSum + Number.EPSILON) * 100) / 100000).toLocaleString(undefined, { maximumFractionDigits: 1 }) + "K",
          1
        );
        // props.onGrossAcresSum(
        //   aggsData?.getESAggsList?.aggregations?.grossAcresSum?.value
        // );
      }
    },
  });

  const [getESAggsNetAcresSum, { }] = useLazyQuery(GET_ES_AGGS_LIST, {
    context: { batch: true },
    fetchPolicy: "no-cache",
    onCompleted: (aggsData) => {
      if (aggsData?.getESAggsList?.aggregations?.netAcresSum) {
        const netAcresSum = aggsData.getESAggsList.aggregations.netAcresSum.value;
        setCardPoint(
          (Math.round((netAcresSum + Number.EPSILON) * 100) / 100000).toLocaleString(undefined, { maximumFractionDigits: 1 }) + "K",
          2
        );
        // props.onNetAcresSum(
        //   aggsData?.getESAggsList?.aggregations?.netAcresSum?.value
        // );
      }
    },
  });

  const [getESAggsNetRoyaltyAcresSum, { }] = useLazyQuery(GET_ES_AGGS_LIST, {
    context: { batch: true },
    fetchPolicy: "no-cache",
    onCompleted: (aggsData) => {
      if (aggsData?.getESAggsList?.aggregations?.netRoyaltyAcresSum) {
        const netRoyaltyAcresSum = aggsData.getESAggsList.aggregations.netRoyaltyAcresSum.value;
        setCardPoint(
          (Math.round((netRoyaltyAcresSum + Number.EPSILON) * 100) / 100000).toLocaleString(undefined, { maximumFractionDigits: 1 }) + "K",
          3
        );
        // props.onNetRoyaltyAcresSum(
        //   aggsData?.getESAggsList?.aggregations?.netRoyaltyAcresSum?.value
        // );
      }
    },
  });

  const agreementAnalytics = () => {
    getESAggsActiveCount({
      variables: {
        esIndex,
        search: landSearchQuery ? `${landSearchQuery}*` : "",
        filters: [
          ...esFilters,
          {
            field: "shapeJson.properties.agreementStatus",
            value: "ACTIVE",
          },
        ],
        aggs: {
          activeCount: {
            cardinality: { field: "shapeJson.id.keyword" },
          },
        },
      },
    });
    getESAggsApprovedCount({
      variables: {
        esIndex,
        search: landSearchQuery ? `${landSearchQuery}*` : "",
        filters: [
          ...esFilters,
          {
            field: "shapeJson.properties.approvalStatus",
            value: "APPROVED",
          },
        ],
        aggs: {
          approvedCount: {
            cardinality: { field: "shapeJson.id.keyword" },
          },
        },
      },
    });
  };

  const tractsAnalytics = () => {
    getESAggsGrossAcresSum({
      variables: {
        esIndex: "shapeowners_flat",
        search: landSearchQuery ? `${landSearchQuery}*` : "",
        filters: [{ field: "shape.layer", value: "parcel" }, ...esFilters],
        aggs: {
          grossAcresSum: {
            scripted_metric: {
              init_script: "state.id_map = [:]; state.sum = 0.0; state.elem_count = 0.0;",
              map_script: `
                def id = doc['shape._id.keyword'].value;
                if (!state.id_map.containsKey(id)) {
                  state.id_map[id] = true;
                  state.elem_count++;
                  state.sum += doc['grossAcres'].size()==0 ? 0 : doc['grossAcres'].value;
                }
              `,
              combine_script: `
                  def count = state.elem_count;
                  def sum = state.sum;
                  //def avg = sum / count;
      
                  def stats = [:];
                  stats.count = count;
                  stats.sum = sum;
                  //stats.avg = avg;
      
                  return stats
              `,
              reduce_script: "return states[0]",
            },
          },
        },
      },
    });
    getESAggsNetAcresSum({
      variables: {
        esIndex: "shapeowners_flat",
        search: landSearchQuery ? `${landSearchQuery}*` : "",
        filters: [{ field: "shape.layer", value: "parcel" }, ...esFilters],
        aggs: {
          netAcresSum: {
            sum: {
              field: "net_acres",
            },
          },
        },
      },
    });
    getESAggsNetRoyaltyAcresSum({
      variables: {
        esIndex: "shapeowners_flat",
        search: landSearchQuery ? `${landSearchQuery}*` : "",
        filters: [{ field: "shape.layer", value: "parcel" }, ...esFilters],
        aggs: {
          netRoyaltyAcresSum: {
            sum: {
              field: "nra",
            },
          },
        },
      },
    });
  };

  const getAggsCounts = () => {
    if (totalCount > 0) {
      if (parent === "Agreements") {
        agreementAnalytics();
      }
    }
    if (parent === "Tracts") {
      tractsAnalytics();
    }
  };

  useEffect(() => {
    setCardPoint(totalCount, 0);
    getAggsCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalCount]);

  return (
    <Grid container direction="row" display="flex" align="center" spacing={4} textAlign="left" className={classes.root}>
      {cards.map((card, index) => (
        <Grid item md={3} key={index}>
          <Card variant="outlined" className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
                {card.heading}
              </Typography>
              {card.type === "error" && (
                <div className={classes.issuesBadges}>
                  <div>
                    <WarningIcon />
                  </div>{" "}
                  <div>3</div>
                  &nbsp;
                  <div>
                    <WarningIcon />
                  </div>
                  <div>4</div>
                  &nbsp;
                  <div>
                    <WarningIcon />
                  </div>{" "}
                  <div>1</div>
                </div>
              )}
              <Typography
                variant="h6"
                component="div"
                className={classes.cardNumberTypography}
                style={{ color: card.type === "warning" ? "#b9b908" : "" }}
              >
                {card.points}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
