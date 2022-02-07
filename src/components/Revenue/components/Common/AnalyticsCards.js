import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/styles";
import { Grid, Card, CardContent, Typography } from "@material-ui/core";
import { Warning as WarningIcon } from "@material-ui/icons";
import { useLazyQuery } from "@apollo/client";

import { GET_ES_AGGS_LIST } from "graphQL/useQueryESAggsList";

const useStyles = makeStyles(() => ({
  root: {
    padding: 20,
    width: "100%",
    margin: 0,
    backgroundColor: "#fff",
  },
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

export default function AnalyticsCards({
  esIndex,
  esFilters,
  totalCount,
  cardsDefault,
  landSearchQuery,
}) {
  const classes = useStyles();
  const [cards, setCards] = useState(cardsDefault);

  const setCardPoint = (count, index) => {
    const newCards = JSON.parse(JSON.stringify(cards));
    newCards[index].points = count;
    setCards(newCards);
  };

  const addDays = (str, days) => {
    var myDate = new Date(str);
    myDate.setDate(myDate.getDate() + parseInt(days));
    return myDate.toISOString();
  }

  const [getESAggsActiveCount, { }] = useLazyQuery(GET_ES_AGGS_LIST, {
    context: { batch: true },
    fetchPolicy: "no-cache",
    onCompleted: (aggsData) => {
      if (aggsData?.getESAggsList?.aggregations?.aggs?.buckets) {
        const buckets = aggsData.getESAggsList.aggregations.aggs?.buckets;
        const activeBucket = buckets[0];
        cards[1].points = activeBucket?.['doc_count'];
        cards[2].points = totalCount - activeBucket?.['doc_count'];
        setCards(cards);
      }
    },
  });

  const getApprovedCount = (buckets) => {
    const activeBucket = buckets.filter((item) => item.key.toLowerCase() === "approved" && item);
    return activeBucket && activeBucket?.length > 0 ? activeBucket[0]['doc_count'] : 0
  }

  const [getESAggsApprovedCount, { }] = useLazyQuery(GET_ES_AGGS_LIST, {
    context: { batch: true },
    fetchPolicy: "no-cache",
    onCompleted: (aggsData) => {
      if (aggsData?.getESAggsList?.aggregations?.approvedCount?.buckets) {
        const buckets = aggsData?.getESAggsList?.aggregations?.approvedCount?.buckets;
        const count = buckets && buckets.length > 0 ? getApprovedCount(buckets) : 0;
        setCardPoint(totalCount - count, 3);
      }
    },
  });

  const propertiesAnalytics = () => {
    getESAggsActiveCount({
      variables: {
        esIndex,
        search: landSearchQuery ? `${landSearchQuery}*` : "",
        filters: esFilters,
        aggs: {
          name: {
            terms: { field: "lastCheck._id.keyword" }
          },
          aggs: {
            range: {
              field: "lastCheck.checkDate",
              ranges: [
                { from: `${addDays((new Date((new Date()).setMonth((new Date()).getMonth() - 3))).toISOString(), 1)}` }
              ]
            }
          }
        },
      },
    });
    getESAggsApprovedCount({
      variables: {
        esIndex,
        search: landSearchQuery ? `${landSearchQuery}*` : "",
        filters: esFilters,
        aggs: {
          approvedCount: {
            terms: { field: "status.keyword" },
          }
        },
      },
    });
  };


  useEffect(() => {
    setCardPoint(totalCount, 0);
    if (totalCount > 0) {
      propertiesAnalytics();
    } else {
      setCards(cardsDefault);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalCount]);

  return (
    <Grid container direction="row" display="flex" align="center" spacing={4} textAlign="left" className={classes.root}>
      {cards && cards.map((card, index) => (
        <Grid item md={3}>
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
