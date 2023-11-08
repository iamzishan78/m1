import React from 'react';
import TabButtons from 'components/Shared/TabPanels/TabButtons';
import { simpleTableGlobalController } from 'hookstate/simpleTableController';

const TabHeader = ({ labels }) => {
  const {
    stateValues: { tabKey },
  } = simpleTableGlobalController.useState(['tabKey']);

  return (
    <TabButtons
      labels={labels}
      value={tabKey}
      setValue={n => simpleTableGlobalController.setSelectedTab(n)}
    />
  );
};

export default TabHeader;
