
import parcelOwnerForm from 'components/Shared/FormsFieldsData/FormsJson/ParcelDetailInterestOwner/parcelOwnerForm';

const contactSubForm = (contact) => {
  return [
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
    parcelOwnerForm({})[0],
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
    ...parcelOwnerForm({}).slice(1)
  ]
};

export default contactSubForm;