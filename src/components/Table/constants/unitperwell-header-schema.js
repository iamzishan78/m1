import { GlobalStickyStyles } from "GlobalSettings";

const UnitWellHeadCells = [
  {
    name: "_id", options: { filter: false, display: false, sort: false, viewColumns: false, }
  },
  {
    name: "wellId",
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
    name: "Well", label: "Well", options: {
      dbName: "well.apiNumber",
      sort: true,
      filter: false,
      ...GlobalStickyStyles({
        setCellProps: {
          left: "77px",
          maxWidth: "350px",
          left: "77px"
        },
        setCellHeaderProps: {
          left: "77px",
          paddingLeft: '37px',
          left: "77px"
        }
      }),
      ignoreGlobal: true,
    }
  },
  // {
  //   name: "wellName", label: "Well", esKey: 'well.wellName.keyword', options: {
  //     sort: true,
  //     filter: true,
  //   }
  // },

  {
    name: "leaseId", label: "Lease Number", esKey: 'leaseId.keyword', options: {
      dbName: "well.leaseId",
      display: true,
      filter: true,
      searchable: false,
      sort: true,
      download: false,
      print: false,
      viewColumns: false,
    }
  },
  {
    name: "lease", label: "Lease Name", esKey: 'lease.keyword', options: {
      dbName: "well.lease",
      display: true,
      filter: true,
      searchable: false,
      sort: true,
      download: false,
      print: false,
      viewColumns: false,
    }
  },
  {
    name: "operator", label: "Operator", esKey: 'operator.keyword', options: {
      dbName: "well.leaseAcres",
      sort: true,
      filter: false,
    }
  },
  // {
  //   name: "leaseDescription", label: "Lease", options: {
  //     dbName: "well.leaseDescription",
  //     sort: true,
  //     filter: false,
  //   }
  // },
  // {
  //   name: "leaseAcres", label: "Lease Acres", options: {
  //     dbName: "well.leaseAcres",
  //     sort: true,
  //     filter: false,
  //   }
  // },
  {
    name: "wellType", label: "Well Type", esKey: 'wellType.keyword', options: {
      sort: true,
      filter: true,
    }
  },
  {
    name: "wellBoreProfile", esKey: 'wellBoreProfile.keyword', label: "WellBore Profile", options: {
      sort: true,
      filter: true,
    }
  },
  {
    name: "wellStatus", esKey: 'wellStatus.keyword', label: "Well Status", options: {
      sort: true,
      filter: true,
    }
  },
  {
    name: "entity", label: "Entity", options: {
      display: false,
      filter: false,
      searchable: false,
      sort: false,
      download: false,
      print: false,
      viewColumns: false,
    }
  },
  {
    name: "year", label: "Year", options: {
      display: false,
      filter: false,
      searchable: false,
      sort: false,
      download: false,
      print: false,
      viewColumns: false,
    }
  },
  {
    name: "globalLod", label: "Global LOD", options: {
      display: false,
      filter: false,
      searchable: false,
      sort: false,
      download: false,
      print: false,
      viewColumns: false,
    }
  },
  {
    name: "tags",
    label: "Tags ",
    esKey: "tags.tag.keyword",
    options: {
      dbName: "tags.tag",
      sort: true,
      filter: true,
      download: false,
      print: false,
      filterOptions: {
        names: [],
        logic(rowVal, pickedTags) {
          let containIts = true;
          pickedTags.map((pickedTag) => {
            if (rowVal[0].indexOf(pickedTag) === -1) {
              containIts = false;
            }
          });
          return !containIts;
        },
      },
    },
  },
  {
    name: "commentsCounter",
    label: " ",
    options: {
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
    name: "isTracked",
    label: "Track",
    options: {
      sort: false,
      filter: false,
      searchable: false,
      download: false,
      print: false,
      filterOptions: {
        names: ["Tracked", "Untracked"],
        logic(tracked, filterVal) {
          return !(
            (filterVal.indexOf("Tracked") >= 0 && tracked) ||
            (filterVal.indexOf("Untracked") >= 0 && !tracked)
          );
        },
      },
      filterType: "dropdown",
    },
  },
  {
    name: "coordinates",
    label: " ",
    options: {
      filter: false,
      sort: false,
      searchable: false,
      download: false,
      print: false,
      viewColumns: false,
    },
  },
  {
    name: "isOverridden", label: "is Overridden", options: {
      display: false,
      filter: false,
      searchable: false,
      sort: false,
      download: false,
      print: false,
      viewColumns: false,
    }
  },
];

export default UnitWellHeadCells;