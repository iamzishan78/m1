import React, { useState, useEffect, useMemo } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { set } from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import GavelIcon from '@material-ui/icons/Gavel';
import LocationIcon from '@material-ui/icons/Place';
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector } from 'react-redux';
import TabPanels from 'components/Shared/TabPanels';
import TabButtons from 'components/Shared/TabPanels/TabButtons';
import Tags from 'components/Shared/Tagger';
import SuggestedTaxOwnersTable from 'components/Table/TaxOwners/SuggestedTaxOwnersTable';
import AssociatedWellsParcelTable from 'components/Table/Wells/AssociatedWellsParcelTable';
import RelatedDetailsDocumentTable from 'components/Table/Documents/RelatedDetailsDocumentTable';
import Taps from '../Shared/Taps';
import { CUSTOMLAYER } from '../../graphQL/useQueryCustomLayer';
import { UPDATECUSTOMLAYER } from '../../graphQL/useMutationUpdateCustomLayer';
import ParcelSummary from './ParcelSummary';
import { copy } from 'utils/helper';
import { popupController, popupState } from 'hookstate/popupStateController';
import MRTTable from "components/MRTTable";
import { tableController } from "hookstate/tableController";
import ParcelAgreementTable from "components/Table/Parcel/ParcelAgreementTable";
import { jobController } from "hookstate/jobStateController";
import { showSuccessMessage, showErrorMessage, setMapGridCardState } from 'actions';
import { simpleTableGlobalController } from 'hookstate/simpleTableController';

const useStyles = makeStyles(theme => ({
  grid: {
    width: 'auto',
  },
  gridItem: {
    flexGrow: 1,
    display: 'flex',
    height: '100%',
  },
  gridPacelDetails: {
    flexGrow: 1,
    display: 'flex',
    height: '100%',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
  parcelSummmary: {
    marginBottom: '0px',
  },
  gridPortion: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'space-around',
    height: '100%',
  },
  gridWidthScroll: {
    maxHeight: 'calc(100% - 88px)',
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      height: '0.4em',
      width: '0.4em',
    },
    '&::-webkit-scrollbar-track': {
      '-webkitBoxShadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#929292',
      borderRadius: 5,
    },
  },
  gridItemGrey: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'space-around',
    // background: "#f6f6f6",
    position: 'relative',
    top: '0',
    left: '0',
    paddingTop: '7px',
    borderBottom: '1px solid rgb(190, 190, 190)',
    background: '#ebebeb',
  },
  gridHeaderDivision: {
    display: 'flex',
  },
  calcSummary: {
    width: '100%',
  },
  parcelMap: {
    margin: '8px',
    width: '100%',
    textAlign: 'center',
  },
  content: {
    backgroundColor: '#fff',
    padding: '16px',
  },
  dataSect: {
    height: '100%',
    borderTop: '2px solid #C9C9C9',
    color: '#757575',
    width: '100%',
    '& .MuiGrid-item': { display: 'flex', padding: '8px' },
    '& p': {
      wordWrap: 'break-word',
      margin: 'auto 0',
    },
    '& .dataLabels': {
      fontWeight: 'bold',
    },
    '& > .MuiGrid-item': {
      borderBottom: '2px solid #C9C9C9',
      borderRight: '2px solid #C9C9C9',
    },
    '& .fieldName': {
      borderLeft: '2px solid #C9C9C9',
      backgroundColor: '#EBEBEB',
    },
  },
  borderRight: {
    borderRight: '1px solid #eaeaea',
    backgroundColor: '#fff',
    padding: '15px',
  },
  qtrAndInputs: { '& input': { fontSize: '0.875rem' } },
  foodText: {
    position: 'absolute',
    bottom: '20px',
    // zIndex: "51",
    right: '0px',
    fontSize: '10px',
    color: '#6e6e6e',
    margin: '0 !important',
    textAlign: 'right',
    height: '0',
    paddingRight: '10px',
    '& span': {
      fontWeight: 'bold',
    },
  },
  subContent: {
    '& div': {
      '&>.MuiPaper-root': {
        '&>:nth-child(3)': {
          height: 'calc(100vh - 53vh ) !important',
          '& .MuiTableCell-paddingCheckbox': {
            position: 'unset',
          },
        },
      },
    },
  },
  subContent2: {
    '& div': {
      '&>.MuiPaper-root': {
        '&>:nth-child(3)': {
          height: 'calc(100vh - 35vh ) !important',
          '& .MuiTableCell-paddingCheckbox': {
            position: 'unset',
          },
        },
      },
    },
  },

  tapsPanels: {
    '& .MuiBox-root': { padding: '0' },
  },
  tapsPanelsPadding: {
    '& .MuiBox-root': { padding: '0' },
  },
  tapsLabelsButtonsSelected: {
    boxShadow: 'none',
    color: '#fff',
    backgroundColor: theme.palette.secondary.main,
    '&:hover': { color: '#757575', boxShadow: 'none !important' },
  },
  tapsLabelsButtons: {
    boxShadow: 'none',
    backgroundColor: '#fff',
    color: '#757575',
    '&:hover': { boxShadow: 'none !important' },
  },
  documentHeader: {
    display: 'flex',
    '& span': {
      marginTop: '2px',
      marginLeft: '5px',
    },
  },
  parcelDocument: {
    '& .MuiTableRow-root': {
      '&>:nth-child(2) ': {
        '& .fileName': {
          width: '375px !important',
        },
      },
    },
  },
  tags: {
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
  },

  toogleButtons: {
    zIndex: '9999',
    padding: '0.5rem 0.75rem 0.5rem 1.25rem'
  },
}));

const setSelectedTab = simpleTableGlobalController.setSelectedTab;

export default function ParcelsDetailCard({ id, selectTabIndex }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [parcelObj, setParcelObj] = useState();
  const [properties, setProperties] = useState();
  const tractPerUnitGridState = tableController("TractPerUnitTable").useState(['data']).stateValue;
  const tractUnitsGridState = tableController("TractUnitsTable").useState(['data']).stateValues;
  const tractPotentialUnitsState = tableController("TractPotentialUnitsTable").useState(['data']).stateValues;
  const {
    stateValues: { tabKey: selectedTab },
  } = simpleTableGlobalController.useState(['tabKey']);

  const contactsAdded = useSelector(state => state?.common?.contactsAdded);
  const [updateCustomLayer, { data: updatedParcel }] = useMutation(UPDATECUSTOMLAYER);

  const [getCustomLayer, { data: dataCustomLayer }] = useLazyQuery(CUSTOMLAYER);

  useEffect(() => {
    dispatch(
      setMapGridCardState({
        mapGridCardActivated: false,
      })
    );
  }, []);

  useEffect(() => {
    if (contactsAdded) setSelectedTab(0);
  }, [contactsAdded]);

  useEffect(() => {
    if (id) {
      getCustomLayer({
        variables: {
          id,
        },
      });
    }
  }, [id]);

  useEffect(() => {
    if (dataCustomLayer && dataCustomLayer.customLayer) {
      let shape = copy(dataCustomLayer.customLayer.shape);
      if (typeof shape === 'string') {
        shape = JSON.parse(shape);
      }
      const data = {
        ...dataCustomLayer.customLayer,
        shape,
        state: dataCustomLayer.customLayer.state,
        qtrQtr: {
          nwnw: false,
          nenw: false,
          swnw: false,
          senw: false,
          nwne: false,
          nene: false,
          swne: false,
          sene: false,
          nwsw: false,
          nesw: false,
          swsw: false,
          sesw: false,
          nwse: false,
          nese: false,
          swse: false,
          sese: false,
        },
      };
      setParcelObj(data);

      setProperties(shape.properties);
    }
  }, [dataCustomLayer, tractPerUnitGridState?.data, tractUnitsGridState?.data, tractPotentialUnitsState?.data]);

  const overrideMeta = useMemo(() => ({
    tabLabels: ['Tract Ownership', 'Potential Ownership'],
    defaultFilters: [
      { field: "shape._id", value: parcelObj?._id },
      { field: "contact.IsDeleted", value: "false" },
      { field: "descriptor", value: "ParcelDescriptor" }
    ],
    customProps: { customLayer: parcelObj }
  }), [parcelObj]);

  const overrideMetaTractUnits = useMemo(() => ({
    tabLabels: ['Related Units', 'Potential Units'],
    defaultFilters: [
      { field: "parcel._id", value: parcelObj?._id },
    ],
    customProps: { customLayer: parcelObj }
  }), [parcelObj]);

  const overrideMetaTractPotentialUnits = useMemo(() => ({
    tabLabels: ['Related Units', 'Potential Units'],
    defaultFilters: [
      {
        type: 'geo_intersects',
        field: 'shapeJson.geometry',
        value: parcelObj?.shapeJson?.geometry,
      },
      { field: 'layer.keyword', value: 'unit' }
    ],
    customProps: { customLayer: parcelObj }
  }), [parcelObj]);

  useEffect(() => {
    if (updatedParcel) {
      if (updatedParcel.updateCustomLayer?.success) {
        dispatch(showSuccessMessage('Successfully updated the tract'));

        // Updating stateapp parcel object
        const { customLayer } = updatedParcel.updateCustomLayer;
        const feature = JSON.parse(customLayer.shape);
        feature.id = customLayer._id;
        feature.properties.id = customLayer._id;
        feature.layer = { id: 'parcel' };
        popupController.updateState({
          selectedParcel: { ...feature.properties, feature },
        });
      } else {
        dispatch(showErrorMessage('Failed to update parcel'));
      }
    }
  }, [updatedParcel]);

  const updateProperties = (e, field, value) => {
    if (e?.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
    const data = copy(parcelObj);
    const { shape } = data;
    set(shape, `properties.${field}`, value);

    const customLayer = {
      shapeJson: shape,
      shape: JSON.stringify(shape),
    };

    if (field === 'shapeLabel') {
      popupController.updateState({
        selectedParcel: { ...popupState.selectedParcel?.get({ noproxy: true }), shapeLabel: value },
      });
      customLayer.name = value;
    }

    updateCustomLayer({
      variables: {
        customLayerId: data._id,
        customLayer,
      },
    }).then(() => {
      jobController.toggleBulkUpload()
    });
  };

  const updateCustomProperties = (type, value, key) => {
    const { shape } = parcelObj;
    set(properties, `${key}`, value);
    properties.custom_data_arr?.forEach(data => {
      properties.custom_data[data.key] = data.value;
    });
    const customLayer = {};
    shape.properties = properties;
    customLayer.shape = JSON.stringify(shape);
    customLayer.shapeJson = shape;
    updateCustomLayer({
      variables: {
        customLayerId: parcelObj._id,
        customLayer,
      },
    }).then(() => {
      jobController.toggleBulkUpload()
    });
  };

  function Header() {
    return (
      <TabButtons
        labels={['Tract Ownership', 'Potential Ownership']}
        value={selectedTab}
        setValue={n => {
          setSelectedTab(n);
        }}
      />
    );
  }

  function DocumentHeader() {
    return (
      <div className={classes.documentHeader}>
        <DescriptionOutlinedIcon />
        <span>ASSOCIATED DOCUMENTS</span>
      </div>
    );
  }

  function RunsheetHeader() {
    return (
      <div className={classes.documentHeader}>
        <GavelIcon />
        <span>RUNSHEET INSTRUMENTS</span>
      </div>
    );
  }

  function WellHeader() {
    return (
      <div className={classes.documentHeader}>
        <LocationIcon />
        <span>ASSOCIATED WELLS</span>
      </div>
    );
  }

  return parcelObj ? (
    <Grid item sm={12} container className={classes.gridWidthScroll}>
      <Grid item xs={12} style={{ padding: '10px 15px 0px 15px' }} className={classes.border}>
        <div className={classes.tags}>
          <Tags width="100%" targetSourceId={id} targetLabel="parcel" publicLeftBottom />
        </div>
      </Grid>
      <Grid item sm={12}>
        <Taps
          tabLabels={['Summary', 'Interest Owners', 'Runsheet', 'Wells', 'Units', 'Documents']}
          openTabIdex={selectTabIndex}
          tabPanels={[
            <div style={{ overflow: 'overlay', maxHeight: 'calc(100vh - 285px)' }}>
              <ParcelSummary
                id={id}
                customLayer={copy(parcelObj)}
                properties={properties}
                setProperties={setProperties}
                updateProperties={updateProperties}
                updateCustomProperties={updateCustomProperties}
              />
            </div>,
            <TabPanels
              value={selectedTab}
              panels={[
                <div>
                  <MRTTable name="TractPerUnitTable" overrideMeta={overrideMeta} />
                </div>,
                <div className={classes.subContent}>
                  <SuggestedTaxOwnersTable
                    jobType="PARCELINTERESTS"
                    jobName="Converting potential owner to parcel owner"
                    customLayer={copy(parcelObj)}
                    parent="potentialOwnersPerParcel"
                    targetLabel="well"
                    header={<Header />}
                    setSelectedTab={setSelectedTab}
                    dense
                  />
                </div>,
              ]}
            />,
            <div className={classes.subContent}>
              <ParcelAgreementTable
                esIndex='runsheetinstrument_flat'
                parent="ownersPerParcel"
                targetLabel="parcelRunsheet"
                customLayer={copy(parcelObj)}
                dense
                header={<RunsheetHeader />}
                isCheckboxSticky={true}
              />
            </div >,
            <div className={classes.subContent}>
              <AssociatedWellsParcelTable
                customLayer={copy(parcelObj)}
                parent="associatedWellsPerParcel"
                targetLabel="well"
                header={<WellHeader />}
                isCheckboxSticky={true}
                showTracks
              />
            </div>,
            <TabPanels
              value={selectedTab}
              panels={[
                <div>
                  <MRTTable name="TractUnitsTable" overrideMeta={overrideMetaTractUnits} />
                </div>,
                <div>
                  <MRTTable name="TractPotentialUnitsTable" overrideMeta={overrideMetaTractPotentialUnits} />
                </div>,
              ]}
            />,
            <div className={`${classes.subContent} ${classes.parcelDocument}`}>
              <RelatedDetailsDocumentTable
                customLayer={copy(parcelObj)}
                relatedObjectType="Parcel"
                parent="associatedDocumentsPerParcel"
                targetLabel="documents"
                header={<DocumentHeader />}
                dense
              />
            </div>,
          ]
          }
        />
      </Grid >
    </Grid >
  ) : (
    <div
      style={{
        padding: '20px',
        position: 'absolute',
        height: '100%',
        width: '100%',
      }}
    >
      <CircularProgress size={80} disableShrink color="secondary" />
    </div>
  );
}
