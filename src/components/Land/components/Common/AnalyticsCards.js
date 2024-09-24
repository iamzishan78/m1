import React, { useEffect, useMemo, useState } from "react";

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
        const grossAcresSum = aggsData.getESAggsList.aggregations.grossAcresSum.value;
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

  const filters = esFilters.map(filter => {
    const updatedField = filter.field === 'layer.keyword' && filter.value === 'parcel' 
      ? 'shape.layer.keyword' 
      : filter.field;

    // Return a new object with the updated field, ensuring immutability
    return {
      ...filter,
      field: updatedField,
    };
  });

  const analyticsPayload = useMemo(() => {
    let aggsFilters = filters || [];
    let grossAcersObject, netAcersField, nraField;

    // Case when the Elasticsearch index is 'shapeowners_flat'
    if (esIndex === 'shapeowners_flat') {
      // Add an additional filter for 'shape.layer' to ensure we're only working with 'parcel' layer
      aggsFilters.unshift({ field: 'shape.layer', value: 'parcel' });

      // Create a scripted metric aggregation for 'grossAcres' in 'shapeowners_flat'
      grossAcersObject = {
        scripted_metric: {
          init_script: `
            state.id_map = [:];
            state.sum = 0.0;
          `,
          map_script: `
            def id = doc['shape._id.keyword'].value;
            if (!state.id_map.containsKey(id)) {
              state.id_map[id] = true;
              state.sum += doc['grossAcres'].size() == 0 ? 0 : doc['grossAcres'].value;
            }
          `,
          combine_script: `
            return state.sum;
          `,
          reduce_script: `
            double totalSum = 0.0;
            for (state in states) {
              totalSum += state;
            }
            return totalSum;
          `,
        },
      };
      

      // Set the field names for 'net_acres' and 'nra' specific to 'shapeowners_flat'
      netAcersField = 'net_acres';
      nraField = 'nra';
    } else if (esIndex === 'shapes_flat') {
      // Case when the Elasticsearch index is 'shapes_flat'

      // Add an additional filter for 'layer' to ensure we're only working with 'parcel' layer
      aggsFilters.unshift({ field: 'layer', value: 'parcel' });

      // Create a simple sum aggregation for 'sdGrossAcres' in 'shapes_flat'
      grossAcersObject = {
        sum: {
          field: 'shapeJson.properties.sdGrossAcres',
        },
      };

      // Set the field names for 'net_acres' and 'nra' specific to 'shapes_flat'
      netAcersField = 'shapeJson.properties.shapeArea';
      nraField = 'shapeJson.properties.netRoyalityAcres.calculatedNra';
    }

    return { aggsFilters, grossAcersObject, netAcersField, nraField };
  }, [esIndex, filters, landSearchQuery]);
  
  const tractsAnalytics = () => {
    getESAggsGrossAcresSum({
      variables: {
        esIndex: esIndex || "shapeowners_flat",
        search: landSearchQuery ? `*${landSearchQuery}*` : "",
        filters: analyticsPayload.aggsFilters,
        aggs: {
          grossAcresSum: analyticsPayload.grossAcersObject,
        },
      },
    });
    getESAggsNetAcresSum({
      variables: {
        esIndex: esIndex || "shapeowners_flat",
        search: landSearchQuery ? `*${landSearchQuery}*` : "",
        filters: analyticsPayload.aggsFilters,
        aggs: {
          netAcresSum: {
            sum: {
              field: analyticsPayload.netAcersField,
            },
          },
        },
      },
    });
    getESAggsNetRoyaltyAcresSum({
      variables: {
        esIndex: esIndex || "shapeowners_flat",
        search: landSearchQuery ? `*${landSearchQuery}*` : "",
        filters: analyticsPayload.aggsFilters,
        aggs: {
          netRoyaltyAcresSum: {
            sum: {
              field: analyticsPayload.nraField,
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
      } else if (parent === "Tracts") {
        // Get tract analytics data
        tractsAnalytics();
      }
    }
  };

  useEffect(() => {
    setCardPoint(totalCount, 0);
    getAggsCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalCount, esFilters, landSearchQuery]);

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
