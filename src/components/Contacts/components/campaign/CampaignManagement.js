import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useLazyQuery } from '@apollo/client';

import { AppContext } from 'AppContext';

import CampaignAnalytics from 'components/Contacts/components/CampaignAnalytics';
import CustomCampaignFilters from 'components/Contacts/components/CampaignFilter';
import { GET_ES_MIN_VALUE } from 'graphQL/useQueryESMinValue';
import MRTTable from 'components/MRTTable';
import { tableController } from 'hookstate/tableController';
import { copy, dateFilterToDate } from 'utils/helper';

const CampaignManagement = () => {
  const esIndex = 'campaigns_flat';
  const TableKey = 'CampaignTable';
  const searchFields = ['name', '_all'];
  const [lastCampaignMinDate, setLastCampaignMinDate] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({
    fromDate: null,
    toDate: null,
  });
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [stateApp] = useContext(AppContext);

  const { stateValues } = tableController(TableKey).useState(['filters'])

  const [getESMinValue] = useLazyQuery(GET_ES_MIN_VALUE, {
    fetchPolicy: 'no-cache',
    onCompleted: data => {
      if (data?.getESMinValue) {
        const date = new Date(data?.getESMinValue);
        if (date?.toString() !== 'Invalid Date')
          setLastCampaignMinDate(data?.getESMinValue);
      }
    },
  });

  useEffect(() => {
    getESMinValue({
      variables: {
        esIndex,
        field: 'createdAt',
        value_as_string: true,
      },
    });
  }, [getESMinValue]);

  useEffect(() => {
    setAppliedFilters({
      ...appliedFilters,
      fromDate,
      toDate,
    });
  }, [fromDate, toDate, setAppliedFilters]);

  const setESFilters = useCallback(newFilter => {
    if (newFilter.length === 0) {
      let externalFilters = tableController(TableKey).getExternalFilter()
      tableController(TableKey).clearFilter(externalFilters[0]?.field);
    } else {
      newFilter.forEach(filter => {
        const { field, value, type } = filter;
        let filterToAdd;

        filterToAdd = { field, value, type };

        tableController(TableKey).setFilter(filterToAdd);
      });
    }
  }, []);

  useEffect(() => {
    let filters = copy(tableController(TableKey)?.getExternalFilter()) ?? [];
    filters = filters.filter(
      (filter) =>
        filter.type !== "range"
    );

    console.log(dateFilterToDate(null))

    if (fromDate && toDate)
      filters.unshift({
        field: 'createdAt',
        value: {
          gte: fromDate ? `${fromDate}T00:00:00.000Z` : null,
          lte: toDate ? `${dateFilterToDate(toDate)}T00:00:00.000Z` : null,
        },
        type: "range",
      });

    setESFilters(filters);
  }, [fromDate, toDate, setESFilters])

  return (
    <div style={{ marginTop: '90px' }}>
      <CustomCampaignFilters
        setFromDate={setFromDate}
        setToDate={setToDate}
        esIndex={esIndex}
        searchFields={searchFields}
        tableFilters={stateValues.filters}
        appliedFilters={tableController(TableKey)?.getExternalFilter()}
        setAppliedFilters={setESFilters}
        minDate={lastCampaignMinDate}
        contactSearchQuery={stateApp.contactSearchQuery}
      />
      <div style={{ padding: '0px 30px' }}>
        <CampaignAnalytics
          appliedFilters={tableController(TableKey)?.getExternalFilter()}
          contactSearchQuery={stateApp.contactSearchQuery}
        />
        <MRTTable name={TableKey} />
      </div>
    </div>
  );
};

export default CampaignManagement;
