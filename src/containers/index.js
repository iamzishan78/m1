import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import DocumentsTable from "components/Table/Documents/DocumentsTable";
import { testSagaAction } from 'store/actions/sagaTest';

const documentTableProps = state => ({
});

const documentTableDispatch = (dispatch) => {
  return bindActionCreators(
    {
        testSagaAction
    },
    dispatch
  );
};

export const DocumentsTableContainer = connect(documentTableProps, documentTableDispatch)(DocumentsTable);
