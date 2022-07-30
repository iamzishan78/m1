import { history } from "store";
import GlobalSettings from "..//..//..//GlobalSettings.js";
import GlobalStyles from "..//..//..//GlobalStyles.js";
import Typography from "@material-ui/core/Typography";

const RevenuePropertiesHeadCells = [
  {
    name: "_id",
    options: { filter: false, display: false, sort: false, viewColumns: false },
  },
  {
    /// this is the control column for properties 
    name: "number",
    label: "Property",
    esKey: "number.keyword",
    options: {
      ...GlobalSettings.muiGridInfScrollOptions,
        ignoreGlobal: true,

      customRender: (value, tableMeta) => {
        const splitNumber = value?.split("_");

        const styles = {
          fontWeight: GlobalStyles.font.boldFontWeight,
          color: GlobalStyles.colors.lightBlue,
          cursor: GlobalStyles.hyperlink.cursor,
          position: 'absolute',
          left: '70px',
        };

        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'start'
            }}
          >
          <div
            style={{
            }}
          >
          {<span 
            style={{color: GlobalStyles.colors.mutedGrey}}
            >{tableMeta.rowIndex + 1}</span>}
          </div>


          <Typography 
            onClick={(e) => {
              e.stopPropagation();
              history.push(`/revenue/property/details/${tableMeta.rowData[0]}`);
            }}
            noWrap
            variant='body2'
            style={styles}
          >
            {splitNumber?.[0]
              ? `${splitNumber?.[0]} - ${tableMeta?.rowData[2]}`
              : tableMeta?.rowData[2]}
            </Typography>

            </div>
        );
      },
    },
  },
  {
    name: "name",
    label: "Property Name",
    esKey: "name.keyword",
    options: {
      display: false,
    }
  },
  {
    name: "state",
    label: "State",
    esKey: "state.keyword",
  },
  {
    name: "county",
    label: "County",
    esKey: "county.keyword",
  },
  {
    name: "wellApiNumber",
    label: "Well API",
    esKey: "wells.apiNumber.keyword",
  },
  {
    name: "wellName",
    label: "Well Name",
    esKey: "wells.wellName.keyword",
  },
  {
    name: "payorName",
    label: "Operator",
    esKey: "operator.name.keyword",
  },
  {
    name: "status",
    label: "Pay Status",
    esKey: "status.keyword",
  },
  {
    name: "checkNumber",
    label: "Last Check #",
    esKey: "lastCheck.checkNumber.keyword",
  },
  {
    name: "lastChecked",
    label: "Last Check",
    esKey: "lastCheck.checkDate",
    custom: {
      key_as_string: true,
      isDate: true,
    },
  },
  {
    name: "prospectID",
    label: "Prospect",
    esKey: "prospectID.keyword",
  },
  {
    name: "acquisitionID",
    label: "Acquisition ID",
    esKey: "acquisitionID.keyword",
  },
  {
    name: "internalID",
    label: "Internal ID #",
    esKey: "internalID.keyword",
  },
  {
    name: "internalCompany",
    label: "Internal Company",
    esKey: "internalCompany.keyword",
  },
  {
    name: "source",
    label: "Source",
    esKey: "source.keyword",
  },
  {
    name: "tags",
    label: "Tags",
    esKey: "tags.tag.keyword",
    options: {
      ignoreGlobal: true,
    }
  },
  {
    name: "commentsCounter",
    label: " ",
    options: {
      ignoreGlobal: true,
      dbName: "comments.comment",
      filter: false,
      searchable: false,
      sort: true,
      download: false,
      print: false,
      viewColumns: false,
    },
  },
  {
    name: "approvalStatus",
    label: "Status",
    esKey: "approvalStatus.keyword",
    options: {
      ignoreGlobal: true,
      customHeadLabelRender: () => (
        <>
          <div> </div>
        </>
      ),
      sort: true,
      filter: true,
    },
  },
];

export default RevenuePropertiesHeadCells;
