import { contactStatusOptions } from "components/ContactDetailedInfo/helper";
import { FEATURES } from "components/Shared/FeatureFlag/common";
import FeatureFlag from "components/Shared/FeatureFlag/FeatureFlagComponent";
import MonetizationOnIcon from "@material-ui/icons/LocalAtmOutlined";
import GlobalSettings from "GlobalSettings";

const ContactsHeadCells = [
  {
    name: "_id",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: false,
      download: false,
      print: false,
      viewColumns: false,
    },
  },
  {
    name: "entity",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: false,
      download: false,
      print: false,
      viewColumns: false,
    },
  },
  {
    name: "address1",
    label: "Primary Address 1",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: false,
      download: false,
      print: false,
      viewColumns: false,
    },
  },
  {
    name: "address2",
    label: "Primary Address 2",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: false,
      download: false,
      print: false,
      viewColumns: false,
    },
  },
  {
    name: "city",
    label: "City",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: false,
      download: false,
      print: false,
      viewColumns: false,
    },
  },
  {
    name: "state",
    label: "State",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: false,
      download: false,
      print: false,
      viewColumns: false,
    },
  },
  {
    name: "zip",
    label: "Zip",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: false,
      download: false,
      print: false,
      viewColumns: false,
    },
  },
  {
    name: "country",
    label: "Country",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: false,
      download: false,
      print: false,
      viewColumns: false,
    },
  },
  {
    name: "name",
    label: "Name",
    esKey: "name.keyword",
    options: {
      ...GlobalSettings.muiGridControlOptions,
      sort: true,
      filter: true,
      customRender: (value, tableMeta) => {
        return (
          <>
            <a
              href={`/contact/details/${tableMeta.rowData[0]}/?tenant=${window.sessionStorage.getItem("tenantName")}`}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                fontWeight: 600, color: "#17aadd", cursor: "pointer", textDecoration: "initial"
              }}
              rel="noreferrer"
            >
              {value}

              {!!(tableMeta.rowData[ContactsHeadCells.findIndex((val) => val.name === "isPurchased")]) && (
                <FeatureFlag feature={FEATURES.IDICORE}>
                  <MonetizationOnIcon style={{
                    margin: "10px",
                    color: "gray"
                  }} />
                </FeatureFlag>
              )}
            </a>
          </>
        );
      },
    },
    style: { minWidth: 185 },
  },
  {
    name: "title",
    label: "Title",
    esKey: "title.keyword",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: true,
    },
  },
  {
    name: "firstName",
    label: "First Name",
    esKey: "firstName.keyword",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: true,
    },
  },
  {
    name: "middleName",
    label: "Middle Name",
    esKey: "middleName.keyword",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: true,
    },
  },
  {
    name: "lastName",
    label: "Last Name",
    esKey: "lastName.keyword",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: true,
    },
  },
  {
    name: "suffix",
    label: "Suffix",
    esKey: "suffix.keyword",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: true,
    },
  },
  {
    name: "companyName",
    label: "Company Name",
    esKey: "companyName.keyword",
    options: {
      // display: true,
      display: false,
      filter: false,
      searchable: false,
      sort: true,
    },
  },
  {
    name: "ownerType",
    label: "Entity Type",
    esKey: "ownerType.keyword",
    options: {
      display: true,
      filter: true, // i guess we cant dynamically remove the filter when hiding a column enabled by default
      searchable: false,
      sort: true,
    },
  },
  {
    name: "fullContactAddress",
    label: "Primary Address",
    // editable: true,
    esKey: ["address1.keyword", "city.keyword", "state.keyword", "zip.keyword"],
    options: {
      ignoreGlobal: true,
      dbName: "address1",
      sort: true,
      filter: true,
    },
  },
  {
    name: "melissaRowsCount",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: false,
      download: false,
      print: false,
      viewColumns: false,
    },
  },
  {
    name: "homePhone",
    label: "Primary Home Phone",
    esKey: "homePhone.keyword",
    options: {
      // display: true,
      filter: true,
      searchable: false,
      sort: true,
    },
  },
  {
    name: "mobilePhone",
    label: "Primary Mobile Phone",
    esKey: "mobilePhone.keyword",
    options: {
      // display: true,
      filter: true,
      searchable: false,
      sort: true,
    },
  },
  {
    name: "mobilephone2",
    label: "Mobile Phone 2",
    esKey: "mobilephone2.keyword",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: true,
    },
  },
  {
    name: "AltPhone",
    label: "Primary Work Phone",
    esKey: "AltPhone.keyword",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: true,
    },
  },
  {
    name: "mobilephone3",
    label: "Mobile Phone 3",
    esKey: "mobilephone3.keyword",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: true,
    },
  },
  {
    name: "homePhone2",
    label: "Home Phone 2",
    esKey: "homePhone2.keyword",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: true,
    },
  },
  {
    name: "homePhone3",
    label: "Home Phone 3",
    esKey: "homePhone3.keyword",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: true,
    },
  },
  {
    name: "AltPhone2",
    label: "Work Phone 2",
    esKey: "AltPhone2.keyword",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: true,
    },
  },
  {
    name: "AltPhone3",
    label: "Work Phone 3",
    esKey: "AltPhone3.keyword",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: true,
    },
  },
  {
    name: "primaryEmail",
    label: "Primary Email",
    esKey: "primaryEmail.keyword",
    options: {
      // display: true,
      filter: true,
      searchable: false,
      sort: true,
    },
  },
  {
    name: "contactOwner",
    label: "Contact Owner",
    esKey: "contactOwners.name.keyword",
    options: {
      dbName: "contactOwners.name",
      // display: true,
      filter: true,
      filterOptions: {
        names: [],
      },
      searchable: false,
      sort: true,
    },
  },
  {
    name: "secondaryEmail",
    label: "Email 2",
    esKey: "secondaryEmail.keyword",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: true,
    },
  },
  {
    name: "linkedIn",
    label: "LinkedIn Profile",
    esKey: "linkedIn.keyword",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: true,
    },
  },
  {
    name: "facebook",
    label: "Facebook Profile",
    esKey: "facebook.keyword",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: true,
    },
  },
  {
    name: "twitter",
    label: "Twitter Profile",
    esKey: "twitter.keyword",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: true,
    },
  },
  {
    name: "jobTitle",
    label: "Job Title",
    esKey: "jobTitle.keyword",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: true,
    },
  },
  {
    name: "leadStage",
    label: "Lead Stage",
    esKey: "leadStage.keyword",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: true,
    },
  },
  {
    name: "age",
    label: "Age",
    esKey: "age.keyword",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: true,
    },
  },
  {
    name: "relatives",
    label: "Relative Names",
    esKey: "relatives.keyword",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: true,
    },
  },
  {
    name: "email3",
    label: "Email 3",
    esKey: "email3.keyword",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: true,
    },
  },
  {
    name: "status",
    label: "Stage",
    esKey: "status.keyword",
    options: {
      display: true,
      filter: true,
      searchable: true,
      sort: true,
    },
    custom: {
      formatedFilterOptions: contactStatusOptions,
    },
  },
  {
    name: "contactStatus",
    label: "Status",
    esKey: "contactStatus.keyword",
    options: {
      display: true,
      filter: true,
      searchable: true,
      sort: true,
    },
  },
  {
    name: "timeZone",
    label: "Time Zone",
    esKey: "timeZone.keyword",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: true,
    },
  },
  {
    name: "territory",
    label: "Territory",
    esKey: "territory.keyword",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: true,
    },
  },
  {
    name: "campaignName",
    label: "Campaign Name",
    esKey: "campaignName.keyword",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: true,
    },
  },
  {
    name: "notes",
    label: "Comments",
    esKey: "notes.keyword",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: true,
      viewColumns: false,
    },
  },
  {
    name: "website ",
    label: "Website",
    esKey: "website.keyword",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: true,
    },
  },
  {
    name: "industryType",
    label: "Industry Type",
    esKey: "industryType.keyword",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: true,
    },
  },
  {
    name: "leadSource",
    label: "Lead Source",
    esKey: "leadSource.keyword",
    // editable: false,
    options: {
      display: false,
      sort: true,
      filter: false,
      filterOptions: {
        names: [],
      },
    },
  },
  {
    name: "wellInterestCount",
    label: "Well Interest Count",
    esKey: "interestSummary.wellInterestCount",
    // editable: false,
    noFilter: true,
    options: {
      display: false,
      sort: true,
      filter: false,
      filterOptions: {
        names: [],
      },
    },
  },
  {
    name: "unitInterestCount",
    label: "Unit Interest Count",
    esKey: "interestSummary.unitInterestCount",
    // editable: false,
    noFilter: true,
    options: {
      display: false,
      sort: true,
      filter: false,
      filterOptions: {
        names: [],
      },
    },
  },
  {
    name: "unitNraSum",
    label: "Unit NRA",
    esKey: "interestSummary.unitNraSum",
    // editable: false,
    noFilter: true,
    options: {
      display: false,
      sort: true,
      filter: false,
      filterOptions: {
        names: [],
      },
    },
  },
  {
    name: "tractInterestCount",
    label: "Tract Interest Count",
    esKey: "interestSummary.tractInterestCount",
    // editable: false,
    noFilter: true,
    options: {
      display: false,
      sort: true,
      filter: false,
      filterOptions: {
        names: [],
      },
    },
  },
  {
    name: "lastUpdateBy.name",
    label: "Updated By",
    esKey: "lastUpdateBy.name.keyword",
    options: {
      ignoreGlobal: true,
      display: false,
      sort: true,
      filter: false,
      filterOptions: {
        names: [],
      },
    },
  },
  {
    name: "lastUpdateAt",
    label: "Last Updated",
    esKey: "lastUpdateAt",
    noFilter: true,
    options: {
      ignoreGlobal: true,
      filter: false,
      sort: true,
      sortDescFirst: true,
      sortDirection: "desc",
    },
  },
  // {
  //   name: "createBy.name",
  //   label: "Created By",
  //   options: {
  //     display: false,
  //     filter: false,
  //     searchable: false,
  //     sort: false,
  //   },
  // },
  // {
  //   name: "createAt",
  //   label: "Created Date",
  //   options: {
  //     display: false,
  //     filter: false,
  //     searchable: false,
  //     sort: false,
  //   },
  // },
  {
    name: "tags",
    label: "Tags ",
    esKey: "tags.tag.keyword",
    options: {
      dbName: "tags.tag",
      sort: true,
      ignoreGlobal: true,
      download: false,
      print: false,
      filter: true,
      filterOptions: {
        names: [],
      },
    },
  },
  {
    name: "commentsCounter",
    label: " ",
    options: {
      dbName: "comments.comment",
      ignoreGlobal: true,
      filter: false,
      searchable: false,
      sort: true,
      download: false,
      print: false,
      viewColumns: false,
    },
  },
  {
    name: "isPurchased",
    label: "Purchased Data Exists",
    esKey: "isPurchased",
    options: {
      display: false,
      filter: true,
      forceFilter: true,
      searchable: false,
      sort: false,
      download: false,
      print: false,
      viewColumns: false,
    },
    custom: {
      key_as_string: true,
      isPurchased: true,
      formatedFilterOptions: [
        {
          label: "Yes",
          value: "true",
        },
        {
          label: "No",
          value: "false",
        },
      ],
    },
  },
];

export default ContactsHeadCells;
