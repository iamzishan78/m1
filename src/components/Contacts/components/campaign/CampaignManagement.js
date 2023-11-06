import React, { useState, useEffect, useContext } from 'react';
import { useLazyQuery } from '@apollo/client';

import { AppContext } from 'AppContext';

import CampaignAnalytics from 'components/Contacts/components/CampaignAnalytics';
import CustomCampaignFilters from 'components/Contacts/components/CampaignFilter';
import { GET_ES_MIN_VALUE } from 'graphQL/useQueryESMinValue';
import MRTTable from 'components/MRTTable';

const CampaignManagement = () => {
  const esIndex = 'campaigns_flat';
  const searchFields = ['name', '_all'];
  const [lastCampaignMinDate, setLastCampaignMinDate] = useState('');
  const [tableFilters, setTableFilters] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState({
    fromDate: null,
    toDate: null,
  });
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [stateApp] = useContext(AppContext);

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

  return (
    <div style={{ marginTop: '90px' }}>
      <CustomCampaignFilters
        setFromDate={setFromDate}
        setToDate={setToDate}
        esIndex={esIndex}
        searchFields={searchFields}
        tableFilters={tableFilters}
        appliedFilters={{ ...appliedFilters, fromDate, toDate }}
        setAppliedFilters={setAppliedFilters}
        minDate={lastCampaignMinDate}
        contactSearchQuery={stateApp.contactSearchQuery}
      />
      <div style={{ padding: '0px 30px' }}>
        <CampaignAnalytics
          appliedFilters={appliedFilters}
          contactSearchQuery={stateApp.contactSearchQuery}
        />
        <MRTTable name="CampaignTable" />
      </div>
    </div>
  );
};

export default CampaignManagement;
