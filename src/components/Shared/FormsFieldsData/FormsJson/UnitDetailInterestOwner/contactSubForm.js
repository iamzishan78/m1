
import unitInterestOwnerForm from 'components/Shared/FormsFieldsData/FormsJson/UnitDetailInterestOwner/unitInterestOwnerForm';

const contactSubForm = ({ getValues, setValue }) => {
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
    unitInterestOwnerForm({
      getValues,
      setValue,
    })[0],
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
      name: "email"
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
      name: "zipCode"
    },
    ...unitInterestOwnerForm({
      getValues,
      setValue,
    }).slice(1)
  ]

  return formFields
};

export default contactSubForm;