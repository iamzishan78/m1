import React, { useEffect, useState, memo } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Card, CardContent, Typography, IconButton } from '@material-ui/core';
import { useLazyQuery } from '@apollo/client';
import FilterIcon from 'components/Common/SvgIcons/Filter';
import { copy } from 'components/Shared/functions';
import { vf_currency_dollar } from 'components/Shared/valueformatters/vf_currency';
import { tableController } from 'hookstate/tableController';
import { GET_ES_SIMPLE_FILTER } from 'graphQL/useQueryESSimpleFilter';
import { GET_REVENUE_ANALYTICS_COUNT } from 'graphQL/useQueryRevenueAnalyticsCounts';

const useStyles = makeStyles(() => ({
  root: {
    padding: '0px 20px',
    width: '100%',
    margin: 0,
    backgroundColor: '#fff',
  },
  card: { borderRadius: '8px' },
  cardHeaderTypography: {
    fontWeight: 'bolder',
    marginBottom: '25px',
  },
  cardNumberTypography: {
    fontWeight: 900,
    fontSize: 'xx-large',
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '160px',
    textAlign: 'left',
  },
  issuesBadges: {
    display: 'flex',
    alignItems: 'center',
    color: '#ff0000',
    height: '20px',
  },
  tooltip: {
    position: 'absolute',
    top: 72,
    color: 'rgb(255, 0, 0)',
    width: 200,
    left: -148,
  },
  tooltipText: {
    fontSize: 14,
    lineHeight: '120%',
    textAlign: 'left',
  },
  filterButton: {
    padding: 5,
    '& .MuiIconButton-label': {
      height: 24,
      width: 24,
    },
    '& svg': {
      flex: 1,
    },
    '& .filter-alt': {
      display: 'none',
    },
    '&.active .filter-alt': {
      display: 'block',
    },
    '&.active .filter-outlined': {
      display: 'none',
    },
    '&:hover .filter-alt': {
      display: 'inline-block',
    },
    '&:hover .filter-outlined': {
      display: 'none',
    },
  },
}));

function AnalyticsCards(props) {
  const classes = useStyles();
  const [isFiltered, setFiltered] = useState(null);

  const tableState = tableController(props.esIndex).useState(['filters', 'data']);
  const tableStateValues = tableState.stateValues;

  const [getESSimpleFilter] = useLazyQuery(GET_ES_SIMPLE_FILTER, {
    fetchPolicy: 'no-cache',
  });

  const [getPropertyNumbers] = useLazyQuery(GET_ES_SIMPLE_FILTER, {
    fetchPolicy: 'no-cache',
  });

  const [getCheckNumbers] = useLazyQuery(GET_ES_SIMPLE_FILTER, {
    fetchPolicy: 'no-cache',
  });

  const [getRevenueAnalyticsCount] = useLazyQuery(GET_REVENUE_ANALYTICS_COUNT, {
    fetchPolicy: 'no-cache',
  });

  const getRevenueComparisonAnalytics = async () => {
    const propertiesPromise = new Promise((resolve, reject) => {
      getESSimpleFilter({
        variables: {
          index: 'checkdetailsinterestscomparison_flat',
          filters: [...(tableStateValues?.filters || []), { field: 'property.IsDeleted', value: false, type: 'term' }],
          filterKey: 'property._id.keyword',
          filterAggs: { query: '', field: 'property._id.keyword', size: tableStateValues?.data?.total || 0 },
        },
        onCompleted: res => resolve(res?.getESSimpleFilter?.hits?.length),
        onError: error => reject(error),
      });
    });

    const propertyNumbersPromise = new Promise((resolve, reject) => {
      getPropertyNumbers({
        variables: {
          index: 'checkdetailsinterestscomparison_flat',
          filters: [...(tableStateValues?.filters || []), { field: 'property.IsDeleted', value: false, type: 'term' }],
          filterKey: 'property.number.keyword',
          filterAggs: { query: '', field: 'property.number.keyword', size: tableStateValues?.data?.total || 0 },
        },
        onCompleted: res => resolve(res?.getESSimpleFilter?.hits),
        onError: error => reject(error),
      });
    });

    const checkNumbersPromise = new Promise((resolve, reject) => {
      getCheckNumbers({
        variables: {
          index: 'checkdetailsinterestscomparison_flat',
          filters: [...(tableStateValues?.filters || [])],
          filterKey: 'check.checkNumber.keyword',
          filterAggs: { query: '', field: 'check.checkNumber.keyword', size: tableStateValues?.data?.total || 0 },
        },
        onCompleted: res => resolve(res?.getESSimpleFilter?.hits),
        onError: error => reject(error),
      });
    });

    const otherSummaryPromise = new Promise((resolve, reject) => {
      getRevenueAnalyticsCount({
        variables: {
          index: 'checkdetailsinterestscomparison_flat',
          filters: [...(tableStateValues?.filters || [])],
          filterKey: 'property._id.keyword',
          filterAggs: { query: '', field: 'property._id.keyword', size: tableStateValues?.data?.total || 0 },
        },
        onCompleted: res => resolve(res?.getRevenueAnalyticsCounts?.result),
        onError: error => reject(error),
      });
    });

    const [propertiesCount, revenueComparisonAnalytics, propertyNumbersHits, checkNumbersHits] = await Promise.all([
      propertiesPromise,
      otherSummaryPromise,
      propertyNumbersPromise,
      checkNumbersPromise,
    ]);
    return { propertiesCount, revenueComparisonAnalytics, propertyNumbersHits, checkNumbersHits };
  };

  useEffect(() => {
    if (!tableStateValues?.data?.total) return;
    (async () => {
      const { propertiesCount, revenueComparisonAnalytics, propertyNumbersHits, checkNumbersHits } =
        await getRevenueComparisonAnalytics();
      const propertyNumbers = propertyNumbersHits ? propertyNumbersHits.map(hit => hit.key) : [];
      const checkNumbers = checkNumbersHits ? checkNumbersHits.map(hit => hit.key) : [];
      props.onGettingAnalytics({
        propertiesCount,
        checksCount: revenueComparisonAnalytics?.distinctChecksCount,
        misMatchedInterestsCount: revenueComparisonAnalytics?.misMatchedCount,
        potentialGainLossSum: revenueComparisonAnalytics?.potentialGainLossSum[0]?.totalSum,
        propertyNumbers,
        checkNumbers,
      });
    })();
  }, [tableState?.filters, tableState?.data?.total]);

  useEffect(() => {
    let filters = copy(props.esFilters);
    filters = filters.filter((filter, index) => filter.field !== 'isMisMatchedInterest');
    if (isFiltered)
      filters.push({
        field: 'isMisMatchedInterest',
        value: true,
        type: 'term',
      });
    props.setESFilters(filters);
  }, [isFiltered]);

  return (
    <Grid container direction="row" display="flex" align="center" spacing={4} textAlign="left" className={classes.root}>
      <Grid item md={3}>
        <Card variant="outlined" className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
              Total Properties
            </Typography>
            <Typography variant="h6" component="div" className={classes.cardNumberTypography}>
              {props?.propertiesCount || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item md={3}>
        <Card variant="outlined" className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
              Total Checks
            </Typography>
            <Typography variant="h6" component="div" className={classes.cardNumberTypography}>
              {props?.checksCount || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item md={3}>
        <Card variant="outlined" className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
              Mismatched Interests
              <IconButton
                className={[
                  classes.filterButton,
                  'filterButton',
                  (isFiltered === 'misMatchedInterests' && 'active') || '',
                ]}
                onClick={() => {
                  setFiltered(isFiltered === 'misMatchedInterests' ? '' : 'misMatchedInterests');
                }}
              >
                <FilterIcon className="filter-alt" />
                <FilterIcon variant="outlined" className="filter-outlined" />
              </IconButton>
            </Typography>
            <Typography variant="h6" component="div" className={classes.cardNumberTypography} style={{ color: 'red' }}>
              {props?.misMatchedInterestsCount || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item md={3}>
        <Card variant="outlined" className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
              Potential Gain/Loss
            </Typography>
            <Typography variant="h6" component="div" className={classes.cardNumberTypography} style={{ color: 'red' }}>
              {vf_currency_dollar(props?.potentialGainLossSum, 2)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default memo(AnalyticsCards);