import TabButtons from 'components/Shared/TabPanels/TabButtons';
import { simpleTableGlobalController } from 'hookstate/simpleTableController';
import React, { useEffect } from 'react';

const TabHeader = ({ labels }) => {
  const {
    stateValues: { tabKey },
  } = simpleTableGlobalController.useState(['tabKey']);

  useEffect(() => {
    return () => {
      simpleTableGlobalController.setSelectedTab(0);
    };
  }, []);

  return (
    <TabButtons
      labels={labels}
      value={tabKey}
      setValue={n => simpleTableGlobalController.setSelectedTab(n)}
    />
  );
};

export default TabHeader;
