import { entityTypeOptions } from "components/ContactDetailedInfo/helper";

const contactForm = ({ contactOwerOptions }) => {
  const formFields = [
    {
      label: "First Name",
      name: "firstName"
    },
    {
      label: "Middle Name",
      name: "middleName"
    },
    {
      label: "Last Name",
      name: "lastName"
    },
    {
      label: "Entity Type",
      name: "ownerType",
      defaultOptions: entityTypeOptions,
      renderField: "autoComplete",
      filterKey: "ownerType.keyword",
      esIndex: "contacts_flat",
    },
    {
      label: "Home phone",
      name: "homePhone"
    },
    {
      label: "Mobile Phone",
      name: "mobilePhone"
    },
    {
      label: "Email",
      name: "primaryEmail"
    },
    {
      label: "Address #1",
      name: "address1"
    },
    {
      label: "Address #2",
      name: "address2"
    },
    {
      label: "City",
      name: "city"
    },
    {
      label: "State",
      name: "state"
    },
    {
      label: "Zip Code",
      name: "zip"
    },
    {
      label: "Country",
      name: "country"
    },
    {
      label: "Contact Owner",
      name: "contactOwner",
      defaultOptions: contactOwerOptions,
      renderField: "autoComplete",
    },
  ]

  return formFields
}

export default contactForm;