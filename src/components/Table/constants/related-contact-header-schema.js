import { makeStyles } from '@material-ui/core/styles'
import GlobalSettings from "GlobalSettings";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: 'none',
    color: "#17aadd !important"
  }
}))

const LinkCell = ({value, link}) => {
  const classes = useStyles();

  return (
    <Link to={link} className={classes.link}>
          {value}
      </Link>
  )
}

const ActivitiesHeadCells = [
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
    name: "name",
    label: "Name",
    esKey: "name.keyword",
    options: {
      ...GlobalSettings.muiGridStandardOptions,
      display: true,
      sort: true,
      filter: true,
      customRender: (value, tableMeta) => {
        const tenant = sessionStorage.getItem("tenantName")
        return (<LinkCell link={`/contact/details/${tableMeta.rowData[0]}?tentant=${tenant}`} value={value} />)
      }
    },
  },
  {
    name: "address1",
    label: "Address",
    esKey: "address1.keyword",
    options: {
      display: true,
      sort: true,
      filter: true,
    },
  },
  {
    name: "mobilePhone",
    label: "Mobile Phone",
    esKey: "mobilePhone.keyword",
    options: {
      display: true,
      sort: true,
      filter: true,
    },
    style: { minWidth: 185 }
  },
  {
    name: "homePhone",
    label: "Home Phone",
    esKey: "homePhone.keyword",
    options: {
      display: true,
      sort: true,
      filter: true,
    },
    style: { minWidth: 185 }
  },
  {
    name: "primaryEmail",
    label: "Email",
    esKey: "primaryEmail.keyword",
    options: {
      display: true,
      sort: true,
      filter: true,
    },
    style: { minWidth: 200 }
  },
  {
    name: "relationshipType",
    label: "Relationship Type",
    esKey: "relatedContacts.relationshipType.keyword",
    options: {
      display: true,
      sort: true,
      filter: true,
    },
    style: { minWidth: 250 }
  },
];

export default ActivitiesHeadCells;